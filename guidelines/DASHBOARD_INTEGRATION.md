---
layout: default
title: Dashboard Integration
render_with_liquid: false
---

# 🎯 Guide Complet d'Intégration DashboardLayout

## Vue d'ensemble

Le hook `useChecklistAuth` fournit l'état global et les fonctions nécessaires.
La DashboardLayout doit être modifiée pour utiliser ce hook au lieu de son propre état.

---

## Structure actuelle vs. nouvelle

### Avant (état local dans DashboardLayout)

```jsx
export function DashboardLayout({ onLogout }) {
  const [selectedMenu, setSelectedMenu] = useState("avant-visa");
  const [state, setState] = useState({}); // ❌ État local non synchronisé
  // ...
}
```

### Après (état du hook)

```jsx
import { useChecklistAuth } from "../hooks/useChecklistAuth";

export function DashboardLayout({ onLogout }) {
  const { state, toggle, reset, progress, user, logout } = useChecklistAuth();
  // ✅ État global synchronisé avec Supabase
}
```

---

## Modifications requises dans DashboardLayout

### 1. Import du hook

```jsx
import { useChecklistAuth } from "../hooks/useChecklistAuth";
```

### 2. Récupérer l'état du hook

```jsx
export function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const { state, toggle, reset, progress, user, logout, saveStatus } = useChecklistAuth();
  const [selectedMenu, setSelectedMenu] = useState<string>("avant-visa");
  // ... autres états locaux
}
```

### 3. Supprimer les anciens hooks d'état

```jsx
// ❌ À SUPPRIMER
// const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

// ✅ À UTILISER à la place
// saveStatus vient du hook useChecklistAuth
```

### 4. Utiliser `toggle` au lieu d'une fonction locale

```jsx
// Avant
const handleChecklistToggle = (itemId: string) => {
  setSaveStatus("saving");
  setTimeout(() => setSaveStatus("saved"), 800);
};

// Après
const handleChecklistToggle = (itemId: string) => {
  toggle(itemId); // Fonction du hook - gère la sauvegarde automatique
};
```

### 5. Utiliser `reset` au lieu d'une fonction locale

```jsx
// Avant
const handleReset = () => {
  // Logic custom
};

// Après
const handleReset = () => {
  reset(); // Fonction du hook - inclut la confirmation et la sauvegarde
};
```

### 6. Afficher le progress du hook

```jsx
// Utiliser le progress du hook au lieu de calculer localement
<div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
<span>{progress.checked} / {progress.total}</span>
```

### 7. Intégrer le logout

```jsx
<Button onClick={logout}>Déconnexion</Button>
// Le logout du hook gère tout (auth, state, localStorage, redirect)
```

---

## Exemple complet modifié

```jsx
import { useState } from "react";
import { useChecklistAuth } from '../hooks/useChecklistAuth';
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
// ... autres imports

interface DashboardLayoutProps {
  onLogout: () => void;
}

export function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  // ✅ Récupérer l'état du hook
  const {
    state,
    toggle,
    reset,
    progress,
    user,
    logout,
    saveStatus,
    saveLoading
  } = useChecklistAuth();

  // États locaux (UI uniquement)
  const [selectedMenu, setSelectedMenu] = useState<string>("avant-visa");
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(["avant-visa"]));
  const [selectedSection, setSelectedSection] = useState<any>(BEFORE_SECS[0]);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Pas besoin de gérer saveStatus, saveLoading - ils viennent du hook!

  // Fonctions
  const handleChecklistToggle = (itemId: string) => {
    toggle(itemId); // Le hook gère la sauvegarde auto
  };

  const handleReset = () => {
    reset(); // Le hook gère tout (confirmation + sauvegarde)
  };

  const handleLogout = async () => {
    await logout(); // Appelle onLogout via le hook
  };

  // ... rest de la logique UI (toggleMenu, etc)

  return (
    <div className="dashboard-layout">
      {/* Header avec user info et logout */}
      <header>
        <div>
          <h1>Visa Checklist</h1>
          <span>{user?.email}</span>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          {saveStatus && <span className="mr-2">{saveStatus}</span>}
          Déconnexion
        </Button>
      </header>

      {/* Sidebar avec sections */}
      <aside>
        {/* Afficher la progression globale */}
        <div className="progress-section">
          <Progress value={progress.percentage} />
          <p>{progress.checked} / {progress.total}</p>
        </div>

        {/* Bouton reset */}
        <Button onClick={handleReset} variant="ghost">
          Réinitialiser
        </Button>

        {/* Sections */}
        {BEFORE_SECS.map(section => {
          const sectionItems = section.items || [];
          const sectionChecked = sectionItems.filter(
            item => state[item.id]
          ).length;
          const sectionTotal = sectionItems.length;
          const sectionPct = sectionTotal
            ? Math.round(sectionChecked / sectionTotal * 100)
            : 0;

          return (
            <div key={section.id}>
              <h3>{section.nm}</h3>
              <div className="section-progress">
                <Progress value={sectionPct} />
                <span>{sectionChecked}/{sectionTotal}</span>
              </div>
            </div>
          );
        })}
      </aside>

      {/* Main content avec items cochables */}
      <main>
        {selectedSection?.items?.map(item => (
          <div key={item.id}>
            <input
              type="checkbox"
              checked={state[item.id] || false}
              onChange={() => handleChecklistToggle(item.id)}
              disabled={saveLoading}
            />
            <label>{item.title}</label>
          </div>
        ))}
      </main>
    </div>
  );
}
```

