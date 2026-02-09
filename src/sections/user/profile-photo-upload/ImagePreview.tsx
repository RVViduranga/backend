import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/safe-icon'

interface ImagePreviewProps {
  preview: string
  fileName: string
  onRemove: () => void
}

export default function ImagePreview({ preview, fileName, onRemove }: ImagePreviewProps) {
  return (
    <div className="space-y-4">
      {/* Preview Container */}
      <div className="flex flex-col gap-4">
        {/* Image Preview - Centered */}
        <div className="flex justify-center">
          <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
            <img
              src={preview}
              alt={`Profile photo preview: ${fileName || 'profile image'}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Preview Info - Compact */}
        <div className="space-y-3">
          {/* File Info */}
          <div className="bg-muted rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <SafeIcon name="File" size={16} className="text-muted-foreground" />
              <span className="font-medium truncate">{fileName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SafeIcon name="CheckCircle2" size={16} className="text-green-600" />
              <span>File format and size are valid</span>
            </div>
          </div>

          {/* Tips - Compact */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-900 mb-1.5 flex items-center gap-1.5">
              <SafeIcon name="Lightbulb" size={14} />
              Pro Tips
            </p>
            <ul className="text-xs text-blue-800 space-y-0.5">
              <li>• Use good lighting and a clear background</li>
              <li>• Wear professional attire</li>
              <li>• Smile naturally and look at the camera</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
