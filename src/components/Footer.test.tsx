import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import todoReducer from '../store/todoSlice'
import { Footer } from './Footer'
import { TodoList } from './TodoList'
import { setFilter } from '../store/todoSlice'
import { FilterType, ITodo } from '../types/types'
import userEvent from '@testing-library/user-event'

beforeAll(() => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  }
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
})

describe('Footer', () => {
  const mockTodos: ITodo[] = [
    { id: '1', content: 'Задача 1', completed: false },
    { id: '2', content: 'Задача 2', completed: true }
  ]

  const createTestStore = (todos: ITodo[] = mockTodos, filter: FilterType = 'all') => {
    return configureStore({
      reducer: { todos: todoReducer },
      preloadedState: {
        todos: { todos, filter }
      }
    })
  }

  it('Проверка правильного отображения количества активных задач', () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    )

    expect(screen.getByText('1 items left')).toBeInTheDocument()
  })

  it('Проверка изменения фильтра при нажатии кнопки', () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    )

    fireEvent.click(screen.getByText('Active'))
    expect(store.getState().todos.filter).toBe('active')

    fireEvent.click(screen.getByText('Completed'))
    expect(store.getState().todos.filter).toBe('completed')

    fireEvent.click(screen.getByText('All'))
    expect(store.getState().todos.filter).toBe('all')
  })

  it('Проверка удаления выполненных задач при нажатии кнопки', () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    )

    fireEvent.click(screen.getByText('Clear Completed'))
    expect(store.getState().todos.todos).toHaveLength(1)
    expect(store.getState().todos.todos[0].id).toBe('1')
  })

  it('Проверка: кнопка удаления выполненных задач неактивна, если выполненных задач нет', () => {
    const store = createTestStore([{ id: '1', content: 'Задача', completed: false }])

    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    )

    expect(screen.getByText('Clear Completed')).toBeDisabled()
  })
})

describe('Интеграция Footer и TodoList', () => {
  const mockTodos: ITodo[] = [
    { id: '1', content: 'Активная задача', completed: false },
    { id: '2', content: 'Завершенная задача', completed: true }
  ]

  const createTestStore = (todos: ITodo[] = mockTodos, filter: FilterType = 'all') => {
    return configureStore({
      reducer: { todos: todoReducer },
      preloadedState: {
        todos: { todos, filter }
      }
    })
  }

  it('Проверка корректности работы фильтрации задач', async () => {
    const store = createTestStore()
    
    render(
      <Provider store={store}>
        <TodoList />
        <Footer />
      </Provider>
    )
    
    // Проверка, что сначала показаны все задачи
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    
    // Фильтрация по активным задачам
    await userEvent.click(screen.getByText('Active'))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Активная задача')).toBeInTheDocument()
    
    // Фильтрация по завершенным задачам
    await userEvent.click(screen.getByText('Completed'))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Завершенная задача')).toBeInTheDocument()
  })
})