---

## Intégration avec MainContent

### Avant

```jsx
<MainContent
  state={state}
  onToggle={(id) => setState((p) => ({ ...p, [id]: !p[id] }))}
  saveStatus={saveStatus}
/>
```

### Après

```jsx
<MainContent
  state={state}
  onToggle={toggle} // ← Directement du hook
  saveStatus={saveStatus} // ← Du hook
  saveLoading={saveLoading} // ← Du hook
/>
```

---

## Avantages de cette intégration

✅ **Synchronisation Supabase** - Les données sont sauvegardées automatiquement
✅ **Persistance localStorage** - Sauvegarde instantanée côté client
✅ **Gestion d'erreurs** - Gérée par le hook
✅ **Messages de status** - Affichage auto de "Sauvegarde..." puis "✓ Sauvegardé"
✅ **Logout sécurisé** - Nettoie tout (auth, state, localStorage)
✅ **Code plus propre** - Pas de duplication de logique

---

## Checklist d'intégration

- [ ] Importer le hook `useChecklistAuth`
- [ ] Appeler le hook dans DashboardLayout
- [ ] Remplacer les états locaux (state, saveStatus) par ceux du hook
- [ ] Remplacer `setState` par `toggle`
- [ ] Remplacer le reset local par `reset` du hook
- [ ] Utiliser `logout` du hook au lieu de `onLogout`
- [ ] Afficher `progress` au lieu de calculer localement
- [ ] Tester le toggle des items
- [ ] Tester la sauvegarde Supabase (voir les logs)
- [ ] Tester le logout et la redirection

---

## Debugging

### Vérifier que tout fonctionne:

1. **Console logs**

   ```js
   // Chercher ✅ et ✓ dans la console
   ```

2. **Vérifier saveStatus**
   - Au premier click: "Sauvegarde..."
   - Après 100ms: "✓ Sauvegardé"
   - Après 3.5s: disparaît

3. **Vérifier Supabase**
   - Dashboard → Table Editor → checklist_states
   - Doit avoir une ligne avec votre user_id

4. **Vérifier localStorage**
   ```js
   console.log(JSON.parse(localStorage.getItem("vsChecklist")));
   ```

---

## Migration étape par étape

Si vous avez peur de casser le code:

**Étape 1:** Importer le hook et l'utiliser EN PARALLÈLE

```jsx
const auth = useChecklistAuth();
// Garder votre state local aussi
const [localState, setLocalState] = useState({});
```

**Étape 2:** Tester que les deux fonctionnent

```jsx
// Toggle utilise d'abord le hook
toggle(id); // ← Hook
// Puis synchronise le state local
setLocalState(auth.state);
```

**Étape 3:** Remplacer progressivement

- Remplacer les calls à `setLocalState` par `toggle` du hook
- Utiliser `auth.state` à la place du state local

**Étape 4:** Nettoyage

- Supprimer le state local
- Utiliser uniquement le hook

---

**Questions?** Voir INTEGRATION_EXAMPLES.md pour plus d'exemples!
