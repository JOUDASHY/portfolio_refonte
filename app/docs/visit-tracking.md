# Système de Tracking des Visites

## Vue d'ensemble

Le système de tracking des visites enregistre automatiquement chaque visite sur le portfolio et affiche des statistiques en temps réel.

## Fonctionnalités

### 1. Enregistrement Automatique (`useVisitTracker`)

- ✅ **Enregistrement automatique** : Chaque visite est enregistrée via POST `/api/record-visit/`
- ✅ **Une fois par session** : Évite les enregistrements multiples dans la même session
- ✅ **Gestion d'erreur** : Ne bloque pas l'application si l'API échoue
- ✅ **Performance optimisée** : Délai de 1s pour s'assurer que la page est chargée

### 2. Affichage des Statistiques

#### Composant `VisitStats` (Simple)
```tsx
import VisitStats from "../ux/VisitStats";

<VisitStats 
  className="text-gray-600" 
  showLabel={true} 
/>
```

#### Composant `VisitStatsDetailed` (Détaillé)
```tsx
import VisitStatsDetailed from "../ux/VisitStatsDetailed";

<VisitStatsDetailed className="my-4" />
```

#### Hook `useVisitStats` (Personnalisé)
```tsx
import { useVisitStats } from "../hooks/useVisitStats";

const { data, loading, error, refetch } = useVisitStats();
```

## Intégration

### Page Principale
Le hook `useVisitTracker()` est intégré dans `app/[lang]/page.tsx` pour enregistrer automatiquement les visites.

### Section Contact
Les statistiques sont affichées dans la section Contact via le composant `VisitStats`.

## API Endpoints

- `POST /api/record-visit/` - Enregistre une nouvelle visite
- `GET /api/total-visits/` - Récupère le nombre total de visites  
- `GET /api/monthly-visit-stats/` - Récupère les statistiques mensuelles

## Stockage Session

Le système utilise `sessionStorage` avec la clé `portfolio_visit_recorded` pour éviter les enregistrements multiples dans la même session.

## Gestion des Erreurs

- Les erreurs d'API sont loggées en console mais n'interrompent pas l'expérience utilisateur
- En cas d'échec, les composants d'affichage se masquent gracieusement
- Le système est resilient et fonctionne même si l'API est indisponible

## Performance

- **Lazy loading** : Les statistiques ne se chargent que quand nécessaire
- **Cache session** : Évite les appels API multiples
- **Délai optimisé** : 1s de délai pour l'enregistrement initial
- **Gestion mémoire** : Cleanup automatique des timeouts
