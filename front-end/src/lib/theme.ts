export type Theme = 'light' | 'dark' | 'system'
const STORAGE_KEY = 'theme'

export function getStoredTheme(): Theme | null {
  try {
    return (localStorage.getItem(STORAGE_KEY) as Theme) || null
  } catch (e) {
    return null
  }
}

export function setStoredTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch (e) {
    // ignore
  }
}

export function applyTheme(theme: Theme) {
  if (theme === 'system') {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', prefersDark)
  } else {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }
}

export function watchSystemTheme(handler: (isDark: boolean) => void) {
  if (!window.matchMedia) return () => {}
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const listener = (e: MediaQueryListEvent) => handler(e.matches)
  if (mq.addEventListener) mq.addEventListener('change', listener)
  else mq.addListener(listener)
  return () => {
    if (mq.removeEventListener) mq.removeEventListener('change', listener)
    else mq.removeListener(listener)
  }
}
