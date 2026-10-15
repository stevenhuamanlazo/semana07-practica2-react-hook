import { memo, useEffect, useRef, useState } from 'react'
const TaskForm = ({ onAdd }) => {
  const inputRef = useRef(null)
  const [title, setTitle] = useState('') // UI local

  // Auto-focus al montar
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const clean = title.trim()
    if (!clean) return
    onAdd(clean)
    setTitle('')
    inputRef.current.focus() // vuelve el foco sin provocar re-render
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nueva tarea..."
      />
      <button type="submit">Agregar</button>
    </form>
  )
}

export default memo(TaskForm)