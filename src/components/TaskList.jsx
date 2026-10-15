import { memo, useMemo } from 'react'
import TaskItem from './TaskItem'

const TaskList = ({ tasks, filter, sort, onRemove, onToggle }) => {
  console.log('render TaskList')

  // Solo se recalcula si cambian las tareas, el filtro o el orden
  const processedTasks = useMemo(() => {
    const filtered = tasks.filter((t) =>
      filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed
    )
    // filter() devuelve un array nuevo, así que sort() no muta el estado
    return filtered.sort((a, b) =>
      sort === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    )
  }, [tasks, filter, sort])

  return (
    <ul>
      {processedTasks.map((task) => (
        <TaskItem key={task.id} task={task} onRemove={onRemove} onToggle={onToggle} />
      ))}
    </ul>
  )
}

export default memo(TaskList)