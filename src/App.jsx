import { useEffect, useReducer, useState } from 'react'
import tasksReducer, { ACTIONS, initialState } from './hooks/useTasksReducer'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
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
  const [showStats, setShowStats] = useState(false) // UI local

  // Persistir tareas
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.items))
  }, [state.items])

  const handleAdd = (title) =>
    dispatch({ type: ACTIONS.ADD, payload: { id: crypto.randomUUID(), title } })
  const handleRemove = (id) => dispatch({ type: ACTIONS.REMOVE, payload: id })
  const handleToggle = (id) => dispatch({ type: ACTIONS.TOGGLE, payload: id })

  const done = state.items.filter((t) => t.completed).length

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
      </div>

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