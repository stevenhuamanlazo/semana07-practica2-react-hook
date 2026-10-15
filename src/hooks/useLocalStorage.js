import { useState, useEffect } from 'react'

// Hook reutilizable: sincroniza un estado con localStorage.
// Recibe key y defaultValue, retorna [value, setValue].
export const useLocalStorage = (key, defaultValue) => {
  // Inicialización perezosa: la función solo corre en el primer render
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : defaultValue
    } catch {
      return defaultValue // JSON corrupto o localStorage bloqueado
    }
  })

  // Persistir cada vez que cambie la clave o el valor
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Almacenamiento lleno o no disponible: se ignora sin romper la app
    }
  }, [key, value])

  // Cleanup: sincroniza entre pestañas y evita listeners duplicados
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key && e.newValue !== null) {
        setValue(JSON.parse(e.newValue))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [value, setValue]
}