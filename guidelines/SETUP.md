# 🚀 Configuration Complète du Système de Checklist

## 📋 Vue d'ensemble

Ce projet intègre:

- ✅ **Authentification GitHub** via Supabase
- ✅ **Checklist** avec sauvegarde Supabase & localStorage
- ✅ **Progress tracking** en temps réel
- ✅ **Logout** avec nettoyage des données
- ✅ **Lettre modèles** pour demande de visa

---

## 🔑 1. Configuration Supabase

### Étape 1: Créer un compte Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet

### Étape 2: Configuration OAuth GitHub

1. **Dans Supabase Dashboard:**
   - Allez à `Authentication > Providers`
   - Activez `GitHub`
   - Copiez `Client ID` et `Client Secret`

2. **Sur GitHub (Settings > Developer settings > OAuth Apps):**
   - Créez une nouvelle OAuth App
   - Entrez les détails:
     - **Application name:** Visa Checklist
     - **Homepage URL:** `http://localhost:5173`
     - **Authorization callback URL:** `http://localhost:5173`
   - Obtenez `Client ID` et `Client Secret`

3. **Collez dans Supabase:**
   - Client ID et Secret dans l'onglet GitHub

### Étape 3: Créer les tables Supabase

Exécutez ce SQL dans le Supabase SQL Editor:

```sql
-- Créer la table pour les états de checklist
CREATE TABLE IF NOT EXISTS checklist_states (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  state JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Créer la table pour les lettres sauvegardées
CREATE TABLE IF NOT EXISTS user_letters (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  letter_id TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, letter_id)
);

-- Activer RLS (Row Level Security)
ALTER TABLE checklist_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_letters ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour checklist_states
CREATE POLICY "Users can read their own checklist"
  ON checklist_states FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checklist"
  ON checklist_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist"
  ON checklist_states FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour user_letters
CREATE POLICY "Users can read their own letters"
  ON user_letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own letters"
  ON user_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own letters"
  ON user_letters FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## 🔧 2. Configuration des Variables d'Environnement

### Créez un fichier `.env.local` à la racine:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... # votre clé anonyme Supabase

# OAuth Redirect (adapté à votre environnement)
VITE_OAUTH_REDIRECT_URL=http://localhost:5173

# Timeout pour afficher le message "Sauvegardé"
VITE_SAVE_STATUS_TIMEOUT_MS=3500
```

### Où trouver vos clés Supabase:

- Supabase Dashboard → Settings → API
- Copiez `Project URL` et `anon public key`

---

## 📁 3. Structure des Fichiers

```
project/
├── Login.jsx                    # Composant login (GitHub OAuth)
├── useChecklistAuth.js          # Hook pour logique d'auth & checklist
├── ChecklistAuthContext.jsx     # Contexte React (optionnel)
├── App.jsx                      # Application principale
├── data.js                      # Données des sections & items
├── Letters.js                   # Modèles de lettres
├── supabaseClient.js            # Client Supabase configuré
├── .env.local                   # Variables d'environnement (à créer)
└── .env.example                 # Template d'env
```

---

## 🎯 4. Fonctionnalités Implémentées

### 🔐 Login / Logout

**Login.jsx:**

```jsx
import Login from "./Login";

// Utilisation automatique dans App.jsx
if (!user) return <Login />;
```

**Logout** (appelé dans Header):

```jsx
const logout = async () => {
  await supabaseClient.auth.signOut();
  // État nettoyé automatiquement
};
```

### ✅ Checklist avec Sauvegarde

**useChecklistAuth.js fournit:**

- `toggle(id)` - Cocher/décocher un item
- `reset()` - Réinitialiser tous les items
- `state` - État actuel du checklist
- `progress` - `{ checked, total, percentage }`
- `saveStatus` - Message de sauvegarde

**Utilisation:**

```jsx
import { useChecklistAuth } from "./useChecklistAuth";

function MyComponent() {
  const { state, toggle, progress } = useChecklistAuth();

  return (
    <div>
      <span>{progress.percentage}% complété</span>
      <button onClick={() => toggle("item-id")}>
        {state["item-id"] ? "✓" : "☐"} Task
      </button>
    </div>
  );
}
```

