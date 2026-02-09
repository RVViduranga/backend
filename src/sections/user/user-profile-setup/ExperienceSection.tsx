import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
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
import { toast } from "sonner";
import type { ExperienceModel } from "@/models/experience";

interface ExperienceSectionProps {
  experience: ExperienceModel[];
  onChange: (experience: ExperienceModel[]) => void;
}

export default function ExperienceSection({
  experience,
  onChange,
}: ExperienceSectionProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ExperienceModel | null>(null);
  const [isCurrentRole, setIsCurrentRole] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleAddNew = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: null,
      description: "",
    });
    setEditingId(-1);
    setIsCurrentRole(false);
  };

  const handleEdit = (index: number) => {
    setFormData(experience[index]);
    setEditingId(index);
    setIsCurrentRole(!experience[index].endDate);
  };

  const handleSave = () => {
    if (!formData) return;

    // Validation
    if (!formData.title?.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!formData.company?.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!formData.startDate?.trim()) {
      toast.error("Start date is required");
      return;
    }

    const dataToSave = {
      ...formData,
      endDate: isCurrentRole ? null : formData.endDate,
    };

    if (editingId === -1) {
      onChange([...experience, dataToSave]);
      toast.success("Experience added successfully");
    } else if (editingId !== null) {
      const updated = [...experience];
      updated[editingId] = dataToSave;
      onChange(updated);
      toast.success("Experience updated successfully");
    }

    setFormData(null);
    setEditingId(null);
    setIsCurrentRole(false);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      onChange(experience.filter((_, i) => i !== deleteIndex));
      toast.success("Experience removed successfully");
      setDeleteIndex(null);
    }
  };

  const handleCancel = () => {
    setFormData(null);
    setEditingId(null);
    setIsCurrentRole(false);
  };

  return (
    <div className="space-y-4">
      {/* Experience List */}
      {experience.length > 0 && (
        <div className="space-y-3">
          {experience.map((exp, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <SafeIcon
                        name="Briefcase"
                        size={18}
                        className="text-primary"
                      />
                      <h3 className="font-semibold">{exp.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {exp.company}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {exp.location}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {exp.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(index)}
                    >
                      <SafeIcon name="Edit2" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(index)}
                      title="Delete experience"
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
      )}

      {/* Add/Edit Form */}
      {formData !== null && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId === -1 ? "Add Experience" : "Edit Experience"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="e.g., Tech Company Inc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={formData.endDate || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endDate: e.target.value || null,
                    })
                  }
                  disabled={isCurrentRole}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="currentRole"
                checked={isCurrentRole}
                onCheckedChange={(checked) =>
                  setIsCurrentRole(checked as boolean)
                }
              />
              <Label
                htmlFor="currentRole"
                className="font-normal cursor-pointer"
              >
                I currently work here
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
              />
            </div>

            <Separator />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <SafeIcon name="Save" size={16} className="mr-2" />
                Save Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Button */}
      {formData === null && (
        <Button variant="outline" onClick={handleAddNew} className="w-full">
          <SafeIcon name="Plus" size={16} className="mr-2" />
          Add Experience
        </Button>
      )}

      {/* Empty State */}
      {experience.length === 0 && formData === null && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <SafeIcon
                name="Briefcase"
                size={40}
                className="mx-auto text-muted-foreground mb-3"
              />
              <p className="font-semibold mb-2">No experience added yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add your work experience to showcase your professional
                background and skills.
              </p>
              <Button onClick={handleAddNew}>
                <SafeIcon name="Plus" size={16} className="mr-2" />
                Add Your First Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Experience</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this experience entry? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
