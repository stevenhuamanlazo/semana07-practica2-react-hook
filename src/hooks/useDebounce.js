import { useEffect, useState } from 'react'

// Devuelve el valor solo después de que deja de cambiar por `delay` ms
export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id) // cleanup: cancela el timer anterior
  }, [value, delay])

  return debounced
}