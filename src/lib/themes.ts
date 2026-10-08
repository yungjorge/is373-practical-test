export const themes = [
  {
    id: "systems",
    name: "Systems",
    description: "Editorial structure. Orange accents. Connected thinking.",
  },
  {
    id: "brutalist",
    name: "Brutalist",
    description: "Heavy rules. Oversized type. Nothing to hide.",
  },
  {
    id: "base",
    name: "Base",
    description: "A quiet, adaptable foundation for any portfolio.",
  },
  {
    id: "swiss",
    name: "Swiss",
    description: "Precise alignment. Restrained red. Clear hierarchy.",
  },
  {
    id: "punk",
    name: "Punk",
    description: "Dark paper. Acid accents. Expressive headlines.",
  },
] as const;
export type Theme = (typeof themes)[number]["id"];
export const defaultTheme: Theme = "systems";
export const themeStorageKey = "is373-theme";
export function isTheme(value: unknown): value is Theme {
  return themes.some((theme) => theme.id === value);
}
