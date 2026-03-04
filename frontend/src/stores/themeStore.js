import { create } from 'zustand';

export const THEME_STORAGE_KEY = 'theme';
export const THEME_LIGHT = 'light';
export const THEME_DARK = 'dark';

const THEME_META_LIGHT = '#fafafa';
const THEME_META_DARK = '#0b0b0f';

const isValidTheme = (value) => value === THEME_LIGHT || value === THEME_DARK;

const readStoredTheme = () => {
  if (typeof window === 'undefined') return THEME_LIGHT;

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isValidTheme(storedTheme) ? storedTheme : THEME_LIGHT;
  } catch (_error) {
    return THEME_LIGHT;
  }
};

const applyThemeToDocument = (theme) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const isDark = theme === THEME_DARK;

  root.classList.toggle(THEME_DARK, isDark);
  root.style.colorScheme = isDark ? THEME_DARK : THEME_LIGHT;

  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
  if (colorSchemeMeta) {
    colorSchemeMeta.setAttribute('content', isDark ? 'dark light' : 'light dark');
  }

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', isDark ? THEME_META_DARK : THEME_META_LIGHT);
  }
};

const persistTheme = (theme) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (_error) {
    // Ignore storage failures (private mode, quota, etc).
  }
};

const initialTheme = readStoredTheme();
applyThemeToDocument(initialTheme);

const useThemeStore = create((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    if (!isValidTheme(theme)) return;

    persistTheme(theme);
    applyThemeToDocument(theme);
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
      persistTheme(nextTheme);
      applyThemeToDocument(nextTheme);
      return { theme: nextTheme };
    });
  },
}));

export default useThemeStore;
