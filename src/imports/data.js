export const BEFORE_SECS = [
  {
    id: "terms",
    ico: "📖",
    bg: "#fffbeb",
    nm: "Définitions essentielles — Lire en premier",
    badge: { t: "Lire d'abord", c: "b-amb" },
    note: {
      t: "Ces termes sont souvent confondus. Les comprendre évite des erreurs graves dans la préparation du dossier.",
      c: "n-blu",
    },
    expls: [
      {
        t: "Bulletin de salaire vs Relevé de compte vs Avis d'imposition",
        b: `<b>Bulletin de salaire (fiche de paie) :</b> Document mensuel émis par ton <em>employeur</em>. Montre ton salaire brut, net, les cotisations. Prouve que tu travailles et combien tu gagnes.<br><br>
<b>Relevé de compte (extrait bancaire) :</b> Document mensuel émis par ta <em>banque</em> (ou Algérie Poste pour le CCP). Montre les mouvements réels d'argent — virements reçus, dépenses. Les deux doivent être cohérents : le salaire du bulletin doit correspondre au virement visible sur le relevé.<br><br>
<b>Avis d'imposition :</b> Document annuel émis par l'administration <em>fiscale française</em> (impots.gouv.fr). Récapitule les revenus déclarés l'année précédente. Requis pour le garant France (belle-sœur). En Algérie, cela n'existe pas de la même façon — remplacé par l'attestation de pension CNAS/CNR pour les retraités.`,
      },
      {
        t: "Copie certifiée conforme — comment l'obtenir en Algérie",
        b: `<b>C'est quoi :</b> Une photocopie d'un document original sur laquelle un agent officiel appose un cachet + signature pour certifier que "la copie est conforme à l'original". Elle a valeur légale.<br><br>
<b>OÙ LA FAIRE :</b><br>
→ <b>APC (mairie) de ta commune :</b> service "légalisation". Tu apportes l'original + une photocopie claire. L'agent compare, appose tampon + signature. Coût : gratuit ou timbre de 20–50 DA.<br>
→ <b>L'université émettrice (pour les diplômes) :</b> encore mieux. La copie certifiée par l'établissement qui a délivré le document a plus de poids. Demander au bureau du doyen (cachet université + signature).<br><br>
<b>IMPORTANT :</b> Le MAE (Ministère des Affaires Étrangères) n'est PAS requis pour les documents destinés à la France. La certification APC ou université suffit pour le consulat.`,
      },
      {
        t: "Traduction assermentée — qui la fait, pas la mairie",
        b: `<b>C'est quoi :</b> Une traduction réalisée par un traducteur officiel agréé par un tribunal. Elle a valeur légale. La traduction Google ou par un ami ne suffit PAS.<br><br>
<b>LA MAIRIE NE TRADUIT PAS :</b> L'APC certifie les copies. Elle ne traduit pas. Ce sont deux choses distinctes.<br><br>
<b>OÙ TROUVER UN TRADUCTEUR ASSERMENTÉ :</b><br>
→ Barreau des avocats de ta wilaya → liste des experts judiciaires agréés<br>
→ Centres de traduction agréés à Constantine, M'Sila, Alger<br>
→ Annuaires en ligne : chercher "traducteur assermenté arabe-français Algérie"<br><br>
<b>Prix :</b> 1 000 – 3 000 DA par document selon la longueur.<br>
<b>Délai :</b> 24h à 5 jours.<br>
<b>Documents à traduire si en arabe :</b> acte de naissance, relevés de notes, casier judiciaire.`,
      },
      {
        t: "L'ancrage en Algérie — pourquoi c'est crucial pour ton visa",
        b: `<b>C'est quoi :</b> L'"ancrage" (ou "lien d'attache") désigne l'ensemble des éléments qui prouvent que tu as de solides raisons de <em>revenir en Algérie</em> à l'issue de tes études. C'est l'un des critères les plus importants — le consulat évalue le "risque de non-retour".<br><br>
<b>Ce qui constitue ton ancrage :</b><br>
→ Famille présente en Algérie (père, famille proche)<br>
→ Emploi actuel en Algérie (même récent = tu as un poste qui t'attend)<br>
→ Résidence, liens sociaux, patrimoine<br>
→ Projet professionnel post-M2 en Algérie<br><br>
<b>→ Même si ton salaire ne prouve pas tes finances</b>, l'attestation de travail reste capitale : elle dit implicitement "j'ai un emploi qui m'attend, j'ai une raison concrète de rentrer".<br><br>
<b>Ta lettre explicative doit valoriser ton ancrage</b> : mentionner tes attaches familiales, ton emploi actuel, et ton projet professionnel en Algérie après le M2.`,
      },
    ],
    items: [],
  },

  {
    id: "cf",
    ico: "🎓",
    bg: "#eff6ff",
    nm: "Campus France — Documents officiels",
    badge: { t: "Obligatoire", c: "b-red" },
    note: {
      t: "<strong>Après ton RDV de vérification mercredi</strong>, le message de fin de procédure est généré automatiquement par Campus France et envoyé par email dans les heures/jours suivants. SANS ce message, ton dossier visa est incomplet.",
      c: "n-blu",
    },
    chain: true,
    items: [
      {
        id: "cf1",
        t: "Message de fin de procédure Campus France",
        d: "Email automatique Campus France après validation de l'authentification. C'est le sésame du visa. À imprimer en 2 exemplaires.",
        s: `<b>1. Attendu après mercredi</b> (RDV vérification diplômes).<br><b>2. Vérifier</b> sur ton compte <a href="https://etudes-en-france.fr" target="_blank">etudes-en-france.fr</a> → "Mon dossier" → télécharger l'attestation.<br><b>3. Imprimer</b> en 2 exemplaires propres. Mettre en première position dans le classeur.`,
        g: ["req", "Après mercredi"],
      },
      {
        id: "cf2",
        t: "Attestation de préinscription / admission M2",
        d: "Document officiel de l'Université Marie et Louis Pasteur confirmant ton inscription au M2 Systèmes Logiciels.",
        s: `<b>Où :</b> compte etudes-en-france.fr → espace établissement → télécharger attestation.<br><b>Si pas disponible :</b> email à la scolarité → scolarite-sciences[at]univ-fcomte.fr avec ton nom et numéro de dossier.<br><b>Imprimer</b> en 2 exemplaires.`,
        g: ["req"],
      },
      {
        id: "cf3",
        t: "Formulaire France-Visas — rempli, imprimé, signé ×2",
        d: "Formulaire officiel de demande de visa long séjour. DOIT être signé à la main avec stylo noir.",
        s: `<b>1. Aller sur :</b> <a href="https://france-visas.gouv.fr" target="_blank">france-visas.gouv.fr</a><br><b>2. Naviguer :</b> "J'ai besoin d'un visa" → Long séjour → Étudiant → Algérie<br><b>3. Remplir</b> toutes les rubriques en FRANÇAIS. Adresse hébergement = adresse hôtel Besançon.<br><b>4. Imprimer</b> en 2 exemplaires.<br><b>5. Signer</b> à la main — PAS de signature numérique.`,
        g: ["req"],
      },
    ],
  },

  {
    id: "dip",
    ico: "📜",
    bg: "#fffbeb",
    nm: "Diplômes & Relevés de notes",
    badge: { t: "Récupérer dimanche", c: "b-amb" },
    note: {
      t: "<b>Diplôme définitif :</b> tu l'as. Campus France a authentifié ton diplôme original. Tu le récupères dimanche. Le provisoire est pour ceux qui n'ont pas encore le définitif — pas ton cas. <b>MAE Constantine : NON obligatoire</b> pour le visa France (exemption art. 36, protocole franco-algérien 1962).",
      c: "n-grn",
    },
    chain: true,
    items: [
      {
        id: "dip1",
        t: "Diplôme universitaire original — récupérer dimanche + copies certifiées",
        d: "Campus France a authentifié ton diplôme original. À récupérer ce dimanche.",
        s: `<b>Dimanche :</b> Récupérer l'original physique.<br><b>Ensuite immédiatement :</b> Faire 3 copies certifiées conformes. <b>Où ?</b> Directement au bureau du doyen de ton université → apporter original + 3 feuilles photocopiées → demander "certification conforme à l'original" avec cachet université + signature. C'est plus fort que l'APC pour un diplôme.<br><b>Stocker :</b> original dans une pochette plastique rigide. Copies dans le classeur.`,
        g: ["req", "Dimanche"],
      },
      {
        id: "dip2",
        t: "Bac original — déjà récupéré ✓",
        d: "Valide et en ta possession. À conserver précieusement.",
        s: `<b>Action :</b> photocopier 3 fois. Porter les copies + l'original à l'APC (mairie de ta commune) → service légalisation → tampon + signature "copie conforme à l'original". Timbre 20–50 DA. Gratuit dans certaines APC.<br><b>Ne jamais donner l'original seul</b> — toujours garder en ta possession.`,
        g: ["don"],
      },
      {
        id: "dip3",
        t: "Relevés de notes — toutes les années universitaires",
        d: "De la L1 (1ère année) jusqu'au dernier diplôme. Chaque année doit figurer.",
        s: `<b>Où obtenir :</b> Service de scolarité de ton université → demander "relevés de notes officiels" pour chaque année académique.<br><b>Si en arabe :</b> traduction assermentée arabe→français (voir Section Définitions).<br><b>Copies :</b> certifier à l'université (cachet + signature responsable scolarité) — 1 originale certifiée + 1 copie par document.`,
        g: ["req"],
      },
      {
        id: "dip4",
        t: "MAE Constantine — optionnel / après visa seulement",
        d: "PAS obligatoire pour le visa France. Utile si l'université de Besançon l'exige à l'inscription physique.",
        s: `<b>Pour le visa :</b> exemption franco-algérienne (art. 36, accord 1962) → tu n'en as PAS besoin.<br><b>Si l'université le demande à l'inscription :</b> annexe régionale MAE à Constantine, ou par courrier via service T@SDIK (bureaux de poste de chef-lieu de daïra). Timbre fiscal 20 DA par document.`,
        g: ["opt", "Après visa"],
      },
    ],
  },

  {
    id: "civ",
    ico: "🪪",
    bg: "#f0fdf4",
    nm: "Identité & Documents civils",
    badge: { t: "À préparer", c: "b-amb" },
    items: [
      {
        id: "civ1",
        t: "Passeport en cours de validité — original + 2 jeux de photocopies",
        d: "Validité min. = date fin de séjour prévu + 3 mois. Doit avoir ≥ 2 pages vierges.",
        s: `<b>Photocopier TOUTES les pages non vierges :</b> page photo/bio, page validité, TOUTES les pages avec tampons, cachets ou visas.<br><b>Faire 2 jeux complets</b> de copies — CAPAGO garde les copies, te rend les originaux.`,
        g: ["req"],
      },
      {
        id: "civ2",
        t: "2 photos d'identité aux normes OACI",
        d: "35×45 mm, fond blanc strict, visage centré, expression neutre, yeux ouverts, moins de 3 mois.",
        s: `<b>Où :</b> studio photo professionnel à Constantine. Demander explicitement "photos OACI pour visa France".<br><b>Éviter :</b> selfie, fond coloré, lunettes, cheveux cachant le visage.`,
        g: ["req"],
      },
      {
        id: "civ3",
        t: "Acte de naissance avec filiation — original + traduction si arabe",
        d: "Extrait mentionnant tes prénom/nom, date/lieu de naissance, ET les prénoms/noms de tes deux parents.",
        s: `<b>Où obtenir :</b> bureau d'état civil de l'APC de ta commune de NAISSANCE (pas de résidence).<br><b>Demander :</b> "extrait d'acte de naissance avec filiation" — pour une démarche à l'étranger.<br><b>Si en arabe :</b> traducteur assermenté arabe→français (pas la mairie !). Délai 1–3 jours.<br><b>Copies :</b> certifier 2 copies à l'APC.`,
        g: ["req"],
      },
      {
        id: "civ4",
        t: "Fiche familiale d'état civil",
        d: "Document regroupant tous les membres de la famille. Clé pour prouver le lien fraternel avec ton frère → belle-sœur.",
        s: `<b>Où obtenir :</b> APC de ton domicile familial → service état civil → présenter le livret de famille ou les actes de naissance des parents. Gratuit. Délivré immédiatement ou sous 24–48h.`,
        g: ["req"],
      },
      {
        id: "civ5",
        t: "Casier judiciaire Bulletin n°3 — extrait vierge",
        d: "Atteste l'absence de condamnation pénale. Requis pour tout visa long séjour.",
        s: `<b>OPTION 1 — En ligne (recommandé, GRATUIT) :</b><br>1. Aller sur <a href="https://www.mjustice.dz" target="_blank">mjustice.dz</a> → Services en ligne → Bulletin n°3<br>2. Remplir le formulaire avec tes données<br>3. Choisir le tribunal de retrait (1ère instance de ta wilaya)<br>4. Soumettre → recevoir numéro de suivi<br>5. Se présenter 24–72h plus tard au tribunal avec CNI + numéro → récupérer le bulletin physique<br><br><b>OPTION 2 — En personne :</b> directement au tribunal. CNI + extrait de naissance + timbre fiscal 30 DA.<br><br><b>Si en arabe :</b> traducteur assermenté → français.`,
        g: ["req"],
      },
    ],
  },

  {
    id: "fin",
    ico: "💰",
    bg: "#faf5ff",
    nm: "Ressources financières personnelles — Stratégie",
    badge: { t: "Emploi récent", c: "b-amb" },
    note: {
      t: `<b>Rôle exact de ton emploi dans le dossier :</b><br><br>
✅ <b>Ce que ton emploi PROUVE :</b> ancrage en Algérie, stabilité professionnelle, cohérence de parcours — tu as un poste qui t'attend donc tu as une raison de revenir.<br>
❌ <b>Ce que ton emploi ne prouve PAS :</b> la capacité financière pour le séjour — 2 mois de salaire ne constituent pas une garantie suffisante pour le consulat.<br><br>
→ <b>Stratégie :</b> présente tes bulletins + relevés CCP comme <em>éléments de situation et d'ancrage</em>, pas comme preuve financière principale. La preuve financière principale = belle-sœur (garant France). La lettre explicative précise que l'emploi est récent et que l'ancrage est solide.`,
      c: "n-amb",
    },
    items: [
      {
        id: "fin1",
        t: "Attestation de travail — demandée à ton employeur",
        d: "Lettre officielle sur papier en-tête confirmant ta situation professionnelle actuelle.",
        s: `<b>Quoi demander :</b> attestation mentionnant ton nom complet, intitulé du poste, date de prise de fonction, salaire mensuel brut + signature du responsable RH ou directeur + cachet.<br><b>Délai :</b> demander AUJOURD'HUI. La plupart des employeurs fournissent ça en 24–48h.`,
        g: ["req"],
      },
      {
        id: "fin2",
        t: "Bulletins de salaire (1–2 mois disponibles)",
        d: "Présenter TOUS tes bulletins existants, même si c'est 1 ou 2 mois seulement.",
        s: `<b>Tes bulletins papier :</b> photocopier + garder les originaux.<br><b>Important :</b> le salaire sur le bulletin doit correspondre aux virements visibles sur ton relevé CCP — les deux documents doivent être cohérents.<br><b>Rôle dans le dossier :</b> montrer ton ancrage et ta situation actuelle. La lettre explicative précise la durée courte (emploi débuté récemment).`,
        g: ["req"],
      },
      {
        id: "fin3",
        t: "Relevés de compte CCP — tous mois disponibles",
        d: "Tes relevés du compte courant postal. Même 1–2 mois sont utiles.",
        s: `<b>OPTION 1 — En agence Algérie Poste :</b> Se présenter au bureau de poste où ton CCP est domicilié → demander "relevé de compte mensuel imprimé".<br><b>OPTION 2 — Application BaridiMob / BaridiWeb :</b> <a href="https://www.baridibank.dz" target="_blank">baridibank.dz</a> → connexion → historique transactions → exporter/imprimer en PDF.<br><b>Ce qui doit apparaître :</b> ton nom, numéro CCP, les virements de salaire entrants.`,
        g: ["req"],
      },
      {
        id: "fin4",
        t: "CV complet — obligatoire pour reprise d'études",
        d: "Exigé réglementairement quand on reprend des études après avoir travaillé. Doit expliquer toute la chronologie.",
        s: `<b>Format :</b> A4, 1–2 pages, en FRANÇAIS. Chronologique inversé (plus récent en premier).<br><b>Période entre diplôme et emploi actuel :</b> indiquer clairement "2022–2024 : Recherche scientifique indépendante — rédaction et publication de 2 articles scientifiques + développement du business plan d'une startup issue du projet de fin d'études".<br><b>Ne pas laisser de trou non expliqué.</b> Cette période doit être valorisée, pas cachée.`,
        g: ["req"],
      },
    ],
  },

  {
    id: "agb",
    ico: "🏦",
    bg: "#ecfdf5",
    nm: "Compte bancaire AGB — Ouvrir avant le 8 juin",
    badge: { t: "Recommandé", c: "b-grn" },
    note: {
      t: `<b>Pourquoi ouvrir un compte AGB ?</b><br>
① Relevés AGB = preuve financière supplémentaire (format banque commerciale, plus percutant que CCP seul).<br>
② Carte Visa/Mastercard AGB = <b>assurance voyage GRATUITE</b> incluse (accident en voyage, bagages, annulation).<br>
③ Même avec 1–2 mois, un relevé montrant ton salaire entrant renforce ta section finances.<br><br>
⚠️ <b>AGB ≠ assurance santé pour le visa.</b> L'assurance voyage AGB couvre l'accident en voyage. L'assurance santé visa (soins médicaux quotidiens en France) reste obligatoire séparément.<br>
Source : <a href="https://www.agb.dz" target="_blank">agb.dz</a> — conditions confirmées 2025.`,
      c: "n-blu",
    },
    expls: [
      {
        t: "Documents pour ouvrir un compte AGB particulier à Constantine (source : agb.dz, 2025)",
        b: `<b>Se présenter à l'agence AGB la plus proche à Constantine — pas de RDV nécessaire.</b><br>L'ouverture se fait en 1 seule visite si tous les documents sont présents.<br><br>
<b>1. Pièce d'identité officielle :</b> La liste officielle AGB mentionne CNI ou permis de conduire. <b>Le passeport est généralement accepté</b> comme alternative — mais les pratiques varient selon les agences.<br>
→ <b>⚠️ Appeler l'agence AGB Constantine avant de te déplacer</b> pour confirmer : "Acceptez-vous le passeport pour l'ouverture d'un compte ?" Trouver l'agence sur <a href="https://www.agb.dz" target="_blank">agb.dz</a>.<br><br>
<b>2. Justificatif de domicile (moins de 3 mois) :</b> Certificat de résidence APC <em>OU</em> facture téléphone/eau/électricité à ton nom.<br>
<b>3. Attestation de travail :</b> La même lettre demandée pour le visa — pas besoin d'en faire deux.<br>
<b>4. Dernier bulletin de salaire :</b> 1 ou 2 mois sont acceptés.<br>
<b>5. Numéro de téléphone :</b> Pour SMS Banking et AGB Online.<br><br>
<b>Dépôt minimum :</b> Prévoir 5 000–20 000 DA selon l'agence.<br>
<b>Frais tenue de compte :</b> 750 DA/trimestre.<br>
<b>À demander absolument :</b> carte Visa Classic ou Gold → assurance voyage incluse gratuite.`,
      },
    ],
    items: [
      {
        id: "agb1",
        t: "CNI ou Passeport — original + photocopie",
        d: "La liste officielle AGB mentionne CNI/permis. Le passeport est généralement accepté — confirmer avec l'agence avant.",
        s: `<b>Si CNI :</b> original + copie recto-verso.<br><b>Si passeport :</b> original + copie page bio + copie page validité.<br><b>⚠️ Action préalable :</b> appeler l'agence AGB Constantine pour confirmer qu'ils acceptent le passeport → numéro sur agb.dz.`,
        g: ["req"],
      },
      {
        id: "agb2",
        t: "Certificat de résidence (moins de 3 mois)",
        d: "Justificatif de domicile officiel.",
        s: `<b>Obtenir à l'APC de ta commune :</b> présenter CNI → service état civil → demander "certificat de résidence" → délivré immédiatement. Gratuit ou timbre ~50 DA.<br><b>Alternative :</b> facture téléphone, eau ou électricité récente à ton nom.`,
        g: ["req"],
      },
      {
        id: "agb3",
        t: "Attestation de travail",
        d: "Le même document que pour le visa. Pas besoin d'en faire deux.",
        s: `Utilise exactement la même attestation demandée à ton employeur pour le dossier visa. Document identique, pas de duplication.`,
        g: ["req"],
      },
      {
        id: "agb4",
        t: "Dernier(s) bulletin(s) de salaire",
        d: "1 ou 2 mois suffisent pour l'ouverture du compte.",
        s: `Présenter les bulletins papier + 1 copie chacun. L'agent valide même avec un historique court.`,
        g: ["req"],
      },
      {
        id: "agb5",
        t: "Demander une carte Visa Classic ou Gold",
        d: "Pour l'assurance voyage incluse gratuitement.",
        s: `<b>À l'ouverture, préciser :</b> "Je veux une carte Visa Classic" ou "Visa Gold" — pas juste une CIB locale.<br><b>Assurance voyage incluse couvre :</b> accidents en voyage, décès/invalidité, bagages perdus, annulation de vol.<br><b>Délai d'activation de la carte :</b> 1–3 semaines après ouverture du compte.`,
        g: ["opt"],
      },
    ],
  },

  {
    id: "assur",
    ico: "🏥",
    bg: "#fdf4ff",
    nm: "Assurance santé — obligatoire pour le visa",
    badge: { t: "Souvent oublié ⚠", c: "b-red" },
    note: {
      t: "<b>AGB ≠ assurance santé pour visa.</b> L'assurance voyage AGB (avec carte Visa/Mastercard) couvre : accidents en voyage, bagages, annulation de vol. L'assurance santé visa couvre : soins médicaux quotidiens, consultations, médicaments, hospitalisation. Il te faut les DEUX — l'AGB pour le voyage, une assurance santé séparée pour le visa.",
      c: "n-red",
    },
    items: [
      {
        id: "as1",
        t: "Assurance santé / expatrié pour visa long séjour",
        d: "Couvre soins médicaux + hospitalisation + rapatriement sanitaire. Minimum 30 000€ de garanties.",
        s: `<b>Options en Algérie :</b><br>→ SAA (Société Algérienne d'Assurances) : formule "étudiant à l'étranger"<br>→ CAAR, Alliance Assurances, CASH : pareil<br><br><b>Options en ligne (recommandées) :</b><br>→ <a href="https://www.mondassur.com" target="_blank">Mondassur.com</a> : formule étudiant étranger en France, ≈ 100–180€/an<br>→ April International : formule Campus<br>→ AXA Assistance : formule étudiants internationaux<br><br><b>L'attestation doit mentionner :</b> ton nom, territoire France, durée 1 an min, garanties (soins, hospitalisation, rapatriement).<br><b>Note :</b> dès l'inscription universitaire, la Sécu étudiante gratuite remplacera cette assurance privée.`,
        g: ["req"],
      },
    ],
  },

  {
    id: "gfr",
    ico: "🗼",
    bg: "#f0fdf4",
    nm: "Garant France — Belle-sœur (🇩🇿🇫🇷 Double nationalité)",
    badge: { t: "Pièce principale du dossier", c: "b-grn" },
    note: {
      t: `<b>Double nationalité algéro-française : EXCELLENT pour le dossier.</b><br><br>
Elle possède une carte d'identité française — c'est ce qu'il faut présenter pour établir sa qualité de résidente en France, <b>pas sa CNI algérienne</b>.<br><br>
<b>Règle clé :</b> utiliser <em>uniquement ses documents en qualité de française résidant en France</em> :<br>
→ <b>CNI française</b> (pas la CNI algérienne)<br>
→ <b>Bulletins de salaire</b> de son employeur en France<br>
→ <b>Relevés bancaires</b> de sa banque française<br>
→ <b>Avis d'imposition</b> sur impots.gouv.fr<br><br>
Elle compense tes 2 mois de travail. Elle doit agir <b>MAINTENANT</b> : légaliser l'attestation de prise en charge, rassembler ses documents et t'envoyer tout en scan haute qualité ou DHL.`,
      c: "n-grn",
    },
    items: [
      {
        id: "gf1",
        t: "Attestation de prise en charge (PEC) — belle-sœur",
        d: "Document dans lequel elle s'engage officiellement à subvenir à tes besoins pendant ton séjour.",
        s: `<b>Modèle :</b> voir onglet "Lettres" → Lettre 2.<br><b>Comment légaliser :</b><br>1. Belle-sœur rédige + imprime + signe<br>2. Elle se rend à la mairie de son arrondissement (paris.fr → RDV → état civil → légalisation de signature)<br>3. Présente : sa <b>CNI française</b> + la lettre signée → agent appose cachet + signature. Gratuit.<br><b>Alternative :</b> notaire de quartier (≈ 20€, pas de RDV).<br><b>Délai :</b> lui demander de le faire CETTE SEMAINE.`,
        g: ["req"],
      },
      {
        id: "gf2",
        t: "3 derniers bulletins de salaire de la belle-sœur",
        d: "Mars, avril, mai 2025. Salaire net ≥ 615€/mois visible.",
        s: `<b>Elle les récupère :</b> via son espace RH/paie en ligne (Workday, PayFit, etc.) ou bulletins papier.<br><b>Transmission :</b> scan haute résolution → WhatsApp → tu imprimes. OU courrier express DHL (2–3 jours).`,
        g: ["req"],
      },
      {
        id: "gf3",
        t: "3 derniers relevés bancaires — banque française",
        d: "Son compte personnel en France. Virements de salaire visibles chaque mois.",
        s: `<b>Elle télécharge :</b> depuis son espace bancaire en ligne → relevés PDF → imprime ou t'envoie.<br><b>Vérifier :</b> virements de salaire visibles et cohérents avec les bulletins.`,
        g: ["req"],
      },
      {
        id: "gf4",
        t: "CNI française de la belle-sœur — recto-verso",
        d: "Double nationalité → utiliser la CNI FRANÇAISE (pas la CNI algérienne). Prouve sa qualité de résidente en France.",
        s: `<b>Copie recto-verso lisible de sa CNI française</b> (ou passeport français si CNI expirée).<br><b>Ne PAS utiliser sa CNI algérienne</b> pour ce dossier — le consulat a besoin de voir son statut de citoyenne/résidente en France.`,
        g: ["req"],
      },
      {
        id: "gf5",
        t: "Justificatif de domicile France (moins de 3 mois)",
        d: "Prouve qu'elle habite bien en France.",
        s: `<b>Documents acceptés :</b> facture EDF, GDF, eau, téléphonie fixe, ou avis d'imposition 2024. Moins de 3 mois.<br><b>Si en colocation :</b> attestation hébergement signée par titulaire du bail + copie facture + copie CNI du titulaire.`,
        g: ["req"],
      },
      {
        id: "gf6",
        t: "Avis d'imposition 2024 (impots.gouv.fr)",
        d: "Confirme les revenus annuels déclarés à l'administration fiscale française.",
        s: `<b>Comment l'obtenir :</b> <a href="https://impots.gouv.fr" target="_blank">impots.gouv.fr</a> → Espace personnel → "Consulter mes documents fiscaux" → "Avis d'imposition 2024 sur revenus 2023" → PDF → imprimer.`,
        g: ["req"],
      },
      {
        id: "gf7",
        t: "Chaîne documentaire pour prouver le lien de parenté",
        d: "Prouver que la belle-sœur est bien l'épouse de ton frère, et que c'est bien ton frère.",
        s: `<b>3 documents à assembler :</b><br>① Ton acte de naissance avec filiation (nom de tes parents)<br>② Acte de naissance de ton frère (mêmes parents = lien fraternel prouvé)<br>③ Acte de mariage du frère (nomme la belle-sœur = lien conjugal prouvé)<br><br>→ La fiche familiale d'état civil peut remplacer ①+② si elle vous mentionne tous les deux.<br><b>Si actes en arabe :</b> traduction assermentée requise.`,
        g: ["req"],
      },
      {
        id: "gf8",
        t: "Acte de mariage du frère",
        d: "Confirme légalement le lien conjugal entre le frère et la belle-sœur.",
        s: `<b>Si mariage en Algérie :</b> APC de la commune du mariage → service état civil → "extrait d'acte de mariage".<br><b>Si en arabe :</b> traduction assermentée requise.<br><b>Copie certifiée :</b> à l'APC.`,
        g: ["req"],
      },
    ],
  },

  {
    id: "gdz",
    ico: "🌙",
    bg: "#fff7ed",
    nm: "Garant Algérie — Père retraité (60 000–80 000 DA/mois · CCP uniquement)",
    badge: { t: "Fortement recommandé", c: "b-blu" },
    note: {
      t: `<b>❓ Un garant en Algérie est-il obligatoire ?</b><br><br>
<b>Réponse officielle : NON.</b> france-visas.gouv.fr (page Algérie) exige : <em>"preuve de ressources mensuelles d'au minimum 615€ OU lettre de prise en charge d'un garant"</em>. Le garant peut être en France OU en Algérie — aucune obligation d'avoir un garant algérien.<br>
Sources : <a href="https://france-visas.gouv.fr/algerie" target="_blank">france-visas.gouv.fr/algerie</a> · <a href="https://www.demarchesdz.com/visa-france-algerie/" target="_blank">demarchesdz.com</a> (mis à jour avril 2026)<br><br>
<b>Mais fortement recommandé dans ton cas !</b> Le père joue deux rôles :<br>
① Renforcer les preuves financières (60–80k DA ≈ 415–550€/mois, combiné à la belle-sœur → largement au-dessus de 615€)<br>
② Prouver l'<b>ancrage en Algérie</b> (père présent en Algérie = famille, attaches, intention de retour)<br><br>
<b>CCP uniquement = parfaitement valide.</b> Le CCP Algérie Poste est un compte officiel reconnu par le consulat. Les relevés CCP montrant les virements mensuels CNAS/CNR sont suffisants — pas besoin d'un compte bancaire commercial.`,
      c: "n-blu",
    },
    items: [
      {
        id: "gd1",
        t: "Attestation de prise en charge — père retraité",
        d: "Le père s'engage à contribuer financièrement à tes études.",
        s: `<b>Modèle :</b> voir onglet "Lettres" → Lettre 3.<br><b>Légaliser :</b> APC (mairie algérienne) du domicile du père → service légalisation → original + copie + CNI du père → cachet + signature. Timbre fiscal 200 DA.`,
        g: ["opt"],
      },
      {
        id: "gd2",
        t: "Attestation de pension de retraite (CNAS / CNR)",
        d: "Document officiel attestant le montant mensuel exact de la retraite du père.",
        s: `<b>Où obtenir :</b> bureau CNAS (Caisse Nationale d'Assurances Sociales) ou CNR (Caisse Nationale de Retraite) du lieu de résidence du père. Se présenter avec sa CNI. Demander "attestation de pension de retraite mentionnant le montant mensuel". Gratuit. Délai : immédiat à 48h.`,
        g: ["opt"],
      },
      {
        id: "gd3",
        t: "Relevés CCP du père (3 mois) — seul compte, parfaitement valide",
        d: "Ton père n'a pas de compte bancaire commercial — uniquement CCP. C'est suffisant.",
        s: `<b>CCP = compte officiel algérien reconnu par le consulat.</b> Les relevés CCP montrant les virements CNAS/CNR chaque mois sont exactement ce qu'il faut.<br><b>Obtenir :</b> bureau Algérie Poste où le CCP est domicilié → "relevé de compte mensuel imprimé" des 3 derniers mois.<br><b>OU</b> BaridiWeb/BaridiMob : <a href="https://baridibank.dz" target="_blank">baridibank.dz</a> → historique → imprimer PDF.<br><b>Vérifier :</b> virements CNAS/CNR visibles chaque mois avec le montant.`,
        g: ["opt"],
      },
      {
        id: "gd4",
        t: "CNI du père garant",
        d: "Pièce d'identité en cours de validité.",
        s: `Copie recto-verso lisible. Vérifier la date d'expiration.`,
        g: ["opt"],
      },
    ],
  },

  {
    id: "lgt",
    ico: "🏨",
    bg: "#eff6ff",
    nm: "Justificatif d'hébergement",
    badge: { t: "Hôtel réservé ✓", c: "b-grn" },
    note: {
      t: "<b>CROUS :</b> la phase complémentaire ouvre le 7 juillet — impossible avant ton RDV visa du 8 juin. Ce n'est PAS un problème. La réservation hôtel + lettre explicative est parfaitement acceptée par le consulat.",
      c: "n-grn",
    },
    items: [
      {
        id: "lgt1",
        t: "Confirmation de réservation hôtel Besançon ✓",
        d: "Déjà réservé. À imprimer pour le dossier.",
        s: `<b>Imprimer la confirmation :</b> vérifier que la confirmation mentionne ton nom complet, nom de l'hôtel, adresse à Besançon (25000), dates d'arrivée et départ. Si réservation annulable : parfaitement valide pour le consulat.`,
        g: ["don"],
      },
      {
        id: "lgt2",
        t: "Plan de logement mentionné dans la lettre explicative",
        d: "Le consulat veut un plan d'hébergement crédible, pas forcément un bail signé.",
        s: `Dans ta lettre : "Hôtel réservé à Besançon pour mon arrivée. Dès le 7 juillet 2025, date d'ouverture de la phase complémentaire, demande de logement CROUS via trouverunlogement.lescrous.fr. Recherche en parallèle résidences étudiantes privées et colocations. Contact service logement de l'Université dès l'arrivée."`,
        g: ["req"],
      },
    ],
  },

  {
    id: "ltrs",
    ico: "✍️",
    bg: "#fafafa",
    nm: "Lettres à rédiger — Modèles complets",
    badge: { t: "Rédiger maintenant", c: "b-amb" },
    note: {
      t: "<b>3 lettres obligatoires :</b> (1) Lettre explicative globale (toi), (2) Attestation de prise en charge belle-sœur, (3) Attestation de prise en charge père. Toutes en français, signées à la main. À compléter avec tes vraies informations aux endroits [entre crochets].",
      c: "n-blu",
    },
    letters: true,
    items: [],
  },

  {
    id: "rdv",
    ico: "📋",
    bg: "#fff1f2",
    nm: "RDV CAPAGO 8 juin — Préparation jour J",
    badge: { t: "8 juin 2025", c: "b-red" },
    note: {
      t: `✅ <b>RDV Constantine payé et confirmé.</b><br><br>
<b>Frais restants à prévoir en espèces DZD le jour J :</b> frais consulaires visa étudiant ≈ 50€ équivalent DZD (≈ 7 000–8 000 DZD au taux chancellerie du jour). Les 29€ CAPAGO sont déjà réglés.<br>
<b>Prévoir 10 000 DZD</b> en espèces pour être large. Espèces DZD uniquement — pas de carte, pas de chèque.`,
      c: "n-red",
    },
    items: [
      {
        id: "rdv1",
        t: "Organiser le dossier dans un classeur — originaux + copies",
        d: "CAPAGO prend les copies. Tu gardes les originaux. Chaque document en double.",
        s: `<b>Ordre recommandé dans le classeur :</b><br>
1. Message fin de procédure Campus France<br>
2. Formulaire France-Visas signé<br>
3. Attestation d'admission M2<br>
4. Passeport + copies<br>
5. 2 photos identité<br>
6. Acte de naissance + traduction<br>
7. Fiche familiale état civil<br>
8. Casier judiciaire<br>
9. Diplôme original + copies certifiées<br>
10. Relevés de notes<br>
11. Attestation emploi + bulletins de salaire<br>
12. Relevés CCP personnel<br>
13. CV<br>
14. Assurance santé<br>
15. Garant France : PEC légalisée + 3 bulletins + 3 relevés + CNI française + justif. domicile + avis imposition + chaîne lien parenté<br>
16. Garant DZ : PEC père légalisée + attestation pension CNAS/CNR + 3 relevés CCP + CNI père<br>
17. Réservation hôtel Besançon<br>
18. Lettre explicative`,
        g: ["req"],
      },
      {
        id: "rdv2",
        t: "RDV Constantine — payé et confirmé ✓",
        d: "Centre CAPAGO Constantine. RDV non modifiable.",
        s: `Consulter <a href="https://fr-dz.capago.eu" target="_blank">fr-dz.capago.eu</a> → espace personnel → vérifier centre, date et heure. Conserver la convocation imprimée dans le classeur.`,
        g: ["don"],
      },
      {
        id: "rdv3",
        t: "Prévoir les frais consulaires en espèces DZD",
        d: "Frais restants le jour J (les 29€ CAPAGO sont déjà payés).",
        s: `<b>Frais consulaires visa étudiant :</b> ≈ 50€ équivalent DZD (≈ 7 000–8 000 DZD au taux chancellerie du jour).<br><b>Espèces DZD uniquement.</b> Prévoir <b>10 000 DZD</b> pour être large.`,
        g: ["req"],
      },
      {
        id: "rdv4",
        t: "Données biométriques — empreintes + photo sur place",
        d: "Prise en charge sur place par CAPAGO. Obligatoire.",
        s: `Se présenter les mains propres et sèches (éviter crème hydratante le matin). Tenue correcte pour la photo. L'agent guide toute la procédure.`,
        g: ["req"],
      },
    ],
  },
];

