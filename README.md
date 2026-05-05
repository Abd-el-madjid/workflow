# 🎓 Visa Étudiant France — Checklist Interactive + Authentication

Système complet de gestion de checklist pour la demande de **visa long séjour étudiant** vers la France depuis l'Algérie, avec **authentification GitHub**, **sauvegarde Supabase**, et **progression en temps réel**.

**Contexte :** M2 Systèmes Logiciels — Université Marie et Louis Pasteur, Besançon  
**RDV CAPAGO :** 8 juin 2025

## ✨ Fonctionnalités principales

### 🔐 Authentification

- ✅ Login GitHub OAuth (sécurisé)
- ✅ Logout avec nettoyage complet
- ✅ Gestion de session
- ✅ Multi-device support

### ✅ Checklist

- ✅ Cases à cocher interactives avec barre de progression
- 📊 Progression en temps réel (0-100%)
- 📂 12 sections accordéon dépliables
- 📌 Instructions détaillées "Comment obtenir" pour chaque document
- 🔗 Liens directs vers les plateformes officielles

### 💾 Sauvegarde

- ✅ localStorage (sauvegarde instantanée)
- ✅ Supabase (synchronisation cloud)
- ✅ Fonctionne hors-ligne
- ✅ Multi-device sync

### 📝 Gestion des Lettres

- **Édition en temps réel** avec aperçu instantané
- **Templates intégrés** pour démarrer rapidement
- **Upload de fichiers** : PDF, DOC, DOCX avec aperçu intégré
- **Historique des versions** : Sauvegarde automatique + restauration
- **Section Documents** : Visualisation claire des fichiers attachés

### 📱 Design

- 📱 Responsive (mobile + desktop)
- 💾 Fichier HTML autonome — aucune dépendance (version originale)
- ⚡ Performance optimisée

## � Démarrage Rapide (5 min)

### 1. Configuration Supabase

```bash
# Créer .env.local à la racine
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OAUTH_REDIRECT_URL=http://localhost:5173
```

### 2. Configurer GitHub OAuth

