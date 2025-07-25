import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ITodo, FilterType, StatusEnum } from "../types/types"

type TodosState = {
  todos: ITodo[]
  filter: FilterType
}

type UpdatePayloadType = {
  id: string
  status: StatusEnum
}

// Функция для загрузки состояния из localStorage
const loadState = (): TodosState | undefined => {
  try {
    const serializedState = localStorage.getItem('todosState')
    if (serializedState === null) {
      return undefined
    }
    const parsedState = JSON.parse(serializedState) as TodosState
    // Проверка структуры
    if (parsedState && Array.isArray(parsedState.todos) && parsedState.filter.length) {
      return parsedState
    }
    return undefined
  } catch (err) {
    console.error('Failed to load state from localStorage', err)
    return undefined
  }
}

// Функция для сохранения состояния в localStorage
const saveState = (state: TodosState) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('todosState', serializedState)
  } catch (err) {
    console.error('Failed to save state to localStorage', err)
  }
}

const initialState: TodosState = loadState() || {
  todos: [] as ITodo[],
  filter: 'all' as FilterType
}

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      state.todos.push({
        id: new Date().toISOString(),
        content: action.payload,
        status: StatusEnum.Pending
      })
      saveState(state)
    },
    updateTodo(state, action: PayloadAction<UpdatePayloadType>) {
      const toggledTodo = state.todos.find(todo => todo.id === action.payload.id)


      if (toggledTodo) {
        toggledTodo.status = action.payload.status
        saveState(state)
      }
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload)
      saveState(state)
    },
    deleteCompletedTodo(state) {
      state.todos = state.todos.filter(todo => todo.status !== StatusEnum.Done)
      saveState(state)
    },
    setFilter(state, action: PayloadAction<FilterType>) {
      state.filter = action.payload
      saveState(state)
    },
  }
})

export const { addTodo, updateTodo, deleteTodo, deleteCompletedTodo, setFilter } = todoSlice.actions
export default todoSlice.reducer
