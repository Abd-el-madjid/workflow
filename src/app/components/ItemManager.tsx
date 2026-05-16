import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Plus, Edit, Trash2, CheckSquare } from "lucide-react";
import { supabaseClient } from "../../../supabaseClient";

interface Item {
  id: number;
  item_id: string;
  title: string;
  description: string | null;
  details: string | null;
  tags: string[];
  linked_to: string | null;
  sort_order: number;
}

interface ItemManagerProps {
  sectionId: number;
  sectionName: string;
}

export function ItemManager({ sectionId, sectionName }: ItemManagerProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    item_id: '',
    title: '',
    description: '',
    details: '',
    tags: [] as string[],
    linked_to: ''
  });

  useEffect(() => {
    loadData();
  }, [sectionId]);

  const loadData = async () => {
    try {
      // Load items for this section
      const { data: sectionItems, error: itemsError } = await supabaseClient
        .from('items')
        .select('*')
        .eq('section_id', sectionId)
        .order('sort_order');

      if (itemsError) throw itemsError;
      setItems(sectionItems || []);

      // Load all items for linked_to references
      const { data: allItemsData, error: allError } = await supabaseClient
        .from('items')
        .select('id, item_id, title')
        .order('item_id');

      if (allError) throw allError;
      setAllItems(allItemsData || []);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.item_id.trim() || !formData.title.trim()) return;

    try {
      const { data, error } = await supabaseClient
        .from('items')
        .insert({
          section_id: sectionId,
          item_id: formData.item_id.trim(),
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          details: formData.details.trim() || null,
          tags: formData.tags,
          linked_to: formData.linked_to.trim() || null,
          sort_order: items.length
        })
        .select()
        .single();

      if (error) throw error;

      setItems(prev => [...prev, data]);
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item');
    }
  };

  const handleEdit = async () => {
    if (!editingItem || !formData.item_id.trim() || !formData.title.trim()) return;

    try {
      const { data, error } = await supabaseClient
        .from('items')
        .update({
          item_id: formData.item_id.trim(),
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          details: formData.details.trim() || null,
          tags: formData.tags,
          linked_to: formData.linked_to.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => prev.map(i => i.id === editingItem.id ? data : i));
      resetForm();
      setEditingItem(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item');
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabaseClient
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const resetForm = () => {
    setFormData({
      item_id: '',
      title: '',
      description: '',
      details: '',
      tags: [],
      linked_to: ''
    });
  };

  const openEditDialog = (item: Item) => {
    setEditingItem(item);
    setFormData({
      item_id: item.item_id,
      title: item.title,
      description: item.description || '',
      details: item.details || '',
      tags: item.tags || [],
      linked_to: item.linked_to || ''
    });
    setIsEditDialogOpen(true);
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const availableTags = ['req', 'opt', 'don', 'inf'];

  if (loading) {
    return <div className="p-4">Loading items...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Items in {sectionName}</h3>
          <p className="text-slate-600">Manage checklist items</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
              <DialogDescription>
                Add a new checklist item to this section
              </DialogDescription>
            </DialogHeader>
            <ItemForm
              formData={formData}
              setFormData={setFormData}
              allItems={allItems}
              availableTags={availableTags}
              toggleTag={toggleTag}
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              submitLabel="Create Item"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckSquare className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No items yet</h3>
            <p className="text-slate-600 mb-4">Add your first checklist item</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {item.item_id}
                      </Badge>
                      {item.linked_to && (
                        <Badge variant="secondary" className="text-xs">
                          Links to {item.linked_to}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                    )}
                    {item.details && (
                      <div
                        className="text-sm text-slate-700 bg-slate-50 p-3 rounded border"
                        dangerouslySetInnerHTML={{ __html: item.details }}
                      />
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
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
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update item information
            </DialogDescription>
          </DialogHeader>
          <ItemForm
            formData={formData}
            setFormData={setFormData}
            allItems={allItems}
            availableTags={availableTags}
            toggleTag={toggleTag}
            onSubmit={handleEdit}
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="Update Item"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ItemFormProps {
  formData: any;
  setFormData: (data: any) => void;
  allItems: Item[];
  availableTags: string[];
  toggleTag: (tag: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

function ItemForm({ formData, setFormData, allItems, availableTags, toggleTag, onSubmit, onCancel, submitLabel }: ItemFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="item-id">Item ID</Label>
          <Input
            id="item-id"
            value={formData.item_id}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, item_id: e.target.value }))}
            placeholder="e.g., cf1, dip1"
          />
        </div>
        <div>
          <Label htmlFor="linked-to">Linked To (optional)</Label>
          <Select
            value={formData.linked_to}
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, linked_to: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select item to link" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {allItems.map((item) => (
                <SelectItem key={item.id} value={item.item_id}>
                  {item.item_id} - {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
          placeholder="Item title"
        />
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description"
        />
      </div>

      <div>
        <Label htmlFor="details">Details (optional, HTML allowed)</Label>
        <Textarea
          id="details"
          value={formData.details}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, details: e.target.value }))}
          placeholder="Detailed instructions or information"
          rows={4}
        />
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {availableTags.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag}`}
                checked={formData.tags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
              />
              <Label htmlFor={`tag-${tag}`} className="text-sm">
                {tag}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!formData.item_id.trim() || !formData.title.trim()}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}