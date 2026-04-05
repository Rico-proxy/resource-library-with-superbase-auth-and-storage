import { useEffect, useRef, useState } from 'react'
import { Download, FileText, LoaderCircle, ShieldAlert, Upload, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { resourceCategories } from '@/data/resources/resources-data'
import { supabase } from '@/lib/supabase'
import { downloadResourceFile, listUserResourceFiles, uploadResourceFile, type UploadedResourceObject } from '@/lib/storage'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ResourceCategorySlug } from '@/types/resources'

const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt']
const appMaxUploadSizeBytes = 10 * 1024 * 1024

const defaultCategory: ResourceCategorySlug = (resourceCategories[0]?.slug ?? 'educational') as ResourceCategorySlug

function isSupportedFile(file: File): boolean {
  const lowerName = file.name.toLowerCase()
  return allowedExtensions.some((extension) => lowerName.endsWith(extension))
}

function getBaseFileName(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, '')
}

export function UploadHeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategorySlug>(defaultCategory)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedResourceObject[]>([])
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const [downloadingPath, setDownloadingPath] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (isMounted) {
        setIsAuthenticated(Boolean(data.session))
        setCurrentUserId(data.session?.user.id ?? null)
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session))
      setCurrentUserId(session?.user.id ?? null)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!currentUserId) {
      setUploadedFiles([])
      return
    }

    let isMounted = true

    const loadFiles = async () => {
      setIsLoadingFiles(true)
      try {
        const files = await listUserResourceFiles(currentUserId)
        if (isMounted) {
          setUploadedFiles(files)
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : 'Unable to load uploaded files.')
        }
      } finally {
        if (isMounted) {
          setIsLoadingFiles(false)
        }
      }
    }

    loadFiles()

    return () => {
      isMounted = false
    }
  }, [currentUserId])

  const handleSelectedFile = (file: File | null) => {
    if (!file) return

    if (!isSupportedFile(file)) {
      toast.error('Unsupported file type. Please upload PDF, DOCX, PPT, XLS or TXT files.')
      return
    }

    if (file.size > appMaxUploadSizeBytes) {
      toast.error('File is above 10MB. Please compress it and try again.')
      return
    }

    setSelectedFile(file)
    if (!fileName.trim()) {
      setFileName(getBaseFileName(file.name))
    }
  }

  const handleOpenFilePicker = () => {
    if (!isAuthenticated) {
      toast.error('Please log in first to upload files.')
      return
    }

    fileInputRef.current?.click()
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragActive(false)

    if (!isAuthenticated) {
      toast.error('Please log in first to upload files.')
      return
    }

    handleSelectedFile(event.dataTransfer.files?.[0] ?? null)
  }

  const handleUploadSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (!isAuthenticated) {
      toast.error('Please log in first to upload files.')
      return
    }

    if (!currentUserId) {
      toast.error('Unable to identify your account. Please log in again.')
      return
    }

    if (!fileName.trim()) {
      toast.error('Please enter a file name.')
      return
    }

    if (!selectedCategory) {
      toast.error('Please select a category.')
      return
    }

    if (!selectedFile) {
      toast.error('Please select a file to upload.')
      return
    }

    if (selectedFile.size > appMaxUploadSizeBytes) {
      toast.error('File is above 10MB. Please compress it and try again.')
      return
    }

    setIsSubmitting(true)
    try {
      await uploadResourceFile({
        userId: currentUserId,
        file: selectedFile,
        title: fileName.trim(),
        category: selectedCategory,
      })

      const files = await listUserResourceFiles(currentUserId)
      setUploadedFiles(files)

      toast.success('File uploaded successfully.')
      setFileName('')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed. Please try again.')
    }
    setIsSubmitting(false)
  }

  const handleDownloadFile = async (file: UploadedResourceObject) => {
    setDownloadingPath(file.path)
    try {
      const ext = file.extension || '.pdf'
      await downloadResourceFile(file.path, `${file.title}${ext}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Download failed. Please try again.')
    } finally {
      setDownloadingPath(null)
    }
  }

  return (
    <section className="relative bg-card shadow-sm p-6 sm:p-10 border border-border rounded-2xl overflow-hidden">
      <div className="-z-10 absolute inset-0 bg-gradient-to-br from-secondary/45 via-background to-primary/10" />

      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 bg-primary/10 mb-3 px-3 py-1 border border-primary/25 rounded-full font-semibold text-primary text-xs uppercase tracking-wide">
          <FileText className="w-3.5 h-3.5" />
          Upload
        </p>
        <h1 className="font-semibold text-3xl sm:text-5xl text-balance tracking-tight">
          Contribute to the student collection
        </h1>
        <p className="mt-3 text-muted-foreground text-base sm:text-lg">
          Someone out there is searching for your notes. Share your PDFs and support learners across
          courses and departments.
        </p>
      </div>

      <Card className="bg-background/70 mx-auto mt-8 border-primary/35 border-dashed max-w-4xl">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleUploadSubmit}>
            <div className="gap-4 grid md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="upload-file-name" className="font-medium text-sm">
                  File name
                </label>
                <Input
                  id="upload-file-name"
                  value={fileName}
                  onChange={(event) => setFileName(event.target.value)}
                  placeholder="e.g. Intro to Biology Notes"
                  disabled={!isAuthenticated || isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium text-sm">Category</label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as ResourceCategorySlug)}
                  disabled={!isAuthenticated || isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceCategories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

          <div
            className={cn(
              'bg-background/70 mt-6 p-6 sm:p-8 border border-primary/35 border-dashed rounded-xl text-center transition-colors',
              isDragActive && isAuthenticated ? 'border-primary bg-primary/10' : '',
            )}
            onDrop={handleDrop}
            onDragOver={(event) => {
              event.preventDefault()
              event.stopPropagation()
              if (isAuthenticated) {
                setIsDragActive(true)
              }
            }}
            onDragLeave={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setIsDragActive(false)
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
              onChange={(event) => handleSelectedFile(event.target.files?.[0] ?? null)}
            />

            <Button
              type="button"
              size="lg"
              onClick={handleOpenFilePicker}
              disabled={!isAuthenticated || isSubmitting}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto max-w-full px-4 sm:px-8 text-sm sm:text-base"
            >
              Select documents to upload
              <Upload className="ml-2 w-4 h-4" />
            </Button>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base">or drag and drop files here</p>

            {selectedFile ? (
              <div className="flex sm:flex-row flex-col sm:justify-between items-center gap-3 bg-card/90 mx-auto mt-4 p-3 border border-border rounded-lg max-w-xl text-left">
                <div>
                  <p className="font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-muted-foreground text-xs uppercase">
                    {selectedFile.name.split('.').pop() ?? 'FILE'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={!isAuthenticated || isSubmitting}
              className="mt-4 w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {isSubmitting ? 'Uploading...' : 'Upload now'}
            </Button>
          </div>

          {!isAuthenticated ? (
            <p className="mt-4 text-muted-foreground text-sm text-center">
              You need to{' '}
              <Link to="/login" className="font-medium text-foreground hover:underline">
                log in
              </Link>{' '}
              before uploading.
            </p>
          ) : (
            <p className="mt-4 text-muted-foreground text-xs text-center">
              Files above 10MB are blocked in-app. Compress large files before uploading.
            </p>
          )}
          </form>
        </CardContent>
      </Card>

      {isAuthenticated ? (
        <Card className="bg-background/80 mx-auto mt-6 border-border/70 max-w-4xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex justify-between items-center gap-3">
              <h3 className="font-semibold text-lg sm:text-xl">Your uploaded files</h3>
              {isLoadingFiles ? <span className="text-muted-foreground text-sm">Loading...</span> : null}
            </div>

            {!isLoadingFiles && uploadedFiles.length === 0 ? (
              <p className="mt-3 text-muted-foreground text-sm">No uploads yet. Your files will appear here.</p>
            ) : null}

            {uploadedFiles.length > 0 ? (
              <div className="space-y-2 mt-4">
                {uploadedFiles.map((file) => {
                  const categoryName =
                    resourceCategories.find((entry) => entry.slug === file.category)?.name ?? file.category

                  return (
                    <div
                      key={file.path}
                      className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3 bg-card p-3 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{file.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {categoryName}{' '}
                          {file.createdAt ? `• ${new Date(file.createdAt).toLocaleDateString()}` : ''}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={downloadingPath === file.path}
                        onClick={() => handleDownloadFile(file)}
                        className="sm:w-auto w-full"
                      >
                        {downloadingPath === file.path ? (
                          <LoaderCircle className="mr-2 w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="mr-2 w-4 h-4" />
                        )}
                        Download
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <div className="mx-auto mt-8 max-w-3xl text-center">
        <p className="text-muted-foreground text-sm sm:text-base">
          Supported file types: pdf, docx, ppt, xls, txt and more. Maximum file size: 10MB.
        </p>
        <p className="mt-1 text-muted-foreground text-sm sm:text-base">
          By uploading, you agree to our uploader agreement and content policy.
        </p>
      </div>

      <div className="bg-amber-50/85 mx-auto mt-6 border-amber-200 max-w-4xl text-amber-700">
        <div className="p-5 text-center">
          <p className="inline-flex items-center gap-2 text-sm sm:text-base">
            <ShieldAlert className="w-4 h-4" />
            We respect intellectual property rights. Upload only materials you have the right to share.
          </p>
        </div>
      </div>
    </section>
  )
}
