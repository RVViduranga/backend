
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/safe-icon'

interface UploadingFile {
  id: string
  name: string
  type: 'cv' | 'cover_letter' | 'portfolio'
  progress: number
  status: 'uploading' | 'completed' | 'error'
}

interface UploadProgressItemProps {
  file: UploadingFile
  onRetry: () => void
}

export default function UploadProgressItem({ file, onRetry }: UploadProgressItemProps) {
  const getFileIcon = () => {
    if (file.name.endsWith('.pdf')) return 'FileText'
    if (file.name.endsWith('.zip')) return 'Archive'
    if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) return 'Image'
    return 'File'
  }

  const getStatusColor = () => {
    switch (file.status) {
      case 'uploading':
        return 'text-blue-600'
      case 'completed':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getStatusIcon = () => {
    switch (file.status) {
      case 'uploading':
        return 'Loader'
      case 'completed':
        return 'CheckCircle'
      case 'error':
        return 'AlertCircle'
      default:
        return 'File'
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
      {/* File Icon */}
      <div className="flex-shrink-0">
        <SafeIcon name={getFileIcon()} size={24} className="text-muted-foreground" />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium truncate text-sm">{file.name}</p>
          <SafeIcon
            name={getStatusIcon()}
            size={18}
            className={`flex-shrink-0 ${getStatusColor()} ${
              file.status === 'uploading' ? 'animate-spin' : ''
            }`}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Progress value={file.progress} className="h-1.5 flex-1" />
          <span className="text-xs font-medium text-muted-foreground w-8 text-right">
            {file.progress}%
          </span>
        </div>
      </div>

      {/* Action Button */}
      {file.status === 'error' && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          <SafeIcon name="RotateCcw" size={14} className="mr-1" />
          Retry
        </Button>
      )}
    </div>
  )
}
