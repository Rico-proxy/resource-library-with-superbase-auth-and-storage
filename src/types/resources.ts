export type ResourceCategorySlug = 'educational' | 'literature' | 'history' | 'business-career'

export interface ResourceDocument {
  id: string
  title: string
  author: string
  rating?: number
  votes?: number
  format: string
  coverTone: string
  storagePath?: string
  downloadUrl?: string
  uploadedAt?: string | null
}

export interface ResourceCategory {
  slug: ResourceCategorySlug
  name: string
  shortDescription: string
  headline: string
  intro: string
  about: string
  recommended: ResourceDocument[]
  trending: ResourceDocument[]
  recentlyAdded: ResourceDocument[]
}
