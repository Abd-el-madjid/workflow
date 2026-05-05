# ⚡ QUICKSTART — Démarrage en 5 minutes

## 1️⃣ Configuration Supabase (2 min)

### A. Créer un projet

- Allez sur [supabase.com](https://supabase.com)
- Créez un nouveau projet (gratuit)
- Attendez que les serveurs soient prêts

### B. Copier les clés

- Allez dans Settings → API
- Copiez: `Project URL` et `anon key`

### C. Créer `.env.local` à la racine

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_OAUTH_REDIRECT_URL=http://localhost:5173
```

---

## 2️⃣ GitHub OAuth (2 min)

### A. Sur GitHub

- Allez dans Settings → Developer settings → OAuth Apps
- New OAuth App
- **Application name:** Visa Checklist
- **Homepage URL:** `http://localhost:5173`
- **Callback URL:** `http://localhost:5173`
- Obtenez: `Client ID` et `Client Secret`

### B. Dans Supabase

- Authentication → Providers → GitHub
- Activez et collez Client ID + Secret

---

## 3️⃣ Créer les tables (1 min)

### Supabase Dashboard → SQL Editor

Exécutez ce script:

```sql
CREATE TABLE IF NOT EXISTS checklist_states (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  state JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE checklist_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own checklist" ON checklist_states
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own checklist" ON checklist_states
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own checklist" ON checklist_states
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

---

## 4️⃣ Démarrer l'app (1 min)

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173)

---

## ✅ Test rapide

### Vérifier que ça marche:

1. **Click "Se connecter avec GitHub"**
   - Vous êtes redirigé vers GitHub
   - GitHub vous redirige vers l'app
   - Vous êtes connecté ✓

2. **Cochez un item dans la checklist**
   - Voir "Sauvegarde..." pendant 100ms
   - Puis "✓ Sauvegardé"
   - La case reste cochée après refresh ✓

3. **Regarder console (F12)**
   - Chercher `✅ Logged in`
   - Chercher `✅ Saved in`

4. **Vérifier Supabase**
   - Dashboard → checklist_states
   - Doit voir une ligne avec vos données ✓

5. **Logout**
   - Click Déconnexion
   - Redirection vers login
   - Données supprimées du localStorage ✓

---

## 📂 Fichiers clés

| Fichier                             | Rôle                            |
| ----------------------------------- | ------------------------------- |
| `Login.jsx`                         | Composant login GitHub          |
| `useChecklistAuth.js`               | Hook logique (auth + checklist) |
| `App.jsx`                           | App principale (JSX)            |
| `src/app/App.tsx`                   | App principale (TypeScript)     |
| `src/app/hooks/useChecklistAuth.ts` | Hook TypeScript                 |

---

## 🔧 Modification rapide

### Si vous voulez changer le titre

**Login.jsx ligne 20:**

```jsx
<h1 className="login-title">Votre Titre</h1>
```

### Si vous voulez changer l'icône

**Login.jsx ligne 16:**

```jsx
<svg>...</svg> <!-- Remplacer le SVG -->
```

### Si vous voulez ajouter plus d'items

**data.js:**

```js
items: [
  { id: "new-item", title: "Mon nouvel item" },
  // ...
];
```

---

## 🆘 Problèmes courants

### "OAuth error"

- Vérifiez que Client ID/Secret GitHub sont corrects
- Vérifiez que `VITE_OAUTH_REDIRECT_URL` est correct

### Données ne se sauvegardent pas

- Ouvrez F12 → Console
- Cherchez `❌ error`
- Vérifiez les RLS policies dans Supabase

### Page blanche au login

- Vérifiez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- Cherchez erreurs dans Console (F12)

### Checklist disparaît après refresh

- Vérifiez localStorage: `localStorage.getItem('vsChecklist')`
- Vérifiez Supabase checklist_states table
- Vérifiez les logs Supabase

---

## 📚 Après le quickstart

- Lire [SETUP.md](SETUP.md) pour la config complète
- Voir [INTEGRATION_EXAMPLES.md](INTEGRATION_EXAMPLES.md) pour plus d'exemples
- Lire [DASHBOARD_INTEGRATION.md](DASHBOARD_INTEGRATION.md) pour intégrer DashboardLayout

---

## 🎯 Résumé

| Étape          | Temps      | Fichier           |
| -------------- | ---------- | ----------------- |
| Supabase setup | 2 min      | `.env.local`      |
| GitHub OAuth   | 2 min      | GitHub + Supabase |
| SQL tables     | 1 min      | Supabase SQL      |
| **Total**      | **~5 min** | ✅ Prêt!          |

---

**C'est tout!** 🚀

Vous avez maintenant:

- ✅ Login avec GitHub OAuth
- ✅ Checklist avec progression
- ✅ Sauvegarde Supabase + localStorage
- ✅ Logout avec nettoyage

Commencez à utiliser, puis customisez selon vos besoins!
