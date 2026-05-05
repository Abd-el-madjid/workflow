# 🐛 Guide de Debugging

## 📊 Logging complet du hook

Le hook `useChecklistAuth` loggue tous les événements importants:

```
✅ Succès
❌ Erreur
🔄 En cours
📊 Données
🔗 Actions
```

---

## 🔍 1. Debugging du Login

### Les logs attendus

**Au premier chargement:**

```
✅ User loaded: user@github.com
✅ Loaded remote state: 45 items
```

**Lors du click sur "Se connecter avec GitHub":**

```
🔗 GitHub login redirect URL: http://localhost:5173
```

Puis redirection vers GitHub

**Après OAuth callback:**

```
Auth state changed: user-id-uuid
✅ User loaded: user@github.com
✅ Loaded remote state: X items  (ou "No saved checklist found")
```

### Les erreurs possibles

```javascript
// Si ClI GitHub est mauvais:
❌ GitHub login error: Invalid client ID

// Si callback URL est mauvaise:
❌ GitHub login error: Redirect URI mismatch

// Si Supabase URL est mauvaise:
❌ Init error: Invalid supabase URL
```

### Comment tester

```js
// Dans la console (F12)
// 1. Vérifier la session actuelle
const {
  data: { session },
} = await supabaseClient.auth.getSession();
console.log(session?.user);

// 2. Vérifier les clés d'env
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_OAUTH_REDIRECT_URL);

// 3. Vérifier le localStorage
console.log(JSON.parse(localStorage.getItem("vsChecklist")));
```

---

## 📝 2. Debugging de la Sauvegarde

### Les logs attendus au toggle

**Avant:**

```
État: { 'item-1': false }
```

**Après click:**

```
État mis à jour: { 'item-1': true }
Message: "Sauvegarde..." (100ms)
Message: "✓ Sauvegardé" (3500ms)
Message: "" (disparaît)
```

### Vérifier que saveRemote marche

```js
// Dans la console
const { data, error } = await supabaseClient
  .from("checklist_states")
  .select("state")
  .eq("user_id", "YOUR_USER_ID")
  .single();

console.log("Data:", data);
console.log("Error:", error);
```

### Vérifier localStorage

```js
// Doit avoir des données
const saved = JSON.parse(localStorage.getItem("vsChecklist"));
console.log("Saved in localStorage:", Object.keys(saved).length, "items");

// Vérifier si un item est coché
console.log("Item checked:", saved["item-1"]);
```

### Les erreurs possibles

```javascript
// Si Supabase est down:
❌ Save error: Network error

// Si RLS policy est mauvaise:
❌ Save error: new row violates row-level security policy

// Si la table n'existe pas:
❌ Save error: relation "checklist_states" does not exist
```

---

## 🔐 3. Debugging du Logout

### Les logs attendus

```
🔐 Logout called
✅ Logged out
État réinitialisé à vide {}
localStorage.vsChecklist supprimé
Redirection vers / (home)
```

### Vérifier que le logout fonctionne

```js
// Avant logout
const {
  data: { session },
} = await supabaseClient.auth.getSession();
console.log("User before:", session?.user?.id);

// Après logout
const { error } = await supabaseClient.auth.signOut();
console.log("Logout error:", error);

// Vérifier
const {
  data: { session: session2 },
} = await supabaseClient.auth.getSession();
console.log("User after:", session2?.user?.id); // doit être null
```

---

## 📊 4. Debugging de la Progression

### Calcul expected

```js
const state = {
  "item-1": true, // ✓
  "item-2": true, // ✓
  "item-3": false, // ☐
  "item-4": false, // ☐
};

checked = 2; // nombre de true
total = 4; // nombre total
percentage = 50; // 2/4 * 100
```

### Vérifier le calcul

```js
// Dans la console
const { progress, state } = useChecklistAuth();
const checked = Object.values(state).filter(Boolean).length;
const total = Object.keys(state).length;
const percentage = total ? Math.round((checked / total) * 100) : 0;

console.log({ checked, total, percentage });
console.log("Hook says:", progress); // doit être identique
```

---

## 🌐 5. Debugging de Supabase

### Vérifier la connexion

```js
// Tester la connexion Supabase
const { data, error } = await supabaseClient
  .from("checklist_states")
  .select("id")
  .limit(1);

if (error) {
  console.error("Supabase connection error:", error);
} else {
  console.log("✅ Supabase connected");
}
```

### Vérifier les RLS policies

```sql
-- Supabase SQL Editor
-- Vérifier les policies
SELECT * FROM pg_policies
WHERE tablename = 'checklist_states';

-- Vérifier les données
SELECT user_id, state FROM checklist_states LIMIT 5;
```

### Vérifier le table existe

```sql
-- Supabase SQL Editor
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
-- Doit inclure: checklist_states, user_letters
```

---

## 🔧 6. Debugging complet (script)

Copiez et collez dans la console F12:

