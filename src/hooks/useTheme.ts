import { useState, useEffect } from 'react'
import { Theme } from '@/constants/filters'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'system' || saved === 'light' || saved === 'dark') {
      return saved as Theme
    }
    return 'system'
  })

  useEffect(() => {
    const applyTheme = (newTheme: Theme) => {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (newTheme === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        // system の場合はOSの設定を見て切り替える
        document.documentElement.classList.toggle(
          'dark',
          window.matchMedia('(prefers-color-scheme: dark)').matches
        )
      }
    }

    applyTheme(theme)
  }, [theme])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return { theme, setTheme: handleThemeChange }
}
