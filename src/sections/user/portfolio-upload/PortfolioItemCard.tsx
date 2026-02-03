import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SafeIcon from "@/components/common/safe-icon";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: "file" | "link";
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  url?: string;
  uploadedDate: string;
  thumbnail?: string;
}

interface PortfolioItemCardProps {
  item: PortfolioItem;
  onDelete: (id: string) => void;
}

export default function PortfolioItemCard({
  item,
  onDelete,
}: PortfolioItemCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    onDelete(item.id);
    setShowDeleteDialog(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Thumbnail */}
      {item.type === "file" && item.thumbnail ? (
        <div className="relative w-full h-40 bg-muted overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.title || "Portfolio item thumbnail"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur"
            >
              {item.fileType}
            </Badge>
          </div>
        </div>
      ) : item.type === "link" ? (
        <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <SafeIcon name="Link2" size={40} className="text-primary/40" />
        </div>
      ) : (
        <div className="w-full h-40 bg-muted flex items-center justify-center">
          <SafeIcon
            name="File"
            size={40}
            className="text-muted-foreground/40"
          />
        </div>
      )}

      {/* Content */}
      <CardHeader className="flex-1 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base line-clamp-2">
              {item.title}
            </CardTitle>
            {item.description && (
              <CardDescription className="line-clamp-2 mt-1">
                {item.description}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
              >
                <SafeIcon name="MoreVertical" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {item.type === "link" && (
                <DropdownMenuItem asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <SafeIcon name="ExternalLink" size={14} className="mr-2" />
                    Open Link
                  </a>
                </DropdownMenuItem>
              )}
              {item.type === "file" && (
                <DropdownMenuItem>
                  <SafeIcon name="Download" size={14} className="mr-2" />
                  Download
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-destructive"
              >
                <SafeIcon name="Trash2" size={14} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Footer */}
      <CardContent className="pt-0 pb-3">
        <div className="space-y-2">
          {item.type === "file" && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate">{item.fileName}</span>
              <span className="flex-shrink-0">{item.fileSize}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <SafeIcon name="Clock" size={12} />
              {item.uploadedDate}
            </span>
            <Badge variant="outline" className="text-xs">
              {item.type === "file" ? "File" : "Link"}
            </Badge>
          </div>
        </div>
      </CardContent>

      {/* Action Button */}
      <CardContent className="pt-0">
        {item.type === "link" ? (
          <Button size="sm" variant="outline" className="w-full" asChild>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <SafeIcon name="ExternalLink" size={14} className="mr-2" />
              Visit
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="w-full" disabled>
            <SafeIcon name="File" size={14} className="mr-2" />
            View File
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
