/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  // Reemplaza el useState('light') del código base: ahora persiste
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  // Aplica la clase al <body> y limpia la anterior
  useEffect(() => {
    document.body.classList.add(theme)
    return () => document.body.classList.remove(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [setTheme])

  // Valor memoizado: si no, el objeto nuevo re-renderiza a todos los consumidores
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Hook de consumo con validación
export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider')
  return ctx
}