export const AFTER_SECS = [
  {
    id: "vlsts",
    ico: "🌐",
    bg: "#eff6ff",
    nm: "Validation VLS-TS — Dans les 3 mois après arrivée",
    badge: { t: "OBLIGATOIRE dans 3 mois", c: "b-red" },
    note: {
      t: "Si tu ne valides pas ton VLS-TS dans les 3 mois après l'arrivée, tu es en situation irrégulière. C'est une démarche en ligne rapide.",
      c: "n-red",
    },
    items: [
      {
        id: "a1",
        t: "Valider le VLS-TS sur le portail ANEF",
        d: "Démarche en ligne obligatoire dès l'arrivée en France (dans les 3 mois max).",
        s: `<b>1. Aller sur :</b> <a href="https://administration-etrangers-en-france.interieur.gouv.fr" target="_blank">administration-etrangers-en-france.interieur.gouv.fr</a><br><b>2. Créer un compte</b> avec ton email<br><b>3. Saisir</b> les informations de ton visa<br><b>4. Justificatif de domicile en France</b> (adresse hôtel au début)<br><b>5. Payer</b> taxe ≈ 50€ (carte bancaire ou timbre fiscal en bureau de tabac)<br><b>6. Conserver</b> l'attestation de validation`,
        g: ["req", "Dès arrivée"],
      },
    ],
  },

  {
    id: "cvec",
    ico: "💳",
    bg: "#f0fdf4",
    nm: "CVEC — Avant l'inscription universitaire",
    badge: { t: "~103€ obligatoire", c: "b-amb" },
    items: [
      {
        id: "a2",
        t: "Payer la Contribution Vie Étudiante et de Campus",
        d: "Obligatoire avant toute inscription à l'université. Si boursier CROUS : exonération totale.",
        s: `<b>1. Aller sur :</b> <a href="https://cvec.etudiant.gouv.fr" target="_blank">cvec.etudiant.gouv.fr</a><br><b>2. Créer un compte</b> avec ton INE (fourni par l'université)<br><b>3. Payer</b> en ligne par carte bancaire (≈ 103€)<br><b>4. Télécharger l'attestation CVEC</b> → présenter au service des inscriptions`,
        g: ["req", "Avant inscription"],
      },
    ],
  },

  {
    id: "crous",
    ico: "🏠",
    bg: "#f5f3ff",
    nm: "CROUS Besançon — Demande de logement (7 juillet)",
    badge: { t: "7 juillet 2025", c: "b-pur" },
    note: {
      t: "<b>Phase complémentaire :</b> ouverte à TOUS les étudiants (y compris internationaux sans DSE) à partir du 7 juillet. Aucun DSE requis. Les places se remplissent vite — connecte-toi le 7 juillet matin.",
      c: "n-pur",
    },
    items: [
      {
        id: "a3",
        t: "Créer ton compte MesServices.etudiant.gouv.fr (dès maintenant)",
        d: "Plateforme nationale pour logement, bourse, et toutes démarches étudiantes.",
        s: `<b>Maintenant :</b> <a href="https://messervices.etudiant.gouv.fr" target="_blank">messervices.etudiant.gouv.fr</a> → créer un compte avec ton email. Avoir le compte prêt accélère la démarche le 7 juillet.`,
        g: ["req", "Maintenant"],
      },
      {
        id: "a4",
        t: "Le 7 juillet — se connecter sur trouverunlogement.lescrous.fr",
        d: "Phase complémentaire ouverte à tous. Filtrer par ville : Besançon, CROUS Bourgogne-Franche-Comté.",
        s: `<b>7 juillet matin :</b> <a href="https://trouverunlogement.lescrous.fr" target="_blank">trouverunlogement.lescrous.fr</a><br>→ Ville : Besançon | Type : chambre individuelle ou studio<br>→ Résidence Planoise (4 Place de l'Europe, 25000 Besançon) : à partir de 340€/mois CC<br><b>Faire jusqu'à 10 vœux</b> pour maximiser les chances.`,
        g: ["req", "7 juillet"],
      },
      {
        id: "a5",
        t: "Documents à préparer pour la candidature CROUS",
        d: "À avoir prêts pour confirmer rapidement si une proposition est faite.",
        s: `<b>Documents demandés à l'entrée :</b><br>- Passeport + visa<br>- Attestation d'inscription universitaire (Besançon)<br>- RIB d'un compte bancaire FRANÇAIS<br>- Justificatif de ressources ou attestation garant<br>- <b>Assurance habitation obligatoire</b> (Maif Étudiant, Luko — en ligne en 10 min)`,
        g: ["req"],
      },
      {
        id: "a6",
        t: "Alternative si CROUS complet — logements privés",
        d: "Options de repli si aucune chambre CROUS n'est disponible à Besançon.",
        s: `→ <a href="https://www.lokaviz.fr" target="_blank">lokaviz.fr</a> : annonces particuliers via CROUS<br>→ Le Bon Coin → "location meublé Besançon" (250–500€/mois studios)<br>→ <a href="https://www.appartager.com" target="_blank">appartager.com</a> : colocation Besançon<br>→ Résidences privées : Arpej, Nexity Studéa Besançon<br>→ Facebook : "Logement étudiant Besançon", "Étudiants UFC Besançon"`,
        g: ["inf"],
      },
    ],
  },

  {
    id: "france",
    ico: "🏛️",
    bg: "#fff7ed",
    nm: "Compte bancaire + CAF + Sécu + Carte de séjour",
    badge: { t: "Dès l'arrivée", c: "b-amb" },
    items: [
      {
        id: "a7",
        t: "Ouvrir un compte bancaire en France",
        d: "Nécessaire pour : payer le loyer, recevoir la CAF, être payé si tu travailles.",
        s: `<b>Options faciles pour étudiant étranger :</b><br>→ <b>La Banque Postale :</b> bureau de poste, accessible avec passeport + visa<br>→ <b>Boursorama / Revolut / Nickel :</b> 100% en ligne, avec passeport + selfie<br>→ <b>BNP / Société Générale :</b> en agence avec visa étudiant + justif. domicile + attestation inscription`,
        g: ["req", "Dès arrivée"],
      },
      {
        id: "a8",
        t: "CAF — Aide Personnalisée au Logement (APL)",
        d: "100 à 300€/mois d'aide selon logement. Accessible avec visa étudiant valide.",
        s: `<b>Après avoir signé un bail :</b><br>1. <a href="https://www.caf.fr" target="_blank">caf.fr</a> → Créer un compte → Demander les APL<br>2. Joindre : RIB français, bail signé, passeport, visa, attestation inscription<br><b>Délai :</b> 1–2 mois pour le premier versement. Rétroactif dès le dépôt.`,
        g: ["req", "Après bail signé"],
      },
      {
        id: "a9",
        t: "Sécurité Sociale étudiante (CPAM)",
        d: "Gratuite et obligatoire pour étudiants étrangers non-européens. Remplace l'assurance privée.",
        s: `<b>Lors de l'inscription universitaire :</b> l'université guidera vers la procédure CPAM. Ou directement :<br><a href="https://www.ameli.fr" target="_blank">ameli.fr</a> → "Étudiant étranger" → s'affilier.<br><b>Documents :</b> passeport, visa, attestation inscription, justificatif domicile France.<br><b>Délai :</b> 2–4 semaines pour la carte Vitale.`,
        g: ["req", "À l'inscription"],
      },
      {
        id: "a10",
        t: "Carte de séjour — Préfecture du Doubs (spécifique Algériens)",
        d: "En tant qu'Algérien, tu dois demander une carte de séjour à la préfecture (accord 1968).",
        s: `<b>Où :</b> Préfecture du Doubs, 8–10 rue Charles Nodier, 25000 Besançon.<br><b>RDV en ligne :</b> doubs.gouv.fr → "Titre de séjour" → prendre RDV.<br><b>Documents :</b> passeport + visa + justificatif domicile Besançon + attestation inscription + photos identité.<br><b>Faire cette démarche dans les 2 premiers mois après l'arrivée.</b>`,
        g: ["req", "Premiers mois"],
      },
    ],
  },
];
