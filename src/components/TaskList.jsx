import { memo, useMemo } from 'react'
import TaskItem from './TaskItem'

const TaskList = ({ tasks, filter, sort, query = '', onRemove, onToggle }) => {
  console.log('render TaskList')

  // Solo se recalcula si cambian tareas, filtro, orden o búsqueda
  const processedTasks = useMemo(() => {
    const text = query.trim().toLowerCase()
    const filtered = tasks.filter((t) => {
      const matchesFilter =
        filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed
      return matchesFilter && t.title.toLowerCase().includes(text)
    })
    // filter() devuelve un array nuevo, así que sort() no muta el estado
    return filtered.sort((a, b) =>
      sort === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    )
  }, [tasks, filter, sort, query])

  return (
    <>
      {tasks.length > 0 && processedTasks.length === 0 && (
        <p className="empty">Sin resultados.</p>
      )}
      <ul>
        {processedTasks.map((task) => (
          <TaskItem key={task.id} task={task} onRemove={onRemove} onToggle={onToggle} />
        ))}
      </ul>
    </>
  )
}

export default memo(TaskList)