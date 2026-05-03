import { useEffect, useMemo, useState } from 'react';
import './index.css';
import { supabaseClient } from './supabaseClient';

const SECS = [
  {
    id: 'cf', ico: '🎓', bg: '#eff6ff', nm: 'Campus France — Documents officiels', badge: { t: 'Obligatoire', c: 'b-red' },
    note: { t: '<strong>Important :</strong> Après ton RDV de vérification mercredi, ton message de fin de procédure sera envoyé automatiquement par email. <strong>Surveille ta boîte mail</strong> dès mercredi soir.', c: 'n-blu' },
    items: [
      { id: 'cf1', t: 'Message de fin de procédure Campus France', d: 'Email envoyé automatiquement après validation de l\'authentification de tes diplômes. À imprimer et joindre OBLIGATOIREMENT.', h: 'Attendu après le RDV de vérification de mercredi. Vérifie sur ton compte <strong>etudes-en-france.fr</strong>.', g: ['req', 'Après mercredi'] },
      { id: 'cf2', t: 'Attestation de préinscription / d\'admission M2', d: 'Document officiel confirmant ton inscription au M2 Systèmes Logiciels.', h: 'Téléchargeable sur ton compte <strong>Études en France</strong>.', g: ['req'] },
      { id: 'cf3', t: 'Formulaire France-Visas rempli + signé', d: 'Format long séjour étudiant. À imprimer et signer à la main.', h: 'Remplir sur <strong><a href="https://france-visas.gouv.fr">france-visas.gouv.fr</a></strong>.', g: ['req'] },
    ]
  },
  {
    id: 'au', ico: '📜', bg: '#fffbeb', nm: 'Diplômes & Authentification', badge: { t: 'En cours', c: 'b-amb' },
    note: { t: '<strong>MAE Constantine = NON OBLIGATOIRE pour le visa France.</strong> La légalisation n\'est pas requise pour le dossier France.', c: 'n-grn' },
    chain: true,
    items: [
      { id: 'au1', t: 'Diplôme universitaire original authentifié', d: 'Retirer l\'original authentifié par Campus France.', h: 'Faire des copies certifiées conformes après récupération.', g: ['req', 'Dimanche'] },
      { id: 'au2', t: 'Relevés de notes universitaires', d: 'Toutes les années, depuis L1 jusqu\'au dernier diplôme.', h: 'Si certains relevés sont en arabe, prévoir une traduction assermentée.', g: ['req'] },
      { id: 'au3', t: 'Attestation de réussite provisoire', d: 'Utilisable si le diplôme définitif n\'est pas encore prêt.', h: 'Demandée à la scolarité de ton université.', g: ['opt'] },
    ]
  },
  {
    id: 'id', ico: '🪪', bg: '#f0fdf4', nm: 'Identité & Documents civils', badge: { t: 'À préparer', c: 'b-amb' },
    items: [
      { id: 'id1', t: 'Passeport en cours de validité + photocopies', d: 'Validité minimum : date de fin du visa + 3 mois.', h: 'Photocopier toutes les pages importantes et celles avec tampons.', g: ['req'] },
      { id: 'id2', t: 'Photos d\'identité normes OACI', d: '35×45 mm, fond blanc, visage dégagé.', h: 'Mieux vaut un photographe professionnel.', g: ['req'] },
      { id: 'id3', t: 'Acte de naissance avec filiation', d: 'Original et copie. Traduction assermentée si nécessaire.', h: 'Obtenu à la mairie (APC) de la commune de naissance.', g: ['req'] },
      { id: 'id4', t: 'Fiche familiale d\'état civil', d: 'Prouve la composition de la famille et le lien avec le garant.', h: 'Prélevée au service d\'état civil de ton domicile familial.', g: ['req'] },
      { id: 'id5', t: 'Casier judiciaire bulletin n°3', d: 'Extrait vierge requis pour visa long séjour.', h: 'Demander en ligne sur justice.gov.dz ou au tribunal.', g: ['req'] },
    ]
  },
  {
    id: 'fi', ico: '💰', bg: '#faf5ff', nm: 'Finances personnelles', badge: { t: 'Attention', c: 'b-amb' },
    note: { t: 'Ton emploi récent + tes relevés CCP sont acceptables si tu complètes avec un garant en France.', c: 'n-amb' },
    items: [
      { id: 'fi1', t: 'Attestation de travail/employeur', d: 'Officielle, sur papier en-tête avec salaire.', h: 'Doit mentionner ton poste, date de début et salaire.', g: ['req'] },
      { id: 'fi2', t: 'Bulletins de salaire disponibles', d: 'Même 1 ou 2 mois sont utiles.', h: 'Présente tous les bulletins que tu as.', g: ['req'] },
      { id: 'fi3', t: 'Relevés CCP', d: 'Relevés du compte postal algérien.', h: 'Imprimer les mois disponibles.', g: ['req'] },
      { id: 'fi4', t: 'CV actualisé', d: 'Important pour un étudiant en reprise d\'étude.', h: '1 à 2 pages, en français, clair et professionnel.', g: ['req'] },
    ]
  },
  {
    id: 'gfr', ico: '🗼', bg: '#f0fdf4', nm: 'Garant France — Belle-sœur', badge: { t: 'Pièce maîtresse', c: 'b-grn' },
    note: { t: 'La belle-sœur doit prouver des revenus suffisants et légaliser sa prise en charge.', c: 'n-grn' },
    items: [
      { id: 'gf1', t: 'Attestation de prise en charge', d: 'Engagement de prise en charge pour l\'année.', h: 'Doit être légalisée à la mairie de Paris ou chez un notaire.', g: ['req'] },
      { id: 'gf2', t: 'Bulletins de salaire de la garante', d: '3 derniers bulletins pour prouver les revenus.', h: 'Salaire net visible et cohérent avec l\'engagement.', g: ['req'] },
      { id: 'gf3', t: 'Relevés bancaires de la garante', d: '3 derniers mois du compte français.', h: 'Téléchargeables en PDF depuis la banque.', g: ['req'] },
    ]
  },
  {
    id: 'lgt', ico: '🏨', bg: '#eff6ff', nm: 'Hébergement', badge: { t: 'Réservation faite', c: 'b-grn' },
    note: { t: 'Une réservation hôtel + lettre explicative est acceptée si le CROUS n\'est pas confirmé.', c: 'n-amb' },
    items: [
      { id: 'lo1', t: 'Confirmation hôtel Besançon', d: 'Document d\'hébergement provisoire.', h: 'Imprimer la confirmation Agoda ou équivalent.', g: ['don'] },
      { id: 'lo2', t: 'Lettre explicative hébergement', d: 'Expliquer ton plan logement et la demande CROUS future.', h: 'Dire que tu feras la demande CROUS le 7 juillet.', g: ['req'] },
    ]
  },
  {
    id: 'rdv', ico: '📋', bg: '#fff1f2', nm: 'RDV CAPAGO 8 juin', badge: { t: 'Important', c: 'b-red' },
    note: { t: 'Vérifie bien ta circonscription consulaire et apporte originaux + copies.', c: 'n-red' },
    items: [
      { id: 'rd1', t: 'Convocation CAPAGO imprimée', d: 'Présentation du RDV au centre.', h: 'Imprimer l\'email de confirmation.', g: ['req'] },
      { id: 'rd2', t: 'Frais en espèces DZD', d: 'Frais CAPAGO + consulat en DZD.', h: 'Prévoir un peu plus selon le taux du jour.', g: ['req'] },
      { id: 'rd3', t: 'Dossier classé + copies', d: 'Originaux et copies pour chaque document.', h: 'Organiser les documents par section.', g: ['req'] },
    ]
  },
];

