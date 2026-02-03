
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from "@/components/common/safe-icon"

interface CV {
  id: string
  name: string
  fileName: string
  uploadDate: string
  fileSize: string
  format: string
  isPrimary: boolean
  previewUrl: string
}

interface CVMetadataDisplayProps {
  cv: CV
}

export default function CVMetadataDisplay({ cv }: CVMetadataDisplayProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const metadataItems = [
    {
      icon: 'Calendar',
      label: 'Upload Date',
      value: formatDate(cv.uploadDate),
    },
    {
      icon: 'HardDrive',
      label: 'File Size',
      value: cv.fileSize,
    },
    {
      icon: 'FileType',
      label: 'Format',
      value: cv.format,
    },
    {
      icon: 'FileText',
      label: 'File Name',
      value: cv.fileName,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Document Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {metadataItems.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <SafeIcon name={item.icon} size={18} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-medium text-sm break-words">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