### 📊 Progression

- **LocalStorage:** Sauvegarde instantanée (refresh-safe)
- **Supabase:** Synchronisation en arrière-plan par user
- **Affichage:** `checked / total = percentage%`

### 💾 Sauvegarde (auto)

1. User coche un item → `toggle()` appelé
2. État mis à jour en état React
3. Sauvegarde locale immédiate
4. Sauvegarde Supabase en arrière-plan
5. Message "✓ Sauvegardé" pendant 3.5s

---

## 🚀 5. Démarrage

### Installation

```bash
npm install
# ou
pnpm install
```

### Développement

```bash
npm run dev
# ou
pnpm dev
```

### Build

```bash
npm run build
# ou
pnpm build
```

---

## 🔍 6. Architecture de Flux de Données

```
Login (GitHub OAuth)
    ↓
Auth State Change Listener
    ↓
Load Remote State (Supabase)
    ↓
App.jsx (User + State)
    ↓
Sidebar + MainContent
    ↓
User clicks checkbox
    ↓
toggle(id) → setState + saveRemote()
    ↓
localStorage (instant) + Supabase (async)
    ↓
Save Status Message
```

---

## 🧪 7. Tests / Debugging

### Console Logs

Cherchez les logs avec:

- `✅` = Succès
- `❌` = Erreur
- `🔄` = En cours
- `📊` = Données

### Vérifier la Sauvegarde Supabase

1. Supabase Dashboard → Table Editor
2. Cliquez sur `checklist_states`
3. Vérifiez que votre user_id a des données

### Vérifier le LocalStorage

```js
// Dans la console du navigateur
console.log(JSON.parse(localStorage.getItem("vsChecklist")));
```

---

## ⚠️ 8. Troubleshooting

### "OAuth error" au login GitHub

- Vérifiez que `VITE_OAUTH_REDIRECT_URL` correspond à votre domaine
- Vérifiez Client ID/Secret GitHub

### "PGRST116" error (non-critique)

- Signifie simplement "pas de données trouvées" → normal au premier login
- Crée automatiquement une nouvelle entrée

### Données ne se synchronisent pas

- Vérifiez que les tables existent (SQL ci-dessus)
- Vérifiez RLS policies (Row Level Security)
- Vérifiez les logs Supabase: Dashboard → Logs

### LocalStorage plein

- Vérifiez la taille du `state` object
- Limiter le nombre d'items si nécessaire

---

## 📚 9. API du Hook `useChecklistAuth`

```js
const {
  // État
  user, // User object ou null
  loading, // Boolean - chargement initial
  state, // Object - état du checklist

  // Fonctions
  setState, // setstate(newState)
  toggle, // toggle(itemId)
  reset, // reset()
  logout, // logout()

  // Status
  saveStatus, // String - message (ex: "Sauvegarde...")
  saveLoading, // Boolean - en cours de sauvegarde

  // Données
  progress: {
    checked, // Number - items cochés
    total, // Number - items totaux
    percentage, // Number - 0-100
  },
} = useChecklistAuth();
```

---

## 🎨 10. Customisation UI

L'UI est définie par CSS (voir App.jsx et ses imports).
Les classes principales:

- `.login-page` - Conteneur login
- `.login-card` - Carte login
- `.github-login-btn` - Bouton GitHub
- `.layout` - Layout principal
- `.progress-bar` - Barre de progression

Tous les styles sont à adapter dans vos CSS files.

---

## ✨ Prochaines Étapes

1. ✅ Copier `.env.example` → `.env.local`
2. ✅ Ajouter vos clés Supabase
3. ✅ Exécuter le SQL pour créer les tables
4. ✅ Configurer OAuth GitHub
5. ✅ Tester le login
6. ✅ Vérifier la sauvegarde Supabase

---

**Besoin d'aide?** Vérifiez les logs du navigateur (F12) et Supabase Dashboard → Logs
