
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/safe-icon'
import { PORTFOLIO_ACCEPTED_TYPES, MAX_PORTFOLIO_SIZE_MB } from '@/constants/app'

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  maxSize?: number // in MB
  acceptedTypes?: readonly string[]
}

export default function FileUploadZone({
  onFilesSelected,
  maxSize = MAX_PORTFOLIO_SIZE_MB,
  acceptedTypes = PORTFOLIO_ACCEPTED_TYPES,
}: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = []
    setError(null)

    files.forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File "${file.name}" exceeds ${maxSize}MB limit`)
        return
      }

      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!acceptedTypes.includes(fileExtension)) {
        setError(`File type "${fileExtension}" is not supported`)
        return
      }

      validFiles.push(file)
    })

    return validFiles
  }

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
    const validFiles = validateFiles(files)
    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || [])
    const validFiles = validateFiles(files)
    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept={acceptedTypes.join(',')}
          className="hidden"
          aria-label="Upload portfolio files"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <SafeIcon name="Upload" size={24} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Drag and drop your files here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, DOCX, PPT, Figma, XD, Sketch, JPG, PNG, SVG
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum file size: {maxSize}MB
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          <SafeIcon name="AlertCircle" size={16} />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClick}
      >
        <SafeIcon name="Plus" size={18} className="mr-2" />
        Select Files
      </Button>
    </div>
  )
}
