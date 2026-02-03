
import { Progress } from '@/components/ui/progress'
import SafeIcon from "@/components/common/safe-icon"

interface UploadProgressIndicatorProps {
  progress: number
}

export default function UploadProgressIndicator({ progress }: UploadProgressIndicatorProps) {
  const isComplete = progress >= 100

  return (
    <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <SafeIcon name="CheckCircle2" size={20} className="text-green-600" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          )}
          <span className="font-medium text-sm">
            {isComplete ? 'Upload Complete' : 'Uploading...'}
          </span>
        </div>
        <span className="text-sm font-semibold text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
