import { useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '../../../supabaseClient';
import { BEFORE_SECS, AFTER_SECS } from '../../imports/data';

export interface ChecklistState {
  [key: string]: boolean;
}

export interface ChecklistProgress {
  checked: number;
  total: number;
  percentage: number;
}

interface ChecklistAuthReturn {
  user: any;
  loading: boolean;
  state: ChecklistState;
  setState: (state: ChecklistState) => void;
  toggle: (id: string) => void;
  reset: () => void;
  logout: () => Promise<void>;
  saveStatus: string;
  saveLoading: boolean;
  progress: ChecklistProgress;
  uploadDocument: (file: File, name: string, title: string, groupId: string) => Promise<void>;
  getDocuments: (groupId: string) => Promise<any[]>;
  saveLetter: (letterId: string, title: string, content: string, pdfFile?: File) => Promise<void>;
  getLetter: (letterId: string) => Promise<any>;
}

const ALL_SECS = [...BEFORE_SECS, ...AFTER_SECS];

function createInitialState(): ChecklistState {
  const s: ChecklistState = {};
  ALL_SECS.forEach(sec => {
    if (sec.items) {
      sec.items.forEach((i: any) => {
        s[i.id] = false;
      });
    }
  });
  return s;
}

export function useChecklistAuth(): ChecklistAuthReturn {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<ChecklistState>(createInitialState());
  const [saveStatus, setSaveStatus] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  const total = Object.keys(state).length;
  const checked = Object.values(state).filter(Boolean).length;
  const percentage = total ? Math.round((checked / total) * 100) : 0;

  const getProgressFromState = (nextState: ChecklistState): ChecklistProgress => {
    const nextTotal = Object.keys(nextState).length;
    const nextChecked = Object.values(nextState).filter(Boolean).length;
    return {
      checked: nextChecked,
      total: nextTotal,
      percentage: nextTotal ? Math.round((nextChecked / nextTotal) * 100) : 0,
    };
  };

  useEffect(() => {
    const init = async () => {
      try {
        const saved = localStorage.getItem('vsChecklist');
        if (saved) {
          try {
            setState((prev) => ({ ...prev, ...JSON.parse(saved) }));
          } catch (e) {
            console.warn('Failed to parse saved checklist:', e);
          }
        }

        // Set a 5 second timeout for the session fetch
        const sessionPromise = supabaseClient.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
        );

        const { data: { session }, error: sessionError } = await Promise.race([
          sessionPromise,
          timeoutPromise as any
        ]) as any;

        if (sessionError) {
          console.warn('Session error:', sessionError);
        }

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          console.log('✅ User loaded:', currentUser.email);
          // Load remote state without blocking the loading state
          loadRemoteState(currentUser).catch(err => 
            console.error('Failed to load remote state:', err)
          );
        }
      } catch (error) {
        console.error('Init error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        console.log('Auth state changed:', currentUser?.id);

        setUser(currentUser);

        if (currentUser) {
          loadRemoteState(currentUser).catch(err => 
            console.error('Failed to load remote state on auth change:', err)
          );
        } else {
          setState(createInitialState());
          localStorage.removeItem('vsChecklist');
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('vsChecklist', JSON.stringify(state));
  }, [state]);

  const loadRemoteState = useCallback(async (currentUser: any) => {
    if (!currentUser) return;

    try {
      // Set a 3 second timeout for the database query
      const queryPromise = supabaseClient
        .from('checklist_states')
        .select('state, checked_count, total_count, percentage')
        .eq('user_id', currentUser.id)
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), 3000)
      );

      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise as any
      ]) as any;

      if (error && error.code !== 'PGRST116') {
        console.warn('Error loading checklist:', error.message);
        return;
      }

      if (data?.state) {
        console.log(
          '✅ Loaded remote state:',
          Object.keys(data.state).length,
          'items',
          data.checked_count,
          'checked,',
          data.percentage,
          '%'
        );
        setState(data.state);
      }
    } catch (error) {
      console.error('Load remote error:', error);
    }
  }, []);

  const saveRemote = useCallback(
    async (nextState: ChecklistState) => {
      if (!user) {
        console.log('❌ Save failed: No user');
        return;
      }

      setSaveLoading(true);
      setSaveStatus('Sauvegarde...');
      const startTime = Date.now();

      try {
        const progress = getProgressFromState(nextState);
      const response = await supabaseClient.from('checklist_states').upsert(
          {
            user_id: user.id,
            state: nextState,
            checked_count: progress.checked,
            total_count: progress.total,
            percentage: progress.percentage,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id' }
        );

        const duration = Date.now() - startTime;

        if (response.error) {
          console.error('❌ Save error:', response.error);
          setSaveStatus(`Erreur: ${response.error.message}`);
        } else {
          console.log(`✅ Saved in ${duration}ms`);
          setSaveStatus(`✓ Sauvegardé`);
        }
      } catch (error) {
        console.error('❌ Save exception:', error);
        setSaveStatus(`Erreur: ${error instanceof Error ? error.message : 'Échec'}`);
      } finally {
        setSaveLoading(false);
        setTimeout(() => setSaveStatus(''), 3500);
      }
    },
    [user]
  );

  const toggle = useCallback(
    (id: string) => {
      setState((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        saveRemote(next);
        return next;
      });
    },
    [saveRemote]
  );

  const reset = useCallback(() => {
    if (!confirm('Réinitialiser toutes les cases ?')) return;
    const initial = createInitialState();
    setState(initial);
    saveRemote(initial);
  }, [saveRemote]);

  const uploadDocument = useCallback(async (file: File, name: string, title: string, groupId: string) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${groupId}/${Date.now()}.${fileExt}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Save metadata to database
    const { error: dbError } = await supabaseClient
      .from('document_uploads')
      .insert({
        user_id: user.id,
        group_id: groupId,
        name,
        title,
        file_url: urlData.publicUrl,
      });

    if (dbError) {
      // If database insert fails, try to delete the uploaded file
      await supabaseClient.storage
        .from('documents')
        .remove([fileName]);
      throw dbError;
    }
  }, [user]);
