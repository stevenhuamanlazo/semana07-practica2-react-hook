// Tipos de acción: evitan errores de tipeo en strings sueltos
export const ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  TOGGLE: 'TOGGLE',
  FILTER: 'FILTER',
  SORT: 'SORT',
}

export const initialState = { items: [], filter: 'all', sort: 'asc' }

function tasksReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD:
      // Inmutabilidad: nuevo array, nunca push sobre state.items
      return {
        ...state,
        items: [
          ...state.items,
          { id: action.payload.id, title: action.payload.title, completed: false },
        ],
      }

    case ACTIONS.REMOVE:
      return {
        ...state,
        items: state.items.filter((task) => task.id !== action.payload),
      }

    case ACTIONS.TOGGLE:
      return {
        ...state,
        items: state.items.map((task) =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      }

    case ACTIONS.FILTER:
      return { ...state, filter: action.payload } // 'all' | 'pending' | 'completed'

    case ACTIONS.SORT:
      return { ...state, sort: action.payload } // 'asc' | 'desc'

    default:
      return state
  }
}

export default tasksReducer