const createInitialState = () => {
  const init = {};
  SECS.forEach((section) => {
    section.items.forEach((item) => {
      init[item.id] = false;
    });
  });
  return init;
};

const getTagLabel = (tag) => {
  if (tag === 'req') return 'Obligatoire';
  if (tag === 'opt') return 'Recommandé';
  if (tag === 'don') return 'Déjà fait ✓';
  if (tag === 'inf') return 'Info utile';
  return tag;
};

const Tag = ({ tag }) => {
  const className =
    tag === 'req' ? 't-req' :
    tag === 'opt' ? 't-opt' :
    tag === 'don' ? 't-don' :
    tag === 'inf' ? 't-inf' :
    't-urg';

  return <span className={`tag ${className}`}>{getTagLabel(tag)}</span>;
};

const Chain = () => (
  <div className="chain">
    <div className="chain-t">Chaîne d\'authentification — diplômes algériens vers France</div>
    <div className="chain-steps">
      <div className="cstep cs1"><div className="csdot">1</div><div className="cslbl">Campus France authentifie</div></div>
      <span className="cs-arr">→</span>
      <div className="cstep cs2"><div className="csdot">2</div><div className="cslbl">RDV vérif. mercredi</div></div>
      <span className="cs-arr">→</span>
      <div className="cstep cs3"><div className="csdot">3</div><div className="cslbl">Message fin de procédure</div></div>
      <span className="cs-arr">→</span>
      <div className="cstep cs4"><div className="csdot">4</div><div className="cslbl">MAE Constantine — non requis visa France</div></div>
    </div>
  </div>
);

