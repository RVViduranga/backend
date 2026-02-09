
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/safe-icon'

interface UploadedFile {
  id: string
  name: string
  type: 'cv' | 'cover_letter'
  size: number
  uploadedAt: string
  status: 'completed' | 'uploading' | 'error'
}

interface UploadSummaryProps {
  files: UploadedFile[]
  onRemove: (fileId: string) => void
  title: string
}

export default function UploadSummary({ files, onRemove, title }: UploadSummaryProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return 'FileText'
    if (fileName.endsWith('.zip')) return 'Archive'
    if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) return 'Image'
    return 'File'
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <SafeIcon name="CheckCircle" size={18} className="text-green-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <SafeIcon
                  name={getFileIcon(file.name)}
                  size={20}
                  className="text-muted-foreground flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{file.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <Badge variant="secondary" className="text-xs">
                  {file.status === 'completed' ? 'Ready' : file.status}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemove(file.id)}
                  className="h-8 w-8 p-0"
                  title="Remove file"
                >
                  <SafeIcon name="Trash2" size={16} className="text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
