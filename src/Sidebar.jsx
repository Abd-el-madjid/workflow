import React from 'react';
import { BEFORE_SECS, AFTER_SECS } from './data';

export default function Sidebar({
  phase,
  selectedId,
  state,
  checked,
  total,
  pct,
  onPhaseChange,
  onSelectSection,
  onReset
}) {
  const activeSecs = phase === 'before' ? BEFORE_SECS : AFTER_SECS;

  const secCount = (sec) => sec.items.filter(i => state[i.id]).length;

  return (
    <aside className="sidebar">
      <div className="sidebar-top fix-top">
      <div className="sb-progress">
        <div className="sb-prog-bar-wrap">
          <div className="sb-prog-bar" style={{ width: `${pct}%` }} />
        </div>
        <div className="sb-prog-label">{checked} / {total} ({pct}%)</div>
      </div>

      {/* Phase tabs */}
      <div className="phase-tabs fix-bottom">
        <button
          className={`phase-tab${phase === 'before' ? ' active' : ''}`}
          onClick={() => onPhaseChange('before', BEFORE_SECS[0].id)}
        >
          🔥 Avant le visa
        </button>
        <button
          className={`phase-tab${phase === 'after' ? ' active' : ''}`}
          onClick={() => onPhaseChange('after', AFTER_SECS[0].id)}
        >
          ✈️ Après le visa
        </button>
        <button
          className={`phase-tab${phase === 'letters' ? ' active' : ''}`}
          onClick={() => onPhaseChange('letters')}
        >
          ✍️ Lettres
        </button>
      </div>
      </div>


      {/* Section list */}
     
        <nav className="sb-nav">
              {phase !== 'letters' && (
                  <div className="sb-nav-cntainer">
       {activeSecs.map(sec => (
            <button
              key={sec.id}
              className={`sb-nav-item${selectedId === sec.id ? ' active' : ''}`}
              onClick={() => onSelectSection(sec.id)}
            >
              <span className="sb-nav-ico" style={{ background: sec.bg }}>{sec.ico}</span>
              <span className="sb-nav-info">
                <span className="sb-nav-name">{sec.nm}</span>
                {sec.items.length > 0 && (
                  <span className="sb-nav-cnt">{secCount(sec)}/{sec.items.length}</span>
                )}
              </span>
              <span className={`sb-badge ${sec.badge.c}`}>{sec.badge.t}</span>
            </button>
          ))}
                
                  </div>
       )}    
        </nav>
    

      <div className="sb-footer fix-bottom">
        <button className="sb-reset" onClick={onReset}>↺ Réinitialiser</button>
      </div>
    </aside>
  );
}