```javascript
async function debugChecklistAuth() {
  console.log("🔍 === DEBUGGING CHECKLIST AUTH ===\n");

  // 1. Supabase config
  console.log("📦 SUPABASE CONFIG:");
  console.log("  URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log("  Key exists:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log("  Redirect URL:", import.meta.env.VITE_OAUTH_REDIRECT_URL);

  // 2. Current user
  console.log("\n👤 CURRENT USER:");
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  if (session?.user) {
    console.log("  ✅ User logged in:", session.user.email);
    console.log("  ID:", session.user.id);
  } else {
    console.log("  ❌ No user logged in");
  }

  // 3. localStorage
  console.log("\n💾 LOCALSTORAGE:");
  const saved = JSON.parse(localStorage.getItem("vsChecklist") || "{}");
  const checkedCount = Object.values(saved).filter(Boolean).length;
  console.log("  Items saved:", Object.keys(saved).length);
  console.log("  Items checked:", checkedCount);

  // 4. Supabase table
  if (session?.user) {
    console.log("\n🗄️ SUPABASE TABLE:");
    const { data, error } = await supabaseClient
      .from("checklist_states")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.log("  ℹ️ No data in Supabase yet (normal on first save)");
      } else {
        console.log("  ❌ Error:", error.message);
      }
    } else {
      const dbCheckedCount = Object.values(data.state || {}).filter(
        Boolean,
      ).length;
      console.log("  ✅ Data found in Supabase");
      console.log("  Items in DB:", Object.keys(data.state || {}).length);
      console.log("  Items checked in DB:", dbCheckedCount);
      console.log("  Last updated:", data.updated_at);
    }
  }

  console.log("\n✅ Debug complete");
}

// Exécuter
debugChecklistAuth();
```

---

## 🎯 7. Checklist de debugging

### Avant d'appeler l'aide:

- [ ] Vérifier les logs console (F12)
- [ ] Vérifier `.env.local` exists et a les bonnes clés
- [ ] Vérifier Supabase dashboard:
  - [ ] Tables existent (checklist_states, user_letters)
  - [ ] RLS policies sont activées
  - [ ] Données visibles
- [ ] Vérifier GitHub OAuth:
  - [ ] Client ID/Secret corrects
  - [ ] Callback URL correcte
- [ ] Vérifier localStorage: `JSON.parse(localStorage.getItem('vsChecklist'))`
- [ ] Tester avec incognito (pas de cache)
- [ ] Vérifier la version de navigateur

---

## 🆘 8. Messages d'erreur courants

### "Invalid client ID"

```
Cause: Client ID GitHub mauvais
Solution: Vérifier GitHub Settings → OAuth Apps → Client ID
```

### "Redirect URI mismatch"

```
Cause: Callback URL ne correspond pas
Solution: GitHub + Supabase doivent avoir même URL
```

### "relation ... does not exist"

```
Cause: Table n'existe pas
Solution: Exécuter le SQL pour créer les tables
```

### "new row violates row-level security"

```
Cause: RLS policy mauvaise
Solution: Vérifier que les policies GRANT les bonnes permissions
```

### "Network error"

```
Cause: Supabase URL mauvaise ou serveur down
Solution: Vérifier VITE_SUPABASE_URL dans .env.local
```

### "State is undefined"

```
Cause: useChecklistAuth pas appelé correctement
Solution: Doit être dans un composant React
```

---

## 🎬 9. Test scenario complet

### Scénario 1: Login → Toggle → Logout

```javascript
// 1. Login
// Click "Se connecter avec GitHub"
// Attendre redirection GitHub

// 2. Après OAuth callback
// Vérifier console:
console.log(await supabaseClient.auth.getSession());
// Doit voir user

// 3. Toggle un item
// Click une case
// Vérifier: "Sauvegarde..." → "✓ Sauvegardé"

// 4. Vérifier localStorage
JSON.parse(localStorage.getItem("vsChecklist"))["item-1"];
// Doit être true

// 5. Vérifier Supabase
const { data } = await supabaseClient
  .from("checklist_states")
  .select("*")
  .eq("user_id", "YOUR_USER_ID")
  .single();
console.log(data.state["item-1"]);
// Doit être true

// 6. Refresh page
// Case doit rester cochée

// 7. Logout
// Click Déconnexion
// Vérifier localStorage vidé
console.log(localStorage.getItem("vsChecklist"));
// Doit être null ou {}

// 8. Login again
// Case doit être toujours cochée (depuis Supabase)
```

---

## 📱 10. Debug par browser

### Google Chrome/Edge/Firefox

**Pour voir les logs:**

1. F12 pour ouvrir DevTools
2. Onglet Console
3. Chercher les messages avec ✅ ❌ 🔄 📊

**Pour voir localStorage:**

1. F12 → Application (Chrome) ou Storage (Firefox)
2. localStorage
3. Cliquer sur domaine
4. Voir `vsChecklist`

**Pour voir network:**

1. F12 → Network
2. Faire une action (toggle, logout)
3. Voir les appels à Supabase

---

## 🧪 11. Test de performance

```js
// Mesurer le temps de sauvegarde
const start = Date.now();
toggle("item-1");
const end = Date.now();
console.log(`Sauvegarde: ${end - start}ms`);

// Doit être < 100ms pour localStorage
// Peut être 100-1000ms pour Supabase (async)
```

---

## 📞 Support

Si vous n'avez pas trouvé l'erreur:

1. **Exécuter le script de debug** (section 6)
2. **Noter tous les ❌ errors**
3. **Chercher le message d'erreur** dans ce guide
4. **Consulter SETUP.md** pour configuration

---

**Happy debugging!** 🐛→🐛💨
