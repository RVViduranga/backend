import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import type { EducationModel } from "@/models/education";

interface EducationSectionProps {
  education: EducationModel[];
  onChange: (education: EducationModel[]) => void;
}

export default function EducationSection({
  education,
  onChange,
}: EducationSectionProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EducationModel | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleAddNew = () => {
    setFormData({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
    });
    setEditingId(-1);
  };

  const handleEdit = (index: number) => {
    setFormData(education[index]);
    setEditingId(index);
  };

  const handleSave = () => {
    if (!formData) return;

    // Validation
    if (!formData.institution?.trim()) {
      toast.error("Institution name is required");
      return;
    }
    if (!formData.degree?.trim()) {
      toast.error("Degree is required");
      return;
    }
    if (!formData.fieldOfStudy?.trim()) {
      toast.error("Field of study is required");
      return;
    }
    if (!formData.startDate?.trim()) {
      toast.error("Start date is required");
      return;
    }

    if (editingId === -1) {
      onChange([...education, formData]);
      toast.success("Education added successfully");
    } else if (editingId !== null) {
      const updated = [...education];
      updated[editingId] = formData;
      onChange(updated);
      toast.success("Education updated successfully");
    }

    setFormData(null);
    setEditingId(null);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      onChange(education.filter((_, i) => i !== deleteIndex));
      toast.success("Education removed successfully");
      setDeleteIndex(null);
    }
  };

  const handleCancel = () => {
    setFormData(null);
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Education List */}
      {education.length > 0 && (
        <div className="space-y-3">
          {education.map((edu, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <SafeIcon
                        name="GraduationCap"
                        size={18}
                        className="text-primary"
                      />
                      <h3 className="font-semibold">{edu.degree}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {edu.institution}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {edu.fieldOfStudy}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </p>
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
                      title="Delete education"
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
              {editingId === -1 ? "Add Education" : "Edit Education"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution Name *</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                placeholder="e.g., Stanford University"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  placeholder="e.g., Bachelor of Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">Field of Study *</Label>
                <Input
                  id="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={(e) =>
                    setFormData({ ...formData, fieldOfStudy: e.target.value })
                  }
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="text"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  placeholder="e.g., 2018"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="text"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  placeholder="e.g., 2022 or leave blank if current"
                />
              </div>
            </div>

            <Separator />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <SafeIcon name="Save" size={16} className="mr-2" />
                Save Education
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Button */}
      {formData === null && (
        <Button variant="outline" onClick={handleAddNew} className="w-full">
          <SafeIcon name="Plus" size={16} className="mr-2" />
          Add Education
        </Button>
      )}

      {/* Empty State */}
      {education.length === 0 && formData === null && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <SafeIcon
                name="GraduationCap"
                size={40}
                className="mx-auto text-muted-foreground mb-3"
              />
              <p className="font-semibold mb-2">No education added yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add your educational background to help employers understand
                your qualifications.
              </p>
              <Button onClick={handleAddNew}>
                <SafeIcon name="Plus" size={16} className="mr-2" />
                Add Your First Education
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
            <AlertDialogTitle>Delete Education</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this education entry? This action
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
