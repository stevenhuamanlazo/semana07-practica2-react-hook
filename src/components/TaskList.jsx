import TaskItem from './TaskItem'

const TaskList = ({ tasks, filter, sort, onRemove, onToggle }) => {
  console.log('render TaskList')

  const processedTasks = tasks
    .filter((t) =>
      filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed
    )
    .sort((a, b) =>
      sort === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    )

  return (
    <ul>
      {processedTasks.map((task) => (
        <TaskItem key={task.id} task={task} onRemove={onRemove} onToggle={onToggle} />
      ))}
    </ul>
  )
}

export default TaskList