- Créer un projet sur [supabase.com](https://supabase.com)
- Activer GitHub OAuth (Client ID + Secret)
- Exécuter le SQL fourni dans `SETUP.md`

### 3. Démarrer l'app

```bash
npm install
npm run dev
```

📖 **Besoin de détails?** Lire [QUICKSTART.md](QUICKSTART.md) (5 min) ou [SETUP.md](SETUP.md) (complet)

## 📚 Documentation

| Document                                                 | Contenu               | Lire si...        |
| -------------------------------------------------------- | --------------------- | ----------------- |
| **[QUICKSTART.md](QUICKSTART.md)**                       | ⚡ 5 min setup        | Pressé            |
| **[SETUP.md](SETUP.md)**                                 | 📖 Config complète    | Veux détails      |
| **[DEBUGGING.md](DEBUGGING.md)**                         | 🐛 Guide debugging    | Y a une erreur    |
| **[INTEGRATION_EXAMPLES.md](INTEGRATION_EXAMPLES.md)**   | 💻 12 exemples        | Veux des exemples |
| **[DASHBOARD_INTEGRATION.md](DASHBOARD_INTEGRATION.md)** | 🎯 Intégrer Dashboard | Dois intégrer     |
| **[INDEX.md](INDEX.md)**                                 | 📍 Navigation         | Besoin d'aide     |
| **[DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md)**           | 📦 Ce qui a été livré | Vue d'ensemble    |

## 📋 Sections couvertes

| #   | Section                             | Documents                                                                |
| --- | ----------------------------------- | ------------------------------------------------------------------------ |
| 1   | Campus France                       | Message fin de procédure, attestation admission, formulaire France-Visas |
| 2   | Diplômes & Authentification         | Diplômes, bac, relevés de notes, chaîne d'authentification               |
| 3   | Identité & Documents civils         | Passeport, photos, acte de naissance, fiche familiale, casier judiciaire |
| 4   | Ressources financières              | Attestation emploi, bulletins salaire, relevés CCP, CV                   |
| 5   | Garant France (belle-sœur Paris)    | PEC, bulletins, relevés, justif. domicile, lien de parenté               |
| 6   | Garant Algérie (parent retraité)    | Attestation PEC, pension CNAS, relevés CCP                               |
| 7   | Casier judiciaire & Assurance santé | Bulletin n°3, assurance médicale                                         |
| 8   | Hébergement                         | Hôtel Agoda, lettre explicative logement                                 |
| 9   | CROUS Besançon                      | Guide complet : DSE, vœux, phase complémentaire 7 juillet                |
| 10  | Lettre explicative                  | Plan paragraphe par paragraphe                                           |
| 11  | Après visa — Arrivée France         | CVEC, VLS-TS, CPAM, carte de séjour, CAF, compte bancaire                |
| 12  | RDV CAPAGO — Jour J                 | Convocation, frais, biométrie, organisation dossier                      |

## 💻 Utilisation du Hook

```jsx
import { useChecklistAuth } from "./useChecklistAuth";

function MyComponent() {
  const { state, toggle, progress, logout } = useChecklistAuth();

  return (
    <div>
      <p>{progress.percentage}% complété</p>
      <input
        type="checkbox"
        checked={state["item-1"] || false}
        onChange={() => toggle("item-1")}
      />
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

## 📝 Gestion des Lettres

### Fonctionnalités avancées :

- **Édition en temps réel** avec aperçu instantané
- **Templates intégrés** pour démarrer rapidement
- **Upload de fichiers** : PDF, DOC, DOCX avec aperçu intégré
- **Historique des versions** : Sauvegarde automatique + restauration
- **Section Documents** : Visualisation claire des fichiers attachés
- **Section Historique** : Liste des versions avec dates et possibilité de restaurer

### Organisation de l'interface :

Quand vous sélectionnez une lettre dans la barre latérale :

1. **Zone d'édition** : Titre et contenu modifiable
2. **Section Document** : Fichier attaché avec lien d'ouverture et aperçu PDF
3. **Section Historique** : Liste des versions précédentes avec boutons de restauration

4. **Zone d'édition** : Titre et contenu modifiable
5. **Section Document** : Fichier attaché avec lien d'ouverture et aperçu PDF
6. **Section Historique** : Liste des versions précédentes avec boutons de restauration

## 🚀 Utilisation

### En local

1. Copier `.env.example` en `.env`
2. Ajouter vos valeurs Supabase dans `.env`
3. Installer les dépendances : `npm install`
4. Lancer le projet : `npm run dev`

### Variables d'environnement

Copiez `.env.example` vers `.env` et configurez :

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key

# OAuth Configuration
VITE_OAUTH_REDIRECT_URL=https://your-domain.vercel.app

# File Upload Configuration
VITE_SIGNED_URL_EXPIRY=3600          # Signed URL expiry in seconds (default: 3600 = 1 hour)
VITE_MAX_FILE_SIZE_MB=10              # Maximum file size in MB (default: 10)

# UI Configuration
VITE_MODAL_TIMEOUT_MS=3000            # Modal display duration in ms (default: 3000)
VITE_SAVE_STATUS_TIMEOUT_MS=3500      # Save status message duration in ms (default: 3500)
```

### Sécurité en production

L'application inclut plusieurs mesures de sécurité :

- **CSP (Content Security Policy)** : Empêche l'exécution de scripts non autorisés et les attaques XSS
- **X-Frame-Options: DENY** : Empêche l'intégration dans des iframes (résout les erreurs localhost:3000)
- **X-Content-Type-Options: nosniff** : Empêche le sniffing de type MIME
- **Referrer-Policy** : Contrôle les informations de référent envoyées
- **Permissions-Policy** : Désactive l'accès à la caméra, micro et géolocalisation
- **Toutes les valeurs sensibles** : Stockées dans des variables d'environnement

### En production

- Ne pas committer `.env` dans le dépôt
- Configurer `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans votre plateforme de déploiement
- Utiliser HTTPS pour le site et pour les callbacks OAuth

### Déploiement sur Vercel

1. **Variables d'environnement dans Vercel :**
   - `VITE_SUPABASE_URL` : Votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` : Votre clé publique Supabase
   - `VITE_OAUTH_REDIRECT_URL` : `https://votre-domaine.vercel.app`
   - `VITE_SIGNED_URL_EXPIRY` : `3600` (1 heure pour les URLs signées)
   - `VITE_MAX_FILE_SIZE_MB` : `10` (taille max des fichiers)
   - `VITE_MODAL_TIMEOUT_MS` : `3000` (durée d'affichage des modales)
   - `VITE_SAVE_STATUS_TIMEOUT_MS` : `3500` (durée des messages de statut)

2. **Configuration GitHub OAuth :**
   - Aller dans votre [GitHub App Settings](https://github.com/settings/apps)
   - Dans "Authorization callback URL", ajouter : `https://votre-domaine.vercel.app`
   - Pour le développement local, ajouter l'URL de votre serveur dev (généralement `http://localhost:5173` ou similaire)

3. **Configuration Supabase :**
   - Dans votre dashboard Supabase → Authentication → Providers
   - Activer GitHub provider
   - Ajouter vos credentials GitHub App (Client ID et Secret)
   - Dans "Redirect URLs", ajouter : `https://votre-domaine.vercel.app`

### Déploiement recommandé

- Vite build : `npm run build`
- Servir le dossier `dist/`
- Ou utiliser Vercel pour un déploiement automatique depuis GitHub

## 📌 Notes importantes

- **MAE Constantine** : NON obligatoire pour le visa France (exemption art. 36, accord franco-algérien 1962)
- **CROUS** : phase complémentaire accessible à TOUS les étudiants à partir du **7 juillet 2025**
- **Garant** : un seul garant (France ou Algérie) suffit officiellement — deux garants recommandés dans ce cas
- **Ressources min.** : 615€/mois à démontrer

## 🔗 Liens utiles

- [France-Visas](https://france-visas.gouv.fr) — formulaire visa officiel
- [CAPAGO Algérie](https://fr-dz.capago.eu) — prise de RDV visa
- [Campus France Algérie](https://www.algerie.campusfrance.org)
- [Trouver un logement CROUS](https://trouverunlogement.lescrous.fr)
- [MesServices Étudiant](https://messervices.etudiant.gouv.fr) — DSE, logement, CROUS
- [Casier judiciaire Algérie](https://www.mjustice.dz) — bulletin n°3 en ligne
- [Validation VLS-TS](https://administration-etrangers-en-france.interieur.gouv.fr)
- [CAF — APL](https://www.caf.fr)

## ⚖️ Licence

Usage personnel. Les informations sont fournies à titre indicatif — se référer aux sources officielles pour toute décision administrative.
