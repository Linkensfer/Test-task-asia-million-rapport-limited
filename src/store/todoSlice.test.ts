import todoReducer, {
  addTodo,
  updateTodo,
  deleteTodo,
  deleteCompletedTodo,
  setFilter
} from './todoSlice'
import { ITodo, StatusEnum } from "../types/types"

const localStorageMock = (function() {
  let store: Record<string, string> = {}

  return {
    getItem(key: string) {
      return store[key] || null
    },
    setItem(key: string, value: string) {
      store[key] = value.toString()
    },
    clear() {
      store = {}
    }
  }
})()

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  })
})

beforeEach(() => {
  localStorage.clear()
})

describe('todoSlice', () => {
  const initialState = {
    todos: [] as ITodo[],
    filter: 'all' as const
  }

  it('Проверка обработки начального состояния', () => {
    expect(todoReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('Проверка обработки addTodo', () => {
    const content = 'Новая задача'
    const actual = todoReducer(initialState, addTodo(content))
    
    expect(actual.todos).toHaveLength(1)
    expect(actual.todos[0].content).toEqual(content)
    expect(actual.todos[0].status).toBe(StatusEnum.Pending)
    expect(localStorage.getItem('todosState')).not.toBeNull()
  })

  it('Проверка обработки updateTodo', () => {
    const todo = { id: '1', content: 'Test', status: StatusEnum.Pending }
    const state = { ...initialState, todos: [todo] }
    
    const actual = todoReducer(state, updateTodo({id: '1', status: StatusEnum.Done}))
    expect(actual.todos[0].status).toBe(StatusEnum.Done)
    expect(localStorage.getItem('todosState')).not.toBeNull()
  })

  it('Проверка обработки deleteTodo', () => {
    const todo = { id: '1', content: 'Test', status: StatusEnum.Pending }
    const state = { ...initialState, todos: [todo] }
    
    const actual = todoReducer(state, deleteTodo('1'))
    expect(actual.todos).toHaveLength(0)
    expect(localStorage.getItem('todosState')).not.toBeNull()
  })

  it('Проверка обработки deleteCompletedTodo', () => {
    const todos = [
      { id: '1', content: 'Задача 1', status: StatusEnum.Pending },
      { id: '2', content: 'Задача 2', status: StatusEnum.Done }
    ]
    const state = { ...initialState, todos }
    
    const actual = todoReducer(state, deleteCompletedTodo())
    expect(actual.todos).toHaveLength(1)
    expect(actual.todos[0].id).toBe('1')
    expect(localStorage.getItem('todosState')).not.toBeNull()
  })

  it('Проверка обработки setFilter', () => {
    const actual = todoReducer(initialState, setFilter('active'))
    expect(actual.filter).toBe('active')
    expect(localStorage.getItem('todosState')).not.toBeNull()
  })
})
