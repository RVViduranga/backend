
import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/safe-icon'

interface FileUploadAreaProps {
  type: 'cv' | 'cover_letter'
  title: string
  description: string
  acceptedFormats: string
  onFileUpload: (files: File[]) => void
}

export default function FileUploadArea({
  type,
  title,
  description,
  acceptedFormats,
  onFileUpload,
}: FileUploadAreaProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onFileUpload(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFileUpload(files)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'cv':
        return 'FileText'
      case 'cover_letter':
        return 'Mail'
      default:
        return 'Upload'
    }
  }

  return (
    <Card
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed transition-colors cursor-pointer ${
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50'
      }`}
    >
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isDragActive ? 'bg-primary/10' : 'bg-muted'
            }`}
          >
            <SafeIcon
              name={getIcon()}
              size={32}
              className={isDragActive ? 'text-primary' : 'text-muted-foreground'}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <SafeIcon name="Upload" size={16} className="mr-2" />
              Choose File
            </Button>
            <Button variant="secondary" className="flex-1" disabled>
              <SafeIcon name="Link" size={16} className="mr-2" />
              Paste Link
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            or drag and drop your file here
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFormats}
            onChange={handleFileSelect}
            className="hidden"
            aria-label={`Upload ${type}`}
          />
        </div>
      </CardContent>
    </Card>
  )
}
