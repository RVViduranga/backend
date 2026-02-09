
import { Card } from '@/components/ui/card'
import SafeIcon from "@/components/common/safe-icon"
import { API_BASE_URL } from '@/constants'

interface CVViewerPreviewProps {
  previewUrl: string
  fileName: string
}

export default function CVViewerPreview({ previewUrl, fileName }: CVViewerPreviewProps) {
  const fileExtension = fileName.split('.').pop()?.toUpperCase() || 'FILE'
  
  // Construct full URL if it's a relative path
  const fullUrl = previewUrl.startsWith('http') 
    ? previewUrl 
    : `${API_BASE_URL.replace('/api', '')}${previewUrl}`

  // Check if it's a PDF (can be embedded) or DOC/DOCX (need to download)
  const isPDF = fileExtension === 'PDF'
  const isDocument = ['DOC', 'DOCX'].includes(fileExtension)

  return (
    <div className="space-y-4">
      {/* PDF/Document Preview */}
      <div className="bg-muted rounded-lg overflow-hidden border">
        <div className="aspect-[8.5/11] bg-white relative">
          {isPDF ? (
            <iframe
              src={fullUrl}
              className="w-full h-full border-0"
              title={`Preview of ${fileName}`}
            />
          ) : isDocument ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-muted to-muted/50">
              <SafeIcon
                name="FileText"
                size={64}
                className="text-muted-foreground mb-4"
              />
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {fileExtension} Document
              </p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Preview not available for {fileExtension} files. Please download to view.
              </p>
              <a
                href={fullUrl}
                download={fileName}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
              >
                Download to View
              </a>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground">Preview not available</p>
            </div>
          )}
          {/* Overlay for better UX */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />
        </div>
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