const logout = useCallback(async () => {
  try {
    await supabaseClient.auth.signOut();

    setUser(null);
    setState(createInitialState());

    localStorage.removeItem('vsChecklist');

    console.log('✅ User logged out');
  } catch (error) {
    console.error('Logout error:', error);
  }
}, []);
  const getDocuments = useCallback(async (groupId: string) => {
    if (!user) {
      return [];
    }

    const { data, error } = await supabaseClient
      .from('document_uploads')
      .select('*')
      .eq('user_id', user.id)
      .eq('group_id', groupId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }

    return data || [];
  }, [user]);

  const saveLetter = useCallback(async (letterId: string, title: string, content: string, pdfFile?: File) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    let filePath = null;
    let fileName = null;

    if (pdfFile) {
      // Upload PDF to letters bucket
      const fileExt = pdfFile.name.split('.').pop();
      const fileNameUpload = `${user.id}/${letterId}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('letters')
        .upload(fileNameUpload, pdfFile);

      if (uploadError) {
        throw uploadError;
      }

      filePath = fileNameUpload;
      fileName = pdfFile.name;
    }

    // Save letter data
    const { error: dbError } = await supabaseClient
      .from('user_letters')
      .upsert({
        user_id: user.id,
        letter_id: letterId,
        title,
        content,
        file_path: filePath,
        file_name: fileName,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,letter_id' });

    if (dbError) {
      throw dbError;
    }
  }, [user]);

  const getLetter = useCallback(async (letterId: string) => {
    if (!user) {
      return null;
    }

    const { data, error } = await supabaseClient
      .from('user_letters')
      .select('*')
      .eq('user_id', user.id)
      .eq('letter_id', letterId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching letter:', error);
      return null;
    }

    return data;
  }, [user]);

  return {
    user,
    loading,
    state,
    setState,
    toggle,
    reset,
    logout,
    saveStatus,
    saveLoading,
    progress: {
      checked,
      total,
      percentage
    },
    uploadDocument,
    getDocuments,
    saveLetter,
    getLetter
  };
}
