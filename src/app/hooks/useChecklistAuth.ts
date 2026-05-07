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
