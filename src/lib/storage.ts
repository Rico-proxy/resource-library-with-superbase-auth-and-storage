import { supabase } from '@/lib/supabase'
import type { ResourceCategorySlug, ResourceDocument } from '@/types/resources'

const STORAGE_BUCKET = 'resource library files'

const categorySlugs: ResourceCategorySlug[] = ['educational', 'literature', 'history', 'business-career']
const coverTone = 'from-zinc-200 to-zinc-300'

export interface UploadedResourceObject {
  path: string
  title: string
  category: ResourceCategorySlug
  size: number
  createdAt: string | null
  extension: string
}

function isCategorySlug(value: string): value is ResourceCategorySlug {
  return categorySlugs.includes(value as ResourceCategorySlug)
}

function getFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex === -1) return ''
  return fileName.slice(dotIndex)
}

function buildObjectName(title: string, category: ResourceCategorySlug, fileName: string): string {
  const safeTitle = encodeURIComponent(title.trim() || 'untitled-resource')
  return `${Date.now()}__${category}__${safeTitle}${getFileExtension(fileName)}`
}

function parseObjectName(objectName: string): { title: string; category: ResourceCategorySlug | null; extension: string } {
  const parts = objectName.split('__')
  const rawCategory = parts[1] ?? ''
  const rest = parts.slice(2)
  const category = isCategorySlug(rawCategory) ? rawCategory : null
  const restName = rest.join('__')

  const dotIndex = restName.lastIndexOf('.')
  const encodedTitle = dotIndex === -1 ? restName : restName.slice(0, dotIndex)
  const extension = dotIndex === -1 ? '' : restName.slice(dotIndex)

  let title = encodedTitle
  try {
    title = decodeURIComponent(encodedTitle)
  } catch {
    title = encodedTitle
  }

  return {
    title,
    category,
    extension,
  }
}

function normalizeTitle(rawTitle: string): string {
  return rawTitle
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function inferCategoryFromText(text: string): ResourceCategorySlug {
  const normalized = text.toLowerCase()
  if (normalized.includes('literature') || normalized.includes('poem') || normalized.includes('novel')) {
    return 'literature'
  }
  if (normalized.includes('history') || normalized.includes('ancient') || normalized.includes('medieval')) {
    return 'history'
  }
  if (
    normalized.includes('business') ||
    normalized.includes('career') ||
    normalized.includes('finance') ||
    normalized.includes('entrepreneur')
  ) {
    return 'business-career'
  }
  return 'educational'
}

function buildAddedByFromPath(path: string): string {
  const firstSegment = path.split('/')[0] ?? ''
  if (!firstSegment || firstSegment.includes('.')) {
    return 'Resource Library Team'
  }
  if (firstSegment.length <= 10) {
    return `User ${firstSegment}`
  }
  return `User ${firstSegment.slice(0, 8)}`
}

function mapPathToResourceDocument(path: string, createdAt: string | null): ResourceDocument {
  const fileName = path.split('/').at(-1) ?? 'resource.pdf'
  const parsed = parseObjectName(fileName)
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)

  const normalizedTitle = normalizeTitle(parsed.title || fileName.replace(/\.[^/.]+$/, ''))
  const extension = parsed.extension ? parsed.extension.replace('.', '').toUpperCase() : 'FILE'

  return {
    id: path,
    title: normalizedTitle || 'Untitled resource',
    author: buildAddedByFromPath(path),
    format: extension,
    coverTone,
    storagePath: path,
    downloadUrl: data.publicUrl,
    uploadedAt: createdAt,
    rating: undefined,
    votes: undefined,
    // Store category in id/path parsing usage; category maps happen outside
  }
}

async function listAllBucketPaths(): Promise<Array<{ path: string; createdAt: string | null }>> {
  const pendingDirectories: string[] = ['']
  const visitedDirectories = new Set<string>()
  const collected: Array<{ path: string; createdAt: string | null }> = []

  while (pendingDirectories.length > 0) {
    const currentPath = pendingDirectories.shift()
    if (currentPath === undefined || visitedDirectories.has(currentPath)) {
      continue
    }
    visitedDirectories.add(currentPath)

    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list(currentPath, {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (error) {
      throw new Error(error.message)
    }

    for (const object of data ?? []) {
      const nextPath = currentPath ? `${currentPath}/${object.name}` : object.name
      const isFolderLike = !object.id || !object.metadata
      if (isFolderLike) {
        pendingDirectories.push(nextPath)
      } else {
        collected.push({ path: nextPath, createdAt: object.created_at ?? null })
      }
    }
  }

  return collected
}

function inferCategoryFromPath(path: string): ResourceCategorySlug {
  const fileName = path.split('/').at(-1) ?? ''
  const parsed = parseObjectName(fileName)
  if (parsed.category) {
    return parsed.category
  }
  return inferCategoryFromText(path)
}

export async function listCommunityDocumentsByCategory(): Promise<Record<ResourceCategorySlug, ResourceDocument[]>> {
  const initial: Record<ResourceCategorySlug, ResourceDocument[]> = {
    educational: [],
    literature: [],
    history: [],
    'business-career': [],
  }

  const paths = await listAllBucketPaths()
  const grouped = { ...initial }

  for (const file of paths) {
    const category = inferCategoryFromPath(file.path)
    const doc = mapPathToResourceDocument(file.path, file.createdAt)
    grouped[category].push(doc)
  }

  for (const category of categorySlugs) {
    grouped[category].sort((a, b) => {
      const aTime = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0
      const bTime = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0
      return bTime - aTime
    })
  }

  return grouped
}

export async function uploadResourceFile(options: {
  userId: string
  file: File
  title: string
  category: ResourceCategorySlug
}): Promise<UploadedResourceObject> {
  const objectName = buildObjectName(options.title, options.category, options.file.name)
  const path = `${options.userId}/${objectName}`

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, options.file, {
    cacheControl: '3600',
    upsert: false,
    contentType: options.file.type || undefined,
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    path,
    title: options.title,
    category: options.category,
    size: options.file.size,
    createdAt: new Date().toISOString(),
    extension: getFileExtension(options.file.name),
  }
}

export async function listUserResourceFiles(userId: string): Promise<UploadedResourceObject[]> {
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list(userId, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' },
  })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((object) => {
    const path = `${userId}/${object.name}`
    const parsed = parseObjectName(object.name)

    return {
      path,
      title: parsed.title,
      category: parsed.category ?? 'educational',
      size: object.metadata?.size ?? 0,
      createdAt: object.created_at ?? null,
      extension: parsed.extension,
    }
  })
}

export async function downloadResourceFile(path: string, fileName: string): Promise<void> {
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).download(path)
  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to download file.')
  }

  const url = URL.createObjectURL(data)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
