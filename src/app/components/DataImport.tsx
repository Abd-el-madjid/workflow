import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabaseClient } from "../../../supabaseClient";

interface DataImportProps {
  onImportComplete: () => void;
}

export function DataImport({ onImportComplete }: DataImportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string>("");
  const [importProgress, setImportProgress] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert('Please select a JSON file');
      return;
    }

    setIsImporting(true);
    setImportStatus("Reading file...");
    setImportProgress([]);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate data structure
      if (!data.beforeSections || !data.afterSections || !data.letters) {
        throw new Error('Invalid data structure. Expected: { beforeSections, afterSections, letters }');
      }

      await importData(data);
      setImportStatus("Import completed successfully!");
      onImportComplete();

    } catch (error) {
      console.error('Import error:', error);
      setImportStatus(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const importData = async (data: any) => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create default project
    setImportProgress(prev => [...prev, "Creating project..."]);
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .insert({
        user_id: user.id,
        name: 'Visa Tracker',
        description: 'Default visa tracking project',
        is_default: true
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Create menu categories
    setImportProgress(prev => [...prev, "Creating menu categories..."]);
    const categories = [
      { category_id: 'avant-visa', label: 'Avant le visa', icon: '🎯', color: 'from-blue-500 to-cyan-500' },
      { category_id: 'apres-visa', label: 'Après le visa', icon: '✈️', color: 'from-purple-500 to-pink-500' },
      { category_id: 'lettres', label: 'Lettres', icon: '📨', color: 'from-orange-500 to-red-500' }
    ];

    for (const cat of categories) {
      const { error } = await supabaseClient
        .from('menu_categories')
        .insert({
          project_id: project.id,
          ...cat,
          sort_order: categories.indexOf(cat)
        });
      if (error) throw error;
    }

    // Import sections
    await importSections(project.id, 'avant-visa', data.beforeSections);
    await importSections(project.id, 'apres-visa', data.afterSections);

    // Import letters
    setImportProgress(prev => [...prev, "Importing letters..."]);
    for (let i = 0; i < data.letters.length; i++) {
      const letter = data.letters[i];
      const { error } = await supabaseClient
        .from('letter_templates')
        .insert({
          project_id: project.id,
          letter_id: letter.id,
          title: letter.title,
          subtitle: letter.subtitle || null,
          content: letter.content,
          sort_order: i
        });
      if (error) throw error;
    }

    setImportProgress(prev => [...prev, "Import completed!"]);
  };

  const importSections = async (projectId: number, categoryId: string, sections: any[]) => {
    setImportProgress(prev => [...prev, `Importing ${categoryId} sections...`]);

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      // Insert section
      const { data: sectionData, error: sectionError } = await supabaseClient
        .from('sections')
        .insert({
          project_id: projectId,
          section_id: section.id,
          category_id: categoryId,
          name: section.nm,
          icon: section.ico,
          background_color: section.bg,
          badge: section.badge || null,
          note: section.note || null,
          chain: section.chain || false,
          sort_order: i
        })
        .select()
        .single();

      if (sectionError) throw sectionError;

      // Import items
      if (section.items && section.items.length > 0) {
        setImportProgress(prev => [...prev, `Importing items for ${section.nm}...`]);
        for (let j = 0; j < section.items.length; j++) {
          const item = section.items[j];
          const { error: itemError } = await supabaseClient
            .from('items')
            .insert({
              section_id: sectionData.id,
              item_id: item.id,
              title: item.t,
              description: item.d || null,
              details: item.s || null,
              tags: item.g || [],
              linked_to: item.linkedTo || null,
              sort_order: j
            });
          if (itemError) throw itemError;
        }
      }

      // Import explanations
      if (section.expls && section.expls.length > 0) {
        setImportProgress(prev => [...prev, `Importing explanations for ${section.nm}...`]);
        for (let j = 0; j < section.expls.length; j++) {
          const expl = section.expls[j];
          const { error: explError } = await supabaseClient
            .from('explanations')
            .insert({
              section_id: sectionData.id,
              title: expl.t,
              content: expl.b,
              sort_order: j
            });
          if (explError) throw explError;
        }
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import Data
        </CardTitle>
        <CardDescription>
          Upload a JSON file to populate your project with sections, items, and letters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Select a JSON file containing your project data
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              disabled={isImporting}
              className="hidden"
              id="data-import"
            />
            <label htmlFor="data-import">
              <Button
                variant="outline"
                disabled={isImporting}
                className="cursor-pointer"
                asChild
              >
                <span>
                  {isImporting ? "Importing..." : "Choose File"}
                </span>
              </Button>
            </label>
          </div>
        </div>

        {importStatus && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${
            importStatus.includes('failed') || importStatus.includes('error')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : importStatus.includes('completed')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-blue-50 border border-blue-200 text-blue-700'
          }`}>
            {importStatus.includes('failed') || importStatus.includes('error') ? (
              <AlertCircle className="w-5 h-5" />
            ) : importStatus.includes('completed') ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Upload className="w-5 h-5 animate-pulse" />
            )}
            <span className="text-sm">{importStatus}</span>
          </div>
        )}

        {importProgress.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-700">Import Progress:</p>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {importProgress.map((step, index) => (
                <div key={index} className="text-xs text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}