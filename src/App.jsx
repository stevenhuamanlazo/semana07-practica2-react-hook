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
      <button onClick={toggleTheme}>Cambiar Tema ({theme})</button>
      <h1>Gestor de Tareas</h1>

      <TaskForm onAdd={handleAdd} />

      <div className="controls">
        {['all', 'pending', 'completed'].map((f) => (
          <button
            key={f}
            className={state.filter === f ? 'active' : ''}
            onClick={() => dispatch({ type: ACTIONS.FILTER, payload: f })}
          >
            {f}
          </button>
        ))}
        <button
          onClick={() =>
            dispatch({ type: ACTIONS.SORT, payload: state.sort === 'asc' ? 'desc' : 'asc' })
          }
        >
          Orden: {state.sort}
        </button>
        <button onClick={() => setShowStats((s) => !s)}>
          {showStats ? 'Ocultar' : 'Mostrar'} estadísticas
        </button>
      </div>

      {showStats && (
        <p>Total: {state.items.length} | Completadas: {done}</p>
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