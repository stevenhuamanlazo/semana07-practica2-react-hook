import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import tasksReducer, { ACTIONS, initialState } from './hooks/useTasksReducer'
import { useDebounce } from './hooks/useDebounce'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import Clock from './components/Clock'
import './App.css'

// Estado inicial: lee las tareas guardadas en localStorage
const init = (base) => {
  try {
    const saved = JSON.parse(localStorage.getItem('tasks'))
    return Array.isArray(saved) ? { ...base, items: saved } : base
  } catch {
    return base
  }
}

// Etiquetas visibles en español (los valores internos siguen en inglés)
const FILTER_LABELS = { all: 'Todas', pending: 'Pendientes', completed: 'Completadas' }

const Dashboard = () => {
  const [state, dispatch] = useReducer(tasksReducer, initialState, init)
  const { theme, toggleTheme } = useTheme()

  // UI local
  const [showStats, setShowStats] = useState(false)
  const [showClock, setShowClock] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  // Persistir tareas
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.items))
  }, [state.items])

  // dispatch es estable, por eso las dependencias están vacías
  const handleAdd = useCallback(
    (title) => dispatch({ type: ACTIONS.ADD, payload: { id: crypto.randomUUID(), title } }),
    []
  )
  const handleRemove = useCallback((id) => dispatch({ type: ACTIONS.REMOVE, payload: id }), [])
  const handleToggle = useCallback((id) => dispatch({ type: ACTIONS.TOGGLE, payload: id }), [])

  const done = useMemo(() => state.items.filter((t) => t.completed).length, [state.items])

  return (
    <div className={`dashboard ${theme}`}>
      <header className="dashboard-header">
        <h1>Gestor de Tareas</h1>
        <button onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Modo oscuro' : '☀️ Modo claro'}
        </button>
      </header>

      <TaskForm onAdd={handleAdd} />

      <div className="controls">
        {Object.entries(FILTER_LABELS).map(([value, label]) => (
          <button
            key={value}
            className={state.filter === value ? 'active' : ''}
            onClick={() => dispatch({ type: ACTIONS.FILTER, payload: value })}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() =>
            dispatch({ type: ACTIONS.SORT, payload: state.sort === 'asc' ? 'desc' : 'asc' })
          }
        >
          Orden: {state.sort === 'asc' ? 'A → Z' : 'Z → A'}
        </button>
        <button onClick={() => setShowStats((s) => !s)}>
          {showStats ? 'Ocultar' : 'Mostrar'} estadísticas
        </button>
        <button onClick={() => setShowClock((s) => !s)}>
          {showClock ? 'Ocultar' : 'Mostrar'} reloj
        </button>
      </div>

      <input
        className="search"
        type="search"
        placeholder="Buscar tarea..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {showClock && <Clock />}

      {showStats && (
        <p className="stats">
          <span>Total: <strong>{state.items.length}</strong></span>
          <span>Completadas: <strong>{done}</strong></span>
          <span>Pendientes: <strong>{state.items.length - done}</strong></span>
        </p>
      )}

      {state.items.length === 0 && (
        <p className="empty">Aún no hay tareas. ¡Agrega la primera!</p>
      )}

      <TaskList
        tasks={state.items}
        filter={state.filter}
        sort={state.sort}
        query={debouncedSearch}
        onRemove={handleRemove}
        onToggle={handleToggle}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}