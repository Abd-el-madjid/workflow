# 🎓 Visa Étudiant France — Checklist Interactive

Checklist interactive complète pour la demande de **visa long séjour étudiant** vers la France depuis l'Algérie.

**Contexte :** M2 Systèmes Logiciels — Université Marie et Louis Pasteur, Besançon  
**RDV CAPAGO :** 8 juin 2025

## ✨ Fonctionnalités

- ✅ Cases à cocher interactives avec barre de progression
- 📂 12 sections accordéon dépliables
- 📌 Instructions détaillées "Comment obtenir" pour chaque document
- 🔗 Liens directs vers les plateformes officielles
- 📱 Responsive (mobile + desktop)
- 💾 Fichier HTML autonome — aucune dépendance

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

## 🚀 Utilisation

### En local

1. Copier `.env.example` en `.env`
2. Ajouter vos valeurs Supabase dans `.env`
3. Installer les dépendances : `npm install`
4. Lancer le projet : `npm run dev`

### En production

- Ne pas committer `.env` dans le dépôt
- Configurer `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans votre plateforme de déploiement
- Utiliser HTTPS pour le site et pour les callbacks OAuth

### Déploiement recommandé

- Vite build : `npm run build`
- Servir le dossier `dist/`

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
