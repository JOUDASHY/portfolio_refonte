// Utilitaires pour les ombres adaptatives selon le thème

export const getAdaptiveShadow = (isDark: boolean = false) => {
  if (isDark) {
    // Mode dark : ombre jaune (accent)
    return '0 8px 32px rgba(246, 140, 9, 0.3), 0 4px 16px rgba(246, 140, 9, 0.2), 0 2px 8px rgba(246, 140, 9, 0.1)';
  } else {
    // Mode light : ombre bleue (navy)
    return '0 8px 32px rgba(0, 11, 49, 0.3), 0 4px 16px rgba(0, 11, 49, 0.2), 0 2px 8px rgba(0, 11, 49, 0.1)';
  }
};

export const getAdaptiveBorderColor = (isDark: boolean = false) => {
  return isDark ? 'var(--accent)' : 'var(--navy)';
};
