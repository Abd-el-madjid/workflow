import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { supabaseClient } from "../../../supabaseClient";

interface Explanation {
  id: number;
  title: string;
  content: string;
  category: string;
  sort_order: number;
}

interface ExplanationManagerProps {
  sectionId: number;
  sectionName: string;
}

export function ExplanationManager({ sectionId, sectionName }: ExplanationManagerProps) {
  const [explanations, setExplanations] = useState<Explanation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExplanation, setEditingExplanation] = useState<Explanation | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ''
  });

  useEffect(() => {
    loadExplanations();
  }, [sectionId]);

  const loadExplanations = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('explanations')
        .select('*')
        .eq('section_id', sectionId)
        .order('sort_order');

      if (error) throw error;
      setExplanations(data || []);
    } catch (error) {
      console.error('Error loading explanations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      const { data, error } = await supabaseClient
        .from('explanations')
        .insert({
          section_id: sectionId,
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category.trim() || 'general',
          sort_order: explanations.length
        })
        .select()
        .single();

      if (error) throw error;

      setExplanations(prev => [...prev, data]);
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating explanation:', error);
      alert('Failed to create explanation');
    }
  };

  const handleEdit = async () => {
    if (!editingExplanation || !formData.title.trim() || !formData.content.trim()) return;

    try {
      const { data, error } = await supabaseClient
        .from('explanations')
        .update({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category.trim() || 'general',
          updated_at: new Date().toISOString()
        })
        .eq('id', editingExplanation.id)
        .select()
        .single();

      if (error) throw error;

      setExplanations(prev => prev.map(e => e.id === editingExplanation.id ? data : e));
      resetForm();
      setEditingExplanation(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating explanation:', error);
      alert('Failed to update explanation');
    }
  };

  const handleDelete = async (explanationId: number) => {
    if (!confirm('Are you sure you want to delete this explanation?')) return;

    try {
      const { error } = await supabaseClient
        .from('explanations')
        .delete()
        .eq('id', explanationId);

      if (error) throw error;

      setExplanations(prev => prev.filter(e => e.id !== explanationId));
    } catch (error) {
      console.error('Error deleting explanation:', error);
      alert('Failed to delete explanation');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: ''
    });
  };

  const openEditDialog = (explanation: Explanation) => {
    setEditingExplanation(explanation);
    setFormData({
      title: explanation.title,
      content: explanation.content,
      category: explanation.category
    });
    setIsEditDialogOpen(true);
  };

  const availableCategories = ['general', 'tips', 'warnings', 'requirements', 'process'];

  if (loading) {
    return <div className="p-4">Loading explanations...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Explanations in {sectionName}</h3>
          <p className="text-slate-600">Manage section explanations and guidance</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Explanation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Explanation</DialogTitle>
              <DialogDescription>
                Add guidance or information for this section
              </DialogDescription>
            </DialogHeader>
            <ExplanationForm
              formData={formData}
              setFormData={setFormData}
              availableCategories={availableCategories}
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              submitLabel="Create Explanation"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {explanations.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No explanations yet</h3>
            <p className="text-slate-600 mb-4">Add guidance and information for this section</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Explanation
            </Button>
          </Card>
        ) : (
          explanations.map((explanation) => (
            <Card key={explanation.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-900">{explanation.title}</h4>
                      <Badge variant="outline" className="text-xs capitalize">
                        {explanation.category}
                      </Badge>
                    </div>
                    <div
                      className="text-sm text-slate-700 bg-slate-50 p-3 rounded border"
                      dangerouslySetInnerHTML={{ __html: explanation.content }}
                    />
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(explanation)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(explanation.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Explanation</DialogTitle>
            <DialogDescription>
              Update explanation information
            </DialogDescription>
          </DialogHeader>
          <ExplanationForm
            formData={formData}
            setFormData={setFormData}
            availableCategories={availableCategories}
            onSubmit={handleEdit}
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="Update Explanation"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ExplanationFormProps {
  formData: any;
  setFormData: (data: any) => void;
  availableCategories: string[];
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

function ExplanationForm({ formData, setFormData, availableCategories, onSubmit, onCancel, submitLabel }: ExplanationFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
            placeholder="Explanation title"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="content">Content (HTML allowed)</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, content: e.target.value }))}
          placeholder="Detailed explanation or guidance"
          rows={6}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!formData.title.trim() || !formData.content.trim()}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}