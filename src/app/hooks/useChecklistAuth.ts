import { useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '../../../supabaseClient';
import { BEFORE_SECS, AFTER_SECS } from '../../imports/data';

interface ChecklistState {
  [key: string]: boolean;
}

interface ChecklistProgress {
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

        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

        if (sessionError) {
          console.warn('Session error:', sessionError);
        }

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          console.log('✅ User loaded:', currentUser.email);
          await loadRemoteState(currentUser);
        }
      } catch (error) {
        console.error('Init error:', error);
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
          await loadRemoteState(currentUser);
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
      const { data, error } = await supabaseClient
        .from('checklist_states')
        .select('state')
        .eq('user_id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error loading checklist:', error.message);
        return;
      }

      if (data?.state) {
        console.log('✅ Loaded remote state:', Object.keys(data.state).length, 'items');
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
        const response = await supabaseClient.from('checklist_states').upsert(
          {
            user_id: user.id,
            state: nextState,
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

  const logout = useCallback(async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        console.error('❌ Logout error:', error);
        return;
      }

      console.log('✅ Logged out');
      setUser(null);
      setState(createInitialState());
      localStorage.removeItem('vsChecklist');
      window.location.href = window.location.origin;
    } catch (error) {
      console.error('❌ Logout exception:', error);
    }
  }, []);

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
    }
  };
}
