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

interface LetterTemplate {
  id: number;
  name: string;
  content: string;
  category: string;
  language: string;
  sort_order: number;
}

interface LetterManagerProps {
  sectionId: number;
  sectionName: string;
}

export function LetterManager({ sectionId, sectionName }: LetterManagerProps) {
  const [letters, setLetters] = useState<LetterTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState<LetterTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    category: '',
    language: 'fr'
  });

  useEffect(() => {
    loadLetters();
  }, [sectionId]);

  const loadLetters = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('letter_templates')
        .select('*')
        .eq('section_id', sectionId)
        .order('sort_order');

      if (error) throw error;
      setLetters(data || []);
    } catch (error) {
      console.error('Error loading letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.content.trim()) return;

    try {
      const { data, error } = await supabaseClient
        .from('letter_templates')
        .insert({
          section_id: sectionId,
          name: formData.name.trim(),
          content: formData.content.trim(),
          category: formData.category.trim() || 'general',
          language: formData.language,
          sort_order: letters.length
        })
        .select()
        .single();

      if (error) throw error;

      setLetters(prev => [...prev, data]);
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating letter:', error);
      alert('Failed to create letter template');
    }
  };

  const handleEdit = async () => {
    if (!editingLetter || !formData.name.trim() || !formData.content.trim()) return;

    try {
      const { data, error } = await supabaseClient
        .from('letter_templates')
        .update({
          name: formData.name.trim(),
          content: formData.content.trim(),
          category: formData.category.trim() || 'general',
          language: formData.language,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingLetter.id)
        .select()
        .single();

      if (error) throw error;

      setLetters(prev => prev.map(l => l.id === editingLetter.id ? data : l));
      resetForm();
      setEditingLetter(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating letter:', error);
      alert('Failed to update letter template');
    }
  };

  const handleDelete = async (letterId: number) => {
    if (!confirm('Are you sure you want to delete this letter template?')) return;

    try {
      const { error } = await supabaseClient
        .from('letter_templates')
        .delete()
        .eq('id', letterId);

      if (error) throw error;

      setLetters(prev => prev.filter(l => l.id !== letterId));
    } catch (error) {
      console.error('Error deleting letter:', error);
      alert('Failed to delete letter template');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      content: '',
      category: '',
      language: 'fr'
    });
  };

  const openEditDialog = (letter: LetterTemplate) => {
    setEditingLetter(letter);
    setFormData({
      name: letter.name,
      content: letter.content,
      category: letter.category,
      language: letter.language
    });
    setIsEditDialogOpen(true);
  };

  const availableCategories = ['motivation', 'recommendation', 'cover', 'general'];
  const availableLanguages = ['fr', 'en', 'ar'];

  if (loading) {
    return <div className="p-4">Loading letter templates...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Letter Templates in {sectionName}</h3>
          <p className="text-slate-600">Manage letter templates and documents</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Letter Template</DialogTitle>
              <DialogDescription>
                Add a letter template for this section
              </DialogDescription>
            </DialogHeader>
            <LetterForm
              formData={formData}
              setFormData={setFormData}
              availableCategories={availableCategories}
              availableLanguages={availableLanguages}
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              submitLabel="Create Template"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {letters.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates yet</h3>
            <p className="text-slate-600 mb-4">Add letter templates for this section</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Template
            </Button>
          </Card>
        ) : (
          letters.map((letter) => (
            <Card key={letter.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-900">{letter.name}</h4>
                      <Badge variant="outline" className="text-xs capitalize">
                        {letter.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs uppercase">
                        {letter.language}
                      </Badge>
                    </div>
                    <div
                      className="text-sm text-slate-700 bg-slate-50 p-3 rounded border max-h-32 overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: letter.content.substring(0, 200) + (letter.content.length > 200 ? '...' : '') }}
                    />
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(letter)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(letter.id)}
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
            <DialogTitle>Edit Letter Template</DialogTitle>
            <DialogDescription>
              Update letter template information
            </DialogDescription>
          </DialogHeader>
          <LetterForm
            formData={formData}
            setFormData={setFormData}
            availableCategories={availableCategories}
            availableLanguages={availableLanguages}
            onSubmit={handleEdit}
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="Update Template"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface LetterFormProps {
  formData: any;
  setFormData: (data: any) => void;
  availableCategories: string[];
  availableLanguages: string[];
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

function LetterForm({ formData, setFormData, availableCategories, availableLanguages, onSubmit, onCancel, submitLabel }: LetterFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
            placeholder="Template name"
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
        <div>
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            value={formData.language}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, language: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
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
          placeholder="Letter template content"
          rows={8}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!formData.name.trim() || !formData.content.trim()}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}