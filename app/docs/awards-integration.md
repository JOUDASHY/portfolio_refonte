# 🎓 Intégration Awards ↔ Education

## 📋 Vue d'ensemble

Le système de gestion des **Awards** (diplômes et certifications) a été intégré au backoffice avec une relation optionnelle vers les **Educations** (parcours éducatifs).

## 🔗 Architecture

```
Education (1) ────────< (N) Award (Diplômes/Certifications)
```

### Relation
- **Type** : One-to-Many optionnel (Education → Awards)
- **Nullable** : Oui (permet des certifications indépendantes comme AWS, Google Cloud)
- **Cascade** : Backend gère le delete cascade

## 🎯 Fonctionnalités implémentées

### 1. Page Awards complète (`/backoffice/awards`)

#### ✅ Affichage
- Table avec colonnes : Année, Titre, Type, Institution, Formation liée
- Indication visuelle "Indépendant" pour les certifications sans formation
- Compteur de résultats

#### ✅ Recherche et Filtres
- Barre de recherche : titre, institution, année, formation
- Filtres par type avec compteurs :
  - 📜 Diplôme
  - 🎓 Certification
  - 📃 Attestation
  - 🏅 Brevet
  - ⚡ Autre

#### ✅ Formulaire CRUD
- **Type** : Dropdown avec 5 types prédéfinis
- **Formation liée** : Dropdown optionnel chargeant toutes les formations
  - Affichage : `École - Parcours (Année début-Année fin)`
  - Option "Certification indépendante" pour `education_id = null`
- **Titre** : Champ texte requis
- **Institution** : Champ texte requis
- **Année** : Champ numérique requis
- **Description** : Textarea optionnel

#### ✅ Validation
- Bouton "Ajouter/Enregistrer" désactivé si titre ou institution manquant
- Toast notifications pour succès/erreur

#### ✅ États de chargement
- Loading overlay pendant les opérations
- États distincts : `loading`, `submitting`, `deleting`, `loadingEducations`

## 📁 Fichiers modifiés

### Types
```typescript
// app/types/backoffice/award.ts
export type Award = {
  id: number;
  education: number | null;           // FK vers Education
  education_name?: string | null;     // Nom retourné par l'API
  titre: string;
  institution: string;
  type: 'diplome' | 'certification' | 'attestation' | 'brevet' | 'autre';
  type_display?: string;              // Display value
  annee: number;
};

// app/types/backoffice/education.ts
export type Education = {
  id: number;
  image: string | null;
  nom_ecole: string;
  nom_parcours: string;
  annee_debut: number;
  annee_fin: number;
  lieu: string;
  diplomes?: Award[];  // Nested (optionnel)
};
```

### Hook personnalisé
```typescript
// app/hooks/useBackofficeAwards.ts
export type BackofficeAward = {
  id: string;
  education_id: string | null;
  education_name: string | null;
  year: string;
  title: string;
  organization: string;
  kind: 'diplome' | 'certification' | 'attestation' | 'brevet' | 'autre';
  description?: string;
  updatedAt: string;
};
```

### Page
- `app/[lang]/backoffice/awards/page.tsx` : Page complète avec UI Material

## 🎨 Design

### Palette de types
- **Diplôme** : Catégorie par défaut
- **Certification** : Certifications professionnelles (AWS, Google, etc.)
- **Attestation** : Attestations de formation
- **Brevet** : Brevets d'études
- **Autre** : Catégorie générique

### UI/UX
- Boutons de filtre : Pills avec compteurs dynamiques
- État actif : `bg-primary text-primary-foreground`
- État inactif : `bg-muted text-muted-foreground hover:bg-muted/80`
- Texte "Indépendant" : `italic text-muted-foreground`

## 🔄 Flux de données

### Création/Modification
```
Form → useBackofficeAwards.create/update
  → awardService.create/update
    → Backend API POST/PUT /api/awards/
      → Refresh liste
        → Toast success
```

### Chargement
```
Page mount → useBackofficeAwards.refresh
  → awardService.list (GET /api/awards/)
    → Transform avec toUi()
      → State items[]

Page mount → loadEducations
  → educationService.list (GET /api/educations/)
    → State educations[]
```

## 🧪 Cas d'usage

### Cas 1 : Diplôme académique lié
```json
{
  "education_id": "1",
  "title": "Diplôme d'Ingénieur",
  "kind": "diplome",
  "institution": "Ministère de l'Éducation",
  "year": "2023"
}
```

### Cas 2 : Certification indépendante
```json
{
  "education_id": null,
  "title": "AWS Solutions Architect - Associate",
  "kind": "certification",
  "institution": "Amazon Web Services",
  "year": "2024"
}
```

### Cas 3 : Attestation de formation
```json
{
  "education_id": "2",
  "title": "Certificat Scrum Master",
  "kind": "attestation",
  "institution": "Scrum.org",
  "year": "2022"
}
```

## 🚀 Utilisation

### Ajouter un diplôme académique
1. Cliquer "Nouveau diplôme"
2. Sélectionner le type "Diplôme"
3. Choisir la formation parente dans le dropdown
4. Remplir titre, institution, année
5. Enregistrer

### Ajouter une certification indépendante
1. Cliquer "Nouveau diplôme"
2. Sélectionner le type "Certification"
3. Laisser "-- Certification indépendante --" dans le dropdown
4. Remplir les informations
5. Enregistrer

### Filtrer par type
- Cliquer sur un des boutons de filtre (Diplôme, Certification, etc.)
- Le tableau affiche uniquement les awards du type sélectionné
- Le compteur indique le nombre d'éléments par type

## 🔍 Recherche
La recherche fonctionne sur :
- Titre du diplôme/certification
- Nom de l'institution
- Année d'obtention
- Nom de la formation liée (si applicable)

## 📊 Statistiques
Chaque bouton de filtre affiche le nombre d'awards par type :
- Tous (total)
- Diplôme (n)
- Certification (n)
- Attestation (n)
- Brevet (n)
- Autre (n)

## ✅ Validation backend requise

Le backend doit retourner dans l'API `/api/awards/` :
```json
{
  "id": 1,
  "education": 1,              // ou null
  "education_name": "ITU - Ingénieur Génie Logiciel (2018-2023)",
  "titre": "Diplôme d'Ingénieur",
  "institution": "Ministère",
  "type": "diplome",
  "type_display": "Diplôme",
  "annee": 2023
}
```

## 🎉 Bénéfices

✅ Relation claire entre formations et diplômes  
✅ Support des certifications indépendantes  
✅ Filtrage puissant par type  
✅ Recherche globale  
✅ UI intuitive et responsive  
✅ Types prédéfinis cohérents  
✅ Validation côté client  
✅ Toast notifications  
✅ États de chargement clairs  

## 🔗 Liens
- Page Awards : `/[lang]/backoffice/awards`
- Service : `services/backoffice/awardService.ts`
- Hook : `hooks/useBackofficeAwards.ts`
- Types : `types/backoffice/award.ts`, `types/backoffice/education.ts`
