
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/safe-icon'

interface MediaItem {
  id: string
  name: string
  type: 'photo' | 'portfolio'
  uploadDate: string
  size: string
  isPrimary?: boolean
  thumbnail?: string
}

interface MediaUploadCardProps {
  item: MediaItem
  type: 'photo' | 'portfolio'
  onDelete: () => void
  onSetPrimary?: (id: string) => void
}

export default function MediaUploadCard({
  item,
  type,
  onDelete,
  onSetPrimary,
}: MediaUploadCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (type === 'photo') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Photo Thumbnail */}
        <div className="relative w-full h-48 bg-muted overflow-hidden">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.name || "Portfolio item thumbnail"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <SafeIcon name="Image" size={48} className="text-muted-foreground" />
            </div>
          )}
          {item.isPrimary && (
            <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700">
              <SafeIcon name="Check" size={12} className="mr-1" />
              Primary
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 truncate">{item.name}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SafeIcon name="Calendar" size={12} />
            <span>{formatDate(item.uploadDate)}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 gap-2">
          {!item.isPrimary && onSetPrimary && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onSetPrimary(item.id)}
            >
              <SafeIcon name="Star" size={14} className="mr-1" />
              Set as Primary
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <SafeIcon name="Trash2" size={14} className="mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return null
}
