import React from 'react';
import LettersPanel from './Letterspanel';
import { BEFORE_SECS, AFTER_SECS } from './data';

const TAG_MAP = { req: 'Obligatoire', opt: 'Recommandé', don: 'Déjà fait ✓', inf: 'Info utile' };
const TAG_CLS = { req: 't-req', opt: 't-opt', don: 't-don', inf: 't-inf' };

const Tag = ({ tag }) => (
  <span className={`tag ${TAG_CLS[tag] || 't-urg'}`}>{TAG_MAP[tag] || tag}</span>
);

const ChainDiagram = () => (
  <div className="chain">
    <div className="chain-t">Chaîne d'authentification — diplômes algériens vers France</div>
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

export default function MainContent({
  phase,
  activeSection,
  state,
  saveStatus,
  saveLoading,
  expandedItems,
  onToggle,
  onToggleExpand,
  user
}) {
  return (
    <main className="main">
      <div className="main-topbar">
        <div className="main-topbar-left">
          {phase !== 'letters' && activeSection ? (
            <>
              <span className="main-topbar-ico" style={{ background: activeSection.bg }}>
                {activeSection.ico}
              </span>
              <div>
                <div className="main-topbar-title">{activeSection.nm}</div>
                <div className="main-topbar-rdv">📅 RDV CAPAGO : 8 juin 2025</div>
              </div>
            </>
          ) : (
            <div>
              <div className="main-topbar-title">Lettres officielles</div>
              <div className="main-topbar-rdv">Modèles complets — copier ou imprimer en PDF</div>
            </div>
          )}
        </div>
        <div className="main-topbar-right">
          {saveStatus && (
            <span className={`save-status${saveLoading ? ' loading' : ''}`}>{saveStatus}</span>
          )}
        </div>
      </div>

      <div className="main-body">
        {/* LETTERS VIEW */}
        {phase === 'letters' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
            <LettersPanel user={user} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
              <div className="letter-section">
                <div className="section-header">
                  <h3>📎 Document Attaché</h3>
                </div>
                <div className="section-content" style={{ fontSize: '14px', color: '#6b7280' }}>
                  Sélectionnez une lettre avec un document attaché pour voir un aperçu ici.
                </div>
              </div>
              <div className="letter-section">
                <div className="section-header">
                  <h3>📚 Historique</h3>
                </div>
                <div className="section-content" style={{ fontSize: '14px', color: '#6b7280' }}>
                  Sélectionnez une lettre pour voir l'historique des modifications.
                </div>
              </div>
            </div>
          </div>
        )}
        {/* CHECKLIST VIEW */}
        {phase !== 'letters' && activeSection && (
          <>
            {/* Note */}
            {activeSection.note && (
              <div className={`note ${activeSection.note.c}`}
                dangerouslySetInnerHTML={{ __html: activeSection.note.t }} />
            )}

            {/* Explainers */}
            {activeSection.expls?.map((e, i) => (
              <div key={i} className="expl-card">
                <button className="expl-toggle" onClick={() => onToggleExpand(`expl-${activeSection.id}-${i}`)}>
                  <span>📘 {e.t}</span>
                  <span>{expandedItems[`expl-${activeSection.id}-${i}`] ? '▲' : '▼'}</span>
                </button>
                {expandedItems[`expl-${activeSection.id}-${i}`] && (
                  <div className="expl-body" dangerouslySetInnerHTML={{ __html: e.b }} />
                )}
              </div>
            ))}

            {/* Chain */}
            {activeSection.chain && <ChainDiagram />}

            {/* Items */}
            {activeSection.items.map(item => (
              <div key={item.id} className={`item-card${state[item.id] ? ' checked' : ''}`}>
                <div className="item-row" onClick={() => onToggle(item.id)}>
                  <div className="item-cb">
                    <svg viewBox="0 0 12 10" fill="none">
                      <path d="M1 4.5L4.5 8L11 1.5" stroke="white" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="item-main">
                    <div className="item-title">{item.t}</div>
                    <div className="item-desc">{item.d}</div>
                  </div>
                  {item.s && (
                    <button
                      className="item-expand-btn"
                      onClick={e => { e.stopPropagation(); onToggleExpand(item.id); }}
                    >
                      {expandedItems[item.id] ? '▲' : '▼'}
                    </button>
                  )}
                </div>
                {item.s && expandedItems[item.id] && (
                  <div className="item-how">
                    <div className="item-how-title">📌 Comment faire — étape par étape</div>
                    <div className="item-how-body" dangerouslySetInnerHTML={{ __html: item.s }} />
                  </div>
                )}
                <div className="item-tags">
                  {item.g?.map(tag => <Tag key={tag} tag={tag} />)}
                </div>
              </div>
            ))}

            {activeSection.items.length === 0 && !activeSection.expls && (
              <div className="empty-section">Ouvrir les définitions ci-dessus ▲</div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
