# 📚 Exemples d'Intégration

## 1. Utiliser le hook dans un composant

### Exemple basique

```jsx
import { useChecklistAuth } from "../hooks/useChecklistAuth";

export function MyChecklist() {
  const { state, toggle, progress } = useChecklistAuth();

  return (
    <div>
      <p>
        Progression: {progress.checked}/{progress.total} ({progress.percentage}
        %)
      </p>
      <input
        type="checkbox"
        checked={state["item-1"] || false}
        onChange={() => toggle("item-1")}
      />
    </div>
  );
}
```

---

## 2. Afficher l'état de sauvegarde

```jsx
export function SaveIndicator() {
  const { saveStatus, saveLoading } = useChecklistAuth();

  if (!saveStatus) return null;

  return <div className={saveLoading ? "saving" : "saved"}>{saveStatus}</div>;
}
```

---

## 3. Implémenter le logout dans Header

```jsx
import { useChecklistAuth } from "../hooks/useChecklistAuth";

export function Header() {
  const { user, logout } = useChecklistAuth();

  return (
    <header>
      <div>{user?.email}</div>
      <button onClick={logout}>Déconnexion</button>
    </header>
  );
}
```

---

## 4. Accès aux données complètes

```jsx
const {
  user, // { id, email, ... }
  loading, // Boolean
  state, // { 'item-1': true, 'item-2': false, ... }
  setState, // setState(newState)
  toggle, // toggle(id)
  reset, // reset()
  logout, // logout()
  saveStatus, // "Sauvegarde..." | "✓ Sauvegardé"
  saveLoading, // Boolean
  progress: {
    checked, // Nombre d'items cochés
    total, // Nombre total d'items
    percentage, // 0-100
  },
} = useChecklistAuth();
```

---

## 5. Composant avec Progress Bar

```jsx
import { useChecklistAuth } from "../hooks/useChecklistAuth";

export function ProgressTracker() {
  const { progress } = useChecklistAuth();

  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{ width: `${progress.percentage}%` }}
      />
      <span>
        {progress.checked} / {progress.total} complété
      </span>
    </div>
  );
}
```

---

## 6. Intégration avec Sidebar

```jsx
import { useChecklistAuth } from "../hooks/useChecklistAuth";
import { BEFORE_SECS, AFTER_SECS } from "../../imports/data";

export function Sidebar() {
  const { state, progress } = useChecklistAuth();

  const calculateSectionProgress = (section) => {
    const items = section.items || [];
    const checked = items.filter((i) => state[i.id]).length;
    return { checked, total: items.length };
  };

  return (
    <aside>
      {BEFORE_SECS.map((section) => {
        const { checked, total } = calculateSectionProgress(section);
        const pct = total ? Math.round((checked / total) * 100) : 0;
        return (
          <div key={section.id}>
            <h3>{section.nm}</h3>
            <p>
              {pct}% - {checked}/{total}
            </p>
          </div>
        );
      })}
    </aside>
  );
}
```

---

## 7. Bouton de Reset sécurisé

```jsx
import { useChecklistAuth } from "../hooks/useChecklistAuth";

export function ResetButton() {
  const { reset } = useChecklistAuth();

  return (
    <button onClick={reset} className="btn-danger">
      Réinitialiser checklist
    </button>
  );
}
```

---

## 8. État global avec Contexte (optionnel)

Si vous voulez partager l'état à travers l'app sans passer les props:

```jsx
// ChecklistProvider.jsx
import { createContext, useContext } from "react";
import { useChecklistAuth } from "../hooks/useChecklistAuth";

const ChecklistContext = createContext();

export function ChecklistProvider({ children }) {
  const auth = useChecklistAuth();
  return (
    <ChecklistContext.Provider value={auth}>
      {children}
    </ChecklistContext.Provider>
  );
}

export function useChecklist() {
  return useContext(ChecklistContext);
}

// Dans App.tsx
import { ChecklistProvider } from "./context/ChecklistProvider";

export default function App() {
  return (
    <ChecklistProvider>
      <DashboardLayout />
    </ChecklistProvider>
  );
}

// Dans n'importe quel composant
import { useChecklist } from "./context/ChecklistProvider";

export function MyComponent() {
  const { state, toggle } = useChecklist();
  // ...
}
```

---

## 9. Affichage de validation avec Items

```jsx
import { useChecklistAuth } from "../hooks/useChecklistAuth";

export function ChecklistItems({ items }) {
  const { state, toggle, saveLoading } = useChecklistAuth();

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <input
            type="checkbox"
            checked={state[item.id] || false}
            onChange={() => toggle(item.id)}
            disabled={saveLoading}
          />
          <label>{item.title}</label>
        </li>
      ))}
    </ul>
  );
}
```

---

## 10. Intégration avec Lettre (templates)

```jsx
import { useChecklistAuth } from "../hooks/useChecklistAuth";

export function LetterEditor({ letterId, initialContent }) {
  const { user } = useChecklistAuth();
  const [content, setContent] = useState(initialContent);

  const handleSave = async () => {
    if (!user) return;

    // Sauvegarder dans Supabase
    const { error } = await supabaseClient.from("user_letters").upsert(
      {
        user_id: user.id,
        letter_id: letterId,
        content: content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,letter_id" },
    );

    if (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSave}>Sauvegarder lettre</button>
    </div>
  );
}
```

---

## 11. Debugging & Logs

```jsx
import { useChecklistAuth } from "../hooks/useChecklistAuth";

export function DebugInfo() {
  const { user, state, progress, saveStatus } = useChecklistAuth();

  return (
    <pre style={{ background: "#f0f0f0", padding: "10px" }}>
      {JSON.stringify(
        {
          user: user ? { id: user.id, email: user.email } : null,
          progress,
          stateKeys: Object.keys(state).length,
          saveStatus,
        },
        null,
        2,
      )}
    </pre>
  );
}
```

---

## 12. Patterns courants

### Pattern: Charger et afficher les lettres

```jsx
import { useEffect, useState } from "react";
import { useChecklistAuth } from "../hooks/useChecklistAuth";
import { supabaseClient } from "../../supabaseClient";

export function LettersView() {
  const { user } = useChecklistAuth();
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    if (!user) return;

    const loadLetters = async () => {
      const { data, error } = await supabaseClient
        .from("user_letters")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        return;
      }

      setLetters(data || []);
    };

    loadLetters();
  }, [user]);

  return (
    <div>
      {letters.map((letter) => (
        <div key={letter.letter_id}>
          <h3>{letter.letter_id}</h3>
          <p>{letter.content}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Mémo rapide

| Besoin             | Code                  |
| ------------------ | --------------------- |
| Cocher un item     | `toggle('item-id')`   |
| Voir progression   | `progress.percentage` |
| Infos utilisateur  | `user.email`          |
| Message sauvegarde | `saveStatus`          |
| Réinitialiser      | `reset()`             |
| Déconnecter        | `logout()`            |
| État brut          | `state['item-id']`    |

---

**Plus de détails?** Consultez SETUP.md
