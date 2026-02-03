
import { Card } from '@/components/ui/card'
import SafeIcon from "@/components/common/safe-icon"

interface CVViewerPreviewProps {
  previewUrl: string
  fileName: string
}

export default function CVViewerPreview({ previewUrl, fileName }: CVViewerPreviewProps) {
  const fileExtension = fileName.split('.').pop()?.toUpperCase() || 'FILE'

  return (
    <div className="space-y-4">
      {/* PDF/Document Preview */}
      <div className="bg-muted rounded-lg overflow-hidden border">
        <div className="aspect-[8.5/11] bg-white relative">
          <img
            src={previewUrl}
            alt={`Preview of ${fileName}`}
            className="w-full h-full object-cover"
          />
          {/* Overlay for better UX */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />
        </div>
      </div>

      {/* File Info Bar */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
            {fileExtension === 'PDF' ? (
              <SafeIcon name="FileText" size={20} className="text-primary" />
            ) : (
              <SafeIcon name="File" size={20} className="text-primary" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{fileName}</p>
            <p className="text-xs text-muted-foreground">{fileExtension} Document</p>
          </div>
        </div>
        <SafeIcon name="ExternalLink" size={18} className="text-muted-foreground" />
      </div>

      {/* Preview Note */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <div className="flex gap-2">
          <SafeIcon name="Info" size={16} className="flex-shrink-0 mt-0.5" />
          <p>This is a preview of your CV. Download to see the full document with all formatting.</p>
        </div>
      </div>
    </div>
  )
}
