# Dynamic Social Dock Implementation

## Overview
Le composant SocialDock a été dynamisé pour utiliser les données de profil de l'API `/api/NilsenProfile/` au lieu de liens statiques.

## Fonctionnalités Implémentées

### 1. **Liens Sociaux Dynamiques**
- **LinkedIn** : `profile.link_linkedin`
- **GitHub** : `profile.link_github`
- **Facebook** : `profile.link_facebook`

### 2. **Affichage Conditionnel**
- Les liens ne s'affichent que si les URLs correspondantes existent dans le profil
- Le dock ne s'affiche pas du tout si aucun lien social n'est disponible
- Gestion intelligente des états de chargement

### 3. **États de Chargement**
- **Skeleton Loading** : Affichage d'un skeleton pendant le chargement des données
- **Masquage Intelligent** : Le dock ne s'affiche pas si aucun lien n'est disponible

## Architecture Technique

### Hook Utilisé
```typescript
const { profile, loading } = useProfile();
```

### Logique de Construction des Liens
```typescript
const items = [];

if (profile?.link_linkedin) {
  items.push({ href: profile.link_linkedin, label: "LinkedIn", icon: LinkedInIcon });
}

if (profile?.link_github) {
  items.push({ href: profile.link_github, label: "GitHub", icon: GitHubIcon });
}

if (profile?.link_facebook) {
  items.push({ href: profile.link_facebook, label: "Facebook", icon: FacebookIcon });
}
```

### Gestion des États

#### 1. **État de Chargement**
```typescript
if (loading) {
  return (
    <div className="skeleton-loading">
      <div className="animate-pulse" />
    </div>
  );
}
```

#### 2. **Aucun Lien Disponible**
```typescript
if (items.length === 0) {
  return null; // Ne pas afficher le dock
}
```

#### 3. **Affichage Normal**
```typescript
return (
  <div className="social-dock">
    {items.map(({ href, label, icon: Icon }) => (
      <a href={href} key={label}>
        <Icon />
      </a>
    ))}
  </div>
);
```

## Mapping des Données

| API Field | Social Dock Usage | Condition |
|-----------|-------------------|-----------|
| `link_linkedin` | Lien LinkedIn | Si disponible |
| `link_github` | Lien GitHub | Si disponible |
| `link_facebook` | Lien Facebook | Si disponible |

## Avantages

### 1. **Cohérence des Données**
- Tous les liens sociaux viennent de la même source API
- Synchronisation automatique avec les autres composants
- Mise à jour centralisée des liens

### 2. **Expérience Utilisateur Améliorée**
- Affichage conditionnel intelligent
- États de chargement appropriés
- Pas d'affichage inutile si aucun lien n'est disponible

### 3. **Maintenabilité**
- Plus besoin de mettre à jour manuellement les liens
- Code plus propre et organisé
- Gestion automatique des nouveaux liens sociaux

### 4. **Performance**
- Chargement unique des données de profil
- Réutilisation du hook `useProfile`
- Affichage conditionnel optimisé

## Gestion des Erreurs

### États de Chargement
- **Skeleton Loading** : Animation de chargement pendant le fetch
- **Masquage** : Pas d'affichage si les données ne sont pas disponibles

### Fallback
- **Pas de dock** : Si aucun lien social n'est disponible
- **Liens valides** : Seuls les liens avec des URLs valides sont affichés

## Comparaison Avant/Après

### **Avant (Statique)**
```typescript
const items = [
  { href: "https://www.linkedin.com/", label: "LinkedIn", icon: LinkedInIcon },
  { href: "https://github.com/", label: "GitHub", icon: GitHubIcon },
  { href: "https://dribbble.com/", label: "Dribbble", icon: DribbbleIcon },
];
```

### **Après (Dynamique)**
```typescript
const items = [];

if (profile?.link_linkedin) {
  items.push({ href: profile.link_linkedin, label: "LinkedIn", icon: LinkedInIcon });
}

if (profile?.link_github) {
  items.push({ href: profile.link_github, label: "GitHub", icon: GitHubIcon });
}

if (profile?.link_facebook) {
  items.push({ href: profile.link_facebook, label: "Facebook", icon: FacebookIcon });
}
```

## Future Enhancements

### 1. **Analytics**
- Suivi des clics sur les liens sociaux
- Métriques d'engagement par plateforme

### 2. **Personnalisation**
- Ordre personnalisé des liens
- Thèmes adaptatifs selon le profil

### 3. **Nouveaux Réseaux**
- Support facile pour de nouveaux réseaux sociaux
- Configuration dynamique des icônes

### 4. **Optimisations**
- Cache des données de profil
- Mise à jour en temps réel
- Validation des URLs

## Impact sur les Performances

- **Chargement unique** : Une seule requête API pour toutes les données
- **Affichage conditionnel** : Pas de rendu inutile
- **Réutilisation** : Hook `useProfile` partagé
- **Optimisation** : Skeleton loading pour une meilleure UX
