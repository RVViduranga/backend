
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
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Image Preview */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
            <img
              src={preview}
              alt={`Profile photo preview: ${fileName || 'profile image'}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Preview Info */}
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm font-semibold mb-1">Preview</p>
            <p className="text-sm text-muted-foreground">
              This is how your profile photo will appear to employers
            </p>
          </div>

          {/* File Info */}
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <SafeIcon name="File" size={16} className="text-muted-foreground" />
              <span className="font-medium">{fileName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SafeIcon name="CheckCircle2" size={16} className="text-green-600" />
              <span>File format and size are valid</span>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <SafeIcon name="Lightbulb" size={16} />
              Pro Tips
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
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
