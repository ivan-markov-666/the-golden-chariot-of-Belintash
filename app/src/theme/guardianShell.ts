export type Locale = 'bg' | 'en';

export type GuardianShellPalette = {
  background: string;
  surface: string;
  panel: string;
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  danger: string;
  outline: string;
};

export type GuardianShellTheme = {
  id: 'default' | 'ascetic';
  name: string;
  palette: GuardianShellPalette;
  tooltipBackground: string;
  tooltipBorder: string;
};

const themes: Record<GuardianShellTheme['id'], GuardianShellTheme> = {
  default: {
    id: 'default',
    name: 'Obsidian Codex',
    palette: {
      background: '#07090d',
      surface: 'rgba(11, 16, 24, 0.95)',
      panel: 'rgba(19, 27, 39, 0.9)',
      primary: '#ffcc5c',
      secondary: '#6bd6ff',
      textPrimary: '#f7f3e9',
      textSecondary: '#c1c7d0',
      accent: '#ff8f42',
      danger: '#f66a63',
      outline: 'rgba(255, 204, 92, 0.5)',
    },
    tooltipBackground: 'rgba(12, 18, 27, 0.95)',
    tooltipBorder: 'rgba(255, 204, 92, 0.4)',
  },
  ascetic: {
    id: 'ascetic',
    name: 'Ascetic Runes',
    palette: {
      background: '#020202',
      surface: 'rgba(6, 6, 6, 0.98)',
      panel: 'rgba(18, 18, 18, 0.95)',
      primary: '#f3f3f3',
      secondary: '#a1e3ff',
      textPrimary: '#ffffff',
      textSecondary: '#d9d9d9',
      accent: '#e6ff8c',
      danger: '#ff8f8f',
      outline: 'rgba(255, 255, 255, 0.45)',
    },
    tooltipBackground: 'rgba(4, 4, 4, 0.95)',
    tooltipBorder: 'rgba(230, 255, 140, 0.5)',
  },
};

export const getGuardianShellTheme = (highContrast: boolean): GuardianShellTheme =>
  highContrast ? themes.ascetic : themes.default;
