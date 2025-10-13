# Dynamic Profile System Implementation

## Overview
Le système de profil dynamique permet d'afficher les informations personnelles de Nilsen en utilisant l'API `/api/NilsenProfile/` au lieu de données statiques.

## API Endpoint

### GET `/api/NilsenProfile/`
- **Purpose**: Récupérer les données de profil de Nilsen
- **Response**: 
  ```json
  {
    "username": "Nilsen",
    "email": "alitsiryeddynilsen@gmail.com",
    "id": 1,
    "image": "/media/profile_images/WhatsApp_Image_2025-03-08_at_19.12.58.jpeg",
    "about": "Je suis étudiant en quatrième année à l'ENI...",
    "date_of_birth": "2000-08-27",
    "link_facebook": "https://www.facebook.com/tobias.joudashiy",
    "link_github": "https://github.com/JOUDASHY/",
    "link_linkedin": "https://www.linkedin.com/in/alitsiry-eddy-nilsen-tovohery-217b31283",
    "phone_number": "348655523",
    "address": "Isada ,Fianarantsoa"
  }
  ```

## Implementation Details

### Files Created/Modified

1. **Types**:
   - `app/types/backoffice/profile.ts` - TypeScript interfaces pour les données de profil

2. **Services**:
   - `app/services/backoffice/profileService.ts` - Service API pour récupérer les données de profil

3. **Hooks**:
   - `app/hooks/useProfile.ts` - Hook React pour gérer l'état et les appels API du profil

4. **Components**:
   - `app/ux/About.tsx` - Composant About mis à jour pour utiliser les données dynamiques

### Key Features

1. **Dynamic Data Loading**: Les données de profil sont chargées depuis l'API
2. **Loading States**: Affichage d'un skeleton pendant le chargement
3. **Error Handling**: Gestion d'erreur avec possibilité de retry
4. **Fallback Values**: Valeurs par défaut si l'API échoue
5. **Conditional Rendering**: Affichage conditionnel des éléments selon les données disponibles

### Data Mapping

| API Field | Component Usage | Fallback |
|-----------|----------------|----------|
| `username` | Nom affiché | "Nilsen" |
| `image` | Photo de profil | "/logo_nil.png" |
| `about` | Description personnelle | Traduction par défaut |
| `email` | Contact email | "alitsiryeddynilsen@gmail.com" |
| `address` | Localisation | "Isada ,Fianarantsoa" |
| `phone_number` | Numéro de téléphone | Affiché seulement si disponible |
| `link_linkedin` | Lien LinkedIn | Affiché seulement si disponible |
| `link_github` | Lien GitHub | Affiché seulement si disponible |
| `link_facebook` | Lien Facebook | Affiché seulement si disponible |

### Technical Implementation

- **Type Safety**: Support TypeScript complet avec interfaces appropriées
- **Error Boundaries**: Gestion d'erreur complète avec retry
- **Loading States**: Skeleton loader pendant le chargement
- **Conditional Rendering**: Affichage intelligent des éléments selon les données
- **Responsive Design**: Interface adaptative pour tous les écrans

### Usage

Le hook `useProfile` peut être utilisé dans n'importe quel composant qui a besoin des données de profil :

```typescript
const { profile, loading, error, refetch } = useProfile();
```

### States

1. **Loading**: `true` pendant le chargement des données
2. **Error**: Message d'erreur si l'API échoue
3. **Profile**: Objet contenant toutes les données de profil
4. **Refetch**: Fonction pour recharger les données

### Benefits

1. **Centralized Data**: Une seule source de vérité pour les données de profil
2. **Easy Updates**: Mise à jour des informations via l'API backend
3. **Better UX**: États de chargement et gestion d'erreur appropriés
4. **Maintainability**: Code plus maintenable avec séparation des responsabilités
5. **Scalability**: Facile d'ajouter de nouveaux champs de profil

## Future Enhancements

- Cache des données de profil pour améliorer les performances
- Mise à jour en temps réel des données de profil
- Validation des données côté client
- Optimisation des images de profil
- Support pour plusieurs langues dans les données de profil
