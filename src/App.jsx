import React, { useState, useEffect, useMemo } from 'react';
import { supabaseClient } from './supabaseClient';
import Login from './Login';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { BEFORE_SECS, AFTER_SECS } from './data';

// ─── helpers ───────────────────────────────────────────────
const ALL_SECS = [...BEFORE_SECS, ...AFTER_SECS];

const createInitialState = () => {
  const s = {};
  ALL_SECS.forEach(sec => sec.items.forEach(i => { s[i.id] = false; }));
  return s;
};

// ─── Main App ───────────────────────────────────────────────
export default function App() {
  const [state, setState] = useState(createInitialState);
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // navigation: 'before' | 'after' | 'letters'
  const [phase, setPhase]       = useState('before');
  const [selectedId, setSelectedId] = useState(BEFORE_SECS[0].id);
  const [expandedItems, setExpandedItems] = useState({});

  const total   = useMemo(() => Object.keys(state).length, [state]);
  const checked = useMemo(() => Object.values(state).filter(Boolean).length, [state]);
  const pct     = total ? Math.round(checked / total * 100) : 0;

  const ensureTablesExist = async () => {
    try {
      // Try to access the tables to check if they exist
      const { error: checklistError } = await supabaseClient
        .from('checklist_states')
        .select('id')
        .limit(1);

      if (checklistError) {
        console.warn('Checklist table may not exist:', checklistError.message);
      }

      const { error: lettersError } = await supabaseClient
        .from('user_letters')
        .select('id')
        .limit(1);

      if (lettersError) {
        console.warn('Letters table may not exist:', lettersError.message);
      }

      // Check storage bucket
      const { error: storageError } = await supabaseClient.storage
        .listBuckets();

      if (storageError) {
        console.warn('Storage access error:', storageError.message);
      }
    } catch (error) {
      console.error('Error checking database setup:', error);
    }
  };
  useEffect(() => {
    const saved = localStorage.getItem('vsChecklist');
    if (saved) { try { setState(p => ({ ...p, ...JSON.parse(saved) })); } catch {} }

    const init = async () => {
      try {
        const { data: redirectData, error: redirectError } = await supabaseClient.auth.getSessionFromUrl();
        if (redirectError && redirectError.message) {
          console.warn('OAuth redirect parse warning:', redirectError.message);
        }

        const sessionFromUrl = redirectData?.session;
        let u = sessionFromUrl?.user ?? null;

        if (!u) {
          const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
          if (sessionError && sessionError.message) {
            console.warn('getSession warning:', sessionError.message);
          }
          u = sessionData?.session?.user ?? null;
        }

        setUser(u);
        if (u) {
          await ensureTablesExist();
          await loadRemote(u);
        }
      } catch (e) {
        console.error('Init error:', e);
      } finally {
        setLoading(false);
      }
    };
    init();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user ?? null;
      console.log('Auth state changed, user:', u?.id);
      setUser(u);
      if (u) {
        await ensureTablesExist();
        await loadRemote(u);
      } else {
        // Clear data when logged out
        setState(createInitialState());
        localStorage.removeItem('vsChecklist');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { localStorage.setItem('vsChecklist', JSON.stringify(state)); }, [state]);

  const loadRemote = async (u) => {
    try {
      const { data, error } = await supabaseClient
        .from('checklist_states').select('state').eq('user_id', u.id).single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading checklist:', error);
        return;
      }

      if (data?.state) {
        console.log('Loaded checklist state:', Object.keys(data.state).length, 'items');
        setState(data.state);
      } else {
        console.log('No saved checklist found, using defaults');
      }
    } catch (error) {
      console.error('Error in loadRemote:', error);
    }
  };

  const saveRemote = async (next) => {
    if (!user) {
      console.log('❌ Checklist save failed: No user logged in');
      return;
    }

    const startTime = Date.now();
    setSaveLoading(true);
    setSaveStatus('Sauvegarde...');

    console.log(`🔄 Starting checklist save at ${new Date().toISOString()}`);
    console.log('📊 Saving state:', {
      total_items: Object.keys(next).length,
      checked_items: Object.values(next).filter(Boolean).length,
      user_id: user.id
    });

    try {
      const response = await supabaseClient.from('checklist_states')
        .upsert({
          user_id: user.id,
          state: next,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      const duration = Date.now() - startTime;
      console.log('Supabase save response:', response);

      if (response.error) {
        console.error('❌ Checklist save error:', response.error);
        setSaveStatus(`Erreur: ${response.error.message}`);
      } else {
        console.log(`✅ Checklist saved successfully in ${duration}ms`);
        setSaveStatus(`✓ Sauvegardé (${duration}ms)`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Checklist save exception (${duration}ms):`, error);
      setSaveStatus(`Erreur: ${error.message || 'Échec'}`);
    } finally {
      setSaveLoading(false);
      const saveStatusTimeout = parseInt(import.meta.env.VITE_SAVE_STATUS_TIMEOUT_MS) || 3500;
      setTimeout(() => setSaveStatus(''), saveStatusTimeout);
    }
  };

  const toggle = (id) => {
    setState(p => { const n = { ...p, [id]: !p[id] }; saveRemote(n); return n; });
  };

  const reset = () => {
    if (!confirm('Réinitialiser toutes les cases ?')) return;
    const n = createInitialState(); setState(n); saveRemote(n);
  };

  const toggleExpand = (id) => setExpandedItems(p => ({ ...p, [id]: !p[id] }));

  const handlePhase = (p, firstId) => { setPhase(p); setSelectedId(firstId); };

  const logout = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        console.error('Logout failed:', error);
        return;
      }
      console.log('User logged out successfully');
      setUser(null);
      setState(createInitialState());
      localStorage.removeItem('vsChecklist');
      window.location.href = window.location.origin;
    } catch (error) {
      console.error('Logout exception:', error);
    }
  };

  // ── active section render ──
  const activeSecs = phase === 'before' ? BEFORE_SECS : AFTER_SECS;
  const activeSection = activeSecs.find(s => s.id === selectedId);

  if (loading) return (
    <div className="splash">
      <div className="splash-inner">
        <div className="spinner" />
        <p>Chargement...</p>
      </div>
    </div>
  );

  if (!user) return <Login />;

  return (
    <div className="layout">
      <Header user={user} onLogout={logout} />
      <Sidebar
        phase={phase}
        selectedId={selectedId}
        state={state}
        checked={checked}
        total={total}
        pct={pct}
        onPhaseChange={handlePhase}
        onSelectSection={setSelectedId}
        onReset={reset}
      />
      <MainContent
        phase={phase}
        activeSection={activeSection}
        state={state}
        saveStatus={saveStatus}
        saveLoading={saveLoading}
        expandedItems={expandedItems}
        onToggle={toggle}
        onToggleExpand={toggleExpand}
        user={user}
      />
    </div>
  );
}