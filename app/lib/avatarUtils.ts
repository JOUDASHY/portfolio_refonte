/**
 * Utilitaires pour les avatars et couleurs
 */

export const getRandomColor = (seed: string): string => {
  const hash = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#33FFA8",
    "#FFA833", "#57FF33", "#5733FF", "#FF5733", "#33FF57", "#33A8FF"
  ];
  return colors[hash % colors.length];
};

export const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};
