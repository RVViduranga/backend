import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SafeIcon from "@/components/common/safe-icon";
import MediaUploadCard from "./MediaUploadCard";

interface MediaItem {
  id: string;
  name: string;
  type: "photo" | "portfolio";
  uploadDate: string;
  size: string;
  isPrimary?: boolean;
  thumbnail?: string;
}

interface MediaUploadSectionProps {
  items: MediaItem[];
  type: "photo" | "portfolio";
  onDelete: (id: string) => void;
  onSetPrimary?: (id: string) => void;
  onDeleteClick?: (
    id: string,
    type: "photo" | "portfolio",
    name: string
  ) => void;
}

export default function MediaUploadSection({
  items,
  type,
  onDelete,
  onSetPrimary,
  onDeleteClick,
}: MediaUploadSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (type === "photo") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((photo) => (
          <MediaUploadCard
            key={photo.id}
            item={photo}
            type="photo"
            onDelete={
              onDeleteClick
                ? () => onDeleteClick(photo.id, "photo", photo.name)
                : () => onDelete(photo.id)
            }
            onSetPrimary={onSetPrimary}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <SafeIcon
                    name="FileText"
                    size={24}
                    className="text-muted-foreground"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{item.size}</span>
                    <span>•</span>
                    <span>Uploaded {formatDate(item.uploadDate)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" asChild>
                  <a href="#" title="Download">
                    <SafeIcon name="Download" size={16} />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onDeleteClick
                      ? onDeleteClick(item.id, "portfolio", item.name)
                      : onDelete(item.id)
                  }
                  title="Delete"
                >
                  <SafeIcon
                    name="Trash2"
                    size={16}
                    className="text-destructive"
                  />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
