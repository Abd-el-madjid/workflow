import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Settings, Upload, FolderOpen, FileText, List, BookOpen, Star, MessageSquare, ArrowLeft } from "lucide-react";
import { DataImport } from "./DataImport";
import { ProjectManager } from "./ProjectManager";
import { SectionManager } from "./SectionManager";
import { ItemManager } from "./ItemManager";
import { ExplanationManager } from "./ExplanationManager";
import { LetterManager } from "./LetterManager";
import { supabaseClient } from "../../../supabaseClient";

interface Project {
  id: number;
  name: string;
  description: string | null;
  is_default: boolean;
}

export function DataManager({ onBackToApp }: { onBackToApp?: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

      // Auto-select default project or first project
      const defaultProject = data?.find(p => p.is_default) || data?.[0];
      if (defaultProject) {
        setSelectedProject(defaultProject);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (projectId: number | null) => {
    if (projectId === null) {
      setSelectedProject(null);
      setSelectedSection(null);
      return;
    }

    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setSelectedSection(null);
    }
  };

  const handleImportComplete = () => {
    loadProjects();
    setActiveTab("projects");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-12 h-12 mx-auto mb-4 text-slate-400 animate-spin" />
          <p className="text-slate-600">Loading data manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          {onBackToApp && (
            <Button variant="outline" onClick={onBackToApp} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to App
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Data Manager</h1>
            <p className="text-slate-600">Manage your visa tracking projects and data</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="sections"
              disabled={!selectedProject}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Sections
            </TabsTrigger>
            <TabsTrigger
              value="items"
              disabled={!selectedSection}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              Items
            </TabsTrigger>
            <TabsTrigger
              value="explanations"
              disabled={!selectedSection}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Explanations
            </TabsTrigger>
            <TabsTrigger
              value="letters"
              disabled={!selectedSection}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Letters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                    Projects
                  </CardTitle>
                  <CardDescription>
                    Manage your visa tracking projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
                      <p className="text-sm text-slate-600">Total projects</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("projects")}
                    >
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-green-600" />
                    Import Data
                  </CardTitle>
                  <CardDescription>
                    Import data from JSON files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">Quick Start</p>
                      <p className="text-sm text-slate-600">Upload your data</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("import")}
                    >
                      Import
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    Current Project
                  </CardTitle>
                  <CardDescription>
                    Active project for management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedProject ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{selectedProject.name}</p>
                        {selectedProject.is_default && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      {selectedProject.description && (
                        <p className="text-sm text-slate-600">{selectedProject.description}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500">No project selected</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Follow these steps to set up your visa tracking system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Import Data</h4>
                        <p className="text-sm text-slate-600">
                          Upload your existing data structure from a JSON file, or start fresh
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Create Projects</h4>
                        <p className="text-sm text-slate-600">
                          Organize your data into separate projects for different visa types
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Manage Sections</h4>
                        <p className="text-sm text-slate-600">
                          Create and organize sections like Campus France, Diplomas, etc.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Add Items</h4>
                        <p className="text-sm text-slate-600">
                          Populate sections with checklist items, tags, and detailed instructions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import">
            <DataImport onImportComplete={handleImportComplete} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectManager
              currentProjectId={selectedProject?.id || null}
              onProjectSelect={handleProjectSelect}
            />
          </TabsContent>

          <TabsContent value="sections">
            {selectedProject ? (
              <SectionManager
                projectId={selectedProject.id}
                onManageContent={(section, contentType) => {
                  setSelectedSection(section);
                  setActiveTab(contentType);
                }}
              />
            ) : (
              <Card className="p-8 text-center">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Project Selected</h3>
                <p className="text-slate-600 mb-4">Select a project first to manage its sections</p>
                <Button onClick={() => setActiveTab("projects")}>
                  Select Project
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="items">
            {selectedSection ? (
              <ItemManager
                sectionId={selectedSection.id}
                sectionName={selectedSection.name}
              />
            ) : (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Section Selected</h3>
                <p className="text-slate-600 mb-4">Select a section first to manage its items</p>
                <Button onClick={() => setActiveTab("sections")}>
                  Select Section
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="explanations">
            {selectedSection ? (
              <ExplanationManager
                sectionId={selectedSection.id}
                sectionName={selectedSection.name}
              />
            ) : (
              <Card className="p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Section Selected</h3>
                <p className="text-slate-600 mb-4">Select a section first to manage its explanations</p>
                <Button onClick={() => setActiveTab("sections")}>
                  Select Section
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="letters">
            {selectedSection ? (
              <LetterManager
                sectionId={selectedSection.id}
                sectionName={selectedSection.name}
              />
            ) : (
              <Card className="p-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Section Selected</h3>
                <p className="text-slate-600 mb-4">Select a section first to manage its letter templates</p>
                <Button onClick={() => setActiveTab("sections")}>
                  Select Section
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}