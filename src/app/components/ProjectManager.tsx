import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { FolderPlus, Edit, Trash2, Star, StarOff } from "lucide-react";
import { supabaseClient } from "../../../supabaseClient";

interface Project {
  id: number;
  name: string;
  description: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface ProjectManagerProps {
  currentProjectId: number | null;
  onProjectSelect: (projectId: number) => void;
}

export function ProjectManager({ currentProjectId, onProjectSelect }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return;

      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return;

      const { data, error } = await supabaseClient
        .from('projects')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          description: formData.description.trim() || null
        })
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      setFormData({ name: '', description: '' });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleEdit = async () => {
    if (!editingProject || !formData.name.trim()) return;

    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProject.id)
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => prev.map(p => p.id === editingProject.id ? data : p));
      setFormData({ name: '', description: '' });
      setEditingProject(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleDelete = async (projectId: number) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      const { error } = await supabaseClient
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (currentProjectId === projectId) {
        onProjectSelect(projects.find(p => p.id !== projectId)?.id || null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleSetDefault = async (projectId: number, isDefault: boolean) => {
    try {
      // First, unset all defaults
      await supabaseClient
        .from('projects')
        .update({ is_default: false })
        .neq('id', projectId);

      // Then set the new default
      const { error } = await supabaseClient
        .from('projects')
        .update({ is_default: isDefault })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.map(p => ({
        ...p,
        is_default: p.id === projectId ? isDefault : false
      })));
    } catch (error) {
      console.error('Error setting default project:', error);
      alert('Failed to set default project');
    }
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || ''
    });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return <div className="p-4">Loading projects...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-slate-600">Manage your visa tracking projects</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Create a new project to organize your visa tracking data
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Visa Application 2024"
                />
              </div>
              <div>
                <Label htmlFor="project-description">Description (optional)</Label>
                <Textarea
                  id="project-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this project"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!formData.name.trim()}>
                  Create Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              currentProjectId === project.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onProjectSelect(project.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {project.name}
                    {project.is_default && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </CardTitle>
                  {project.description && (
                    <CardDescription className="mt-1">
                      {project.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(project.id, !project.is_default);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    {project.is_default ? (
                      <Star className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditDialog(project);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-500">
                Created {new Date(project.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="p-8 text-center">
          <FolderPlus className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects yet</h3>
          <p className="text-slate-600 mb-4">Create your first project to get started</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <FolderPlus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-project-name">Project Name</Label>
              <Input
                id="edit-project-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-project-description">Description (optional)</Label>
              <Textarea
                id="edit-project-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={!formData.name.trim()}>
                Update Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}