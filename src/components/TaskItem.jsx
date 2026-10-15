import { memo } from 'react'

const TaskItem = ({ task, onRemove, onToggle }) => {
  console.log('render TaskItem', task.title)
  return (
    <li className={task.completed ? 'done' : ''}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <span>{task.title}</span>
      <button onClick={() => onRemove(task.id)}>Eliminar</button>
    </li>
  )
}

export default memo(TaskItem)