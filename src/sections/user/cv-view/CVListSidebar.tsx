
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

interface CVListSidebarProps {
  cvs: CV[]
  selectedCV: CV
  onSelectCV: (cv: CV) => void
}

export default function CVListSidebar({
  cvs,
  selectedCV,
  onSelectCV,
}: CVListSidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    })
  }

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Your CVs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {cvs.length === 0 ? (
          <div className="text-center py-8">
            <SafeIcon name="FileText" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No CVs uploaded yet</p>
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link to="/cv-upload">
                <SafeIcon name="Plus" size={16} className="mr-2" />
                Upload CV
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {cvs.map((cv) => (
              <button
                key={cv.id}
                onClick={() => onSelectCV(cv)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedCV.id === cv.id
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <SafeIcon name="FileText" size={16} className="flex-shrink-0 text-primary" />
                    <p className="font-medium text-sm truncate">{cv.name}</p>
                  </div>
                  {cv.isPrimary && (
                    <Badge className="flex-shrink-0 bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                      Primary
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(cv.uploadDate)}</p>
              </button>
            ))}

            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/cv-upload">
                <SafeIcon name="Plus" size={16} className="mr-2" />
                Upload New CV
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
