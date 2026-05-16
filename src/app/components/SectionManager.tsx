import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Edit, Trash2, FileText, List, Settings } from "lucide-react";
import { supabaseClient } from "../../../supabaseClient";

interface Section {
  id: number;
  section_id: string;
  category_id: string;
  name: string;
  icon: string;
  background_color: string;
  badge: any;
  note: any;
  chain: boolean;
  sort_order: number;
}

interface SectionManagerProps {
  projectId: number;
  onManageContent?: (section: Section, contentType: 'items' | 'explanations' | 'letters') => void;
}

export function SectionManager({ projectId, onManageContent }: SectionManagerProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({
    section_id: '',
    category_id: '',
    name: '',
    icon: '',
    background_color: '#f3f4f6',
    badge_text: '',
    badge_color: 'b-blu',
    note_text: '',
    note_color: 'n-grn',
    chain: false
  });

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      // Load categories
      const { data: cats, error: catsError } = await supabaseClient
        .from('menu_categories')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order');

      if (catsError) throw catsError;
      setCategories(cats || []);

      // Load sections
      const { data: secs, error: secsError } = await supabaseClient
        .from('sections')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order');

      if (secsError) throw secsError;
      setSections(secs || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.section_id.trim() || !formData.name.trim()) return;

    try {
      const badge = formData.badge_text.trim() ? {
        t: formData.badge_text,
        c: formData.badge_color
      } : null;

      const note = formData.note_text.trim() ? {
        t: formData.note_text,
        c: formData.note_color
      } : null;

      const { data, error } = await supabaseClient
        .from('sections')
        .insert({
          project_id: projectId,
          section_id: formData.section_id.trim(),
          category_id: formData.category_id,
          name: formData.name.trim(),
          icon: formData.icon || '📄',
          background_color: formData.background_color,
          badge,
          note,
          chain: formData.chain,
          sort_order: sections.length
        })
        .select()
        .single();

      if (error) throw error;

      setSections(prev => [...prev, data]);
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating section:', error);
      alert('Failed to create section');
    }
  };

  const handleEdit = async () => {
    if (!editingSection || !formData.section_id.trim() || !formData.name.trim()) return;

    try {
      const badge = formData.badge_text.trim() ? {
        t: formData.badge_text,
        c: formData.badge_color
      } : null;

      const note = formData.note_text.trim() ? {
        t: formData.note_text,
        c: formData.note_color
      } : null;

      const { data, error } = await supabaseClient
        .from('sections')
        .update({
          section_id: formData.section_id.trim(),
          category_id: formData.category_id,
          name: formData.name.trim(),
          icon: formData.icon || '📄',
          background_color: formData.background_color,
          badge,
          note,
          chain: formData.chain,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingSection.id)
        .select()
        .single();

      if (error) throw error;

      setSections(prev => prev.map(s => s.id === editingSection.id ? data : s));
      resetForm();
      setEditingSection(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating section:', error);
      alert('Failed to update section');
    }
  };

  const handleDelete = async (sectionId: number) => {
    if (!confirm('Are you sure you want to delete this section? This will also delete all items and explanations in it.')) return;

    try {
      const { error } = await supabaseClient
        .from('sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;

      setSections(prev => prev.filter(s => s.id !== sectionId));
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    }
  };

  const resetForm = () => {
    setFormData({
      section_id: '',
      category_id: '',
      name: '',
      icon: '',
      background_color: '#f3f4f6',
      badge_text: '',
      badge_color: 'b-blu',
      note_text: '',
      note_color: 'n-grn',
      chain: false
    });
  };

  const openEditDialog = (section: Section) => {
    setEditingSection(section);
    setFormData({
      section_id: section.section_id,
      category_id: section.category_id,
      name: section.name,
      icon: section.icon,
      background_color: section.background_color,
      badge_text: section.badge?.t || '',
      badge_color: section.badge?.c || 'b-blu',
      note_text: section.note?.t || '',
      note_color: section.note?.c || 'n-grn',
      chain: section.chain
    });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return <div className="p-4">Loading sections...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sections</h2>
          <p className="text-slate-600">Manage sections and their content</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Section</DialogTitle>
              <DialogDescription>
                Create a new section for your project
              </DialogDescription>
            </DialogHeader>
            <SectionForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              submitLabel="Create Section"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => {
          const categorySections = sections.filter(s => s.category_id === category.category_id);

          return (
            <Card key={category.category_id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.label}
                  <Badge variant="outline">{categorySections.length} sections</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categorySections.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No sections in this category</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {categorySections.map((section) => (
                      <Card key={section.id} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{section.icon}</span>
                              <div>
                                <CardTitle className="text-base">{section.name}</CardTitle>
                                <CardDescription className="text-xs">
                                  ID: {section.section_id}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(section)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(section.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {section.badge && (
                              <Badge variant="outline" className="text-xs">
                                {section.badge.t}
                              </Badge>
                            )}
                            {section.chain && (
                              <Badge variant="secondary" className="text-xs">
                                Sequential
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onManageContent?.(section, 'items')}
                              className="text-xs"
                            >
                              <List className="w-3 h-3 mr-1" />
                              Items
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onManageContent?.(section, 'explanations')}
                              className="text-xs"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              Explanations
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onManageContent?.(section, 'letters')}
                              className="text-xs"
                            >
                              <Settings className="w-3 h-3 mr-1" />
                              Letters
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update section information
            </DialogDescription>
          </DialogHeader>
          <SectionForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onSubmit={handleEdit}
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="Update Section"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SectionFormProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: any[];
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

function SectionForm({ formData, setFormData, categories, onSubmit, onCancel, submitLabel }: SectionFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="section-id">Section ID</Label>
          <Input
            id="section-id"
            value={formData.section_id}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, section_id: e.target.value }))}
            placeholder="e.g., cf, dip, civ"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, category_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.category_id} value={cat.category_id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
            placeholder="Section name"
          />
        </div>
        <div>
          <Label htmlFor="icon">Icon</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, icon: e.target.value }))}
            placeholder="📄"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="background">Background Color</Label>
        <Input
          id="background"
          type="color"
          value={formData.background_color}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, background_color: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Badge (optional)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Badge text"
            value={formData.badge_text}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, badge_text: e.target.value }))}
          />
          <Select
            value={formData.badge_color}
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, badge_color: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="b-blu">Blue</SelectItem>
              <SelectItem value="b-red">Red</SelectItem>
              <SelectItem value="b-grn">Green</SelectItem>
              <SelectItem value="b-amb">Amber</SelectItem>
              <SelectItem value="b-pur">Purple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Note (optional)</Label>
        <Textarea
          placeholder="Note content (HTML allowed)"
          value={formData.note_text}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, note_text: e.target.value }))}
          rows={3}
        />
        <Select
          value={formData.note_color}
          onValueChange={(value) => setFormData((prev: any) => ({ ...prev, note_color: value }))}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="n-grn">Green</SelectItem>
            <SelectItem value="n-blu">Blue</SelectItem>
            <SelectItem value="n-red">Red</SelectItem>
            <SelectItem value="n-amb">Amber</SelectItem>
            <SelectItem value="n-pur">Purple</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="chain"
          checked={formData.chain}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, chain: e.target.checked }))}
          className="rounded"
        />
        <Label htmlFor="chain">Sequential section (items must be completed in order)</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!formData.section_id.trim() || !formData.name.trim()}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}