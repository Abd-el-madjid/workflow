import React from 'react';

export default function Header({ user, onLogout }) {
  return (
    <header className="top-header">
      <div className="top-header-left">
        <div className="th-logo">🎓</div>
        <div className="th-title">Visa Checklist Besançon</div>
      </div>
      <div className="top-header-right">
        <span className="th-user">{user?.email}</span>
        <button className="th-logout" onClick={onLogout}>Déconnexion</button>
      </div>
    </header>
  );
}