function App() {
  const [state, setState] = useState(createInitialState());
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('Non connecté');
  const [openSections, setOpenSections] = useState([]);

  const total = useMemo(() => Object.keys(state).length, [state]);
  const checked = useMemo(() => Object.values(state).filter(Boolean).length, [state]);
  const percent = total ? Math.round((checked / total) * 100) : 0;

  useEffect(() => {
    const saved = localStorage.getItem('visaChecklistState');
    if (saved) {
      try {
        setState((current) => ({ ...current, ...JSON.parse(saved) }));
      } catch (error) {
        console.error('Error loading state:', error);
      }
    }

    const init = async () => {
      setStatus('Connexion automatique...');
      const { data } = await supabaseClient.auth.getSession();
      let currentUser = data.session ? data.session.user : null;
      if (!currentUser) {
        // Auto sign in with GitHub
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) {
          console.error('GitHub sign in error:', error);
          setStatus('Erreur de connexion GitHub');
          return;
        }
        // The page will redirect, so no need to set user here
        return;
      }
      setUser(currentUser);
      setStatus(currentUser ? `Connecté : ${currentUser.email}` : 'Non connecté');
      if (currentUser) {
        await loadRemoteState(currentUser);
      }
    };

    init();
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      const currentUser = session ? session.user : null;
      setUser(currentUser);
      setStatus(currentUser ? `Connecté : ${currentUser.email}` : 'Non connecté');
      if (currentUser) {
        loadRemoteState(currentUser);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('visaChecklistState', JSON.stringify(state));
  }, [state]);

  const loadRemoteState = async (currentUser) => {
    if (!currentUser) return;
    const { data, error } = await supabaseClient
      .from('checklist_states')
      .select('state')
      .eq('user_id', currentUser.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase load error:', error);
      return;
    }

    if (data?.state) {
      setState(data.state);
      localStorage.setItem('visaChecklistState', JSON.stringify(data.state));
    }
  };

  const saveRemoteState = async (nextState) => {
    if (!user) return;
    const { error } = await supabaseClient
      .from('checklist_states')
      .upsert({ user_id: user.id, state: nextState, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });

    if (error) {
      console.error('Supabase save error:', error);
    }
  };

  const handleToggle = (id) => {
    setState((current) => {
      const next = { ...current, [id]: !current[id] };
      saveRemoteState(next);
      return next;
    });
  };

  const handleReset = () => {
    if (!window.confirm('Réinitialiser toutes les cases ?')) return;
    const next = createInitialState();
    setState(next);
    saveRemoteState(next);
  };

  const toggleSection = (sectionId) => {
    setOpenSections((current) =>
      current.includes(sectionId) ? current.filter((id) => id !== sectionId) : [...current, sectionId]
    );
  };

  const openAllSections = () => {
    setOpenSections(SECS.map((section) => section.id));
  };

  return (
    <div className="container">
      <h1 className="page-title">Dossier Visa Étudiant — M2 Besançon</h1>
      <p className="page-sub">Université Marie et Louis Pasteur · M2 Systèmes Logiciels · Checklist exhaustive avec instructions</p>
      <div className="rdv-badge">📅 RDV CAPAGO : 8 juin 2025</div>
      <div className="prog-wrap">
        <div className="prog-bar" style={{ width: `${percent}%` }} />
      </div>
      <div className="prog-lbl">{checked} / {total} cochés ({percent}%)</div>
      <div className="top-actions">
        <button className="reset-btn" type="button" onClick={handleReset}>↺ Réinitialiser</button>
        <button className="expand-all" type="button" onClick={openAllSections}>⊞ Tout ouvrir</button>
        <span className="status-label">{status}</span>
      </div>

      {SECS.map((section) => {
        const isOpen = openSections.includes(section.id);
        return (
          <div className="sec" key={section.id}>
            <div className="sec-hdr" onClick={() => toggleSection(section.id)}>
              <div className="sec-ico" style={{ background: section.bg }}>{section.ico}</div>
              <div className="sec-inf">
                <div className="sec-name">{section.nm}</div>
                <div className="sec-cnt">{section.items.filter((item) => state[item.id]).length}/{section.items.length} cochés</div>
              </div>
              <span className={`badge ${section.badge.c}`}>{section.badge.t}</span>
              <span className={`chev${isOpen ? ' open' : ''}`}>▼</span>
            </div>
            <div className={`sec-body${isOpen ? ' open' : ''}`}>
              {section.note && <div className={`note ${section.note.c}`} dangerouslySetInnerHTML={{ __html: section.note.t }} />}
              {section.chain && <Chain />}
              {section.items.map((item) => (
                <div key={item.id} className={`item${state[item.id] ? ' chk' : ''}`} onClick={() => handleToggle(item.id)}>
                  <div className="cbx">
                    <svg className="ck-ico" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4L4.5 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="ibody">
                    <div className="ititle">{item.t}</div>
                    <div className="idet">{item.d}</div>
                    {item.h && (
                      <div className="ihow">
                        <div className="ihow-title">📌 Comment obtenir / faire</div>
                        <div className="ihow-txt" dangerouslySetInnerHTML={{ __html: item.h }} />
                      </div>
                    )}
                    <div className="tags">{item.g.map((tag) => <Tag key={tag} tag={tag} />)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
