import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import todoReducer from '../store/todoSlice'
import { TodoList } from './TodoList'
import { FilterType, ITodo } from '../types/types'
import userEvent from '@testing-library/user-event'
import { Footer } from './Footer'

beforeAll(() => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  }
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
})

describe('TodoList', () => {
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

  it('Проверка отображения всех задач, если фильтр установлен на all', () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Задача 1')).toBeInTheDocument()
    expect(screen.getByText('Задача 2')).toBeInTheDocument()
  })

  it('Проверка отображения только активных задач при фильтре "active"', () => {
    const store = createTestStore(mockTodos, 'active')

    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Задача 1')).toBeInTheDocument()
    expect(screen.queryByText('Задача 2')).not.toBeInTheDocument()
  })

  it('Проверка отображения только завершенных задач при фильтре "completed"', () => {
    const store = createTestStore(mockTodos, 'completed')

    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.queryByText('Задача 1')).not.toBeInTheDocument()
    expect(screen.getByText('Задача 2')).toBeInTheDocument()
  })

  it('Проверка отображения пустого списка', () => {
    const store = createTestStore([], 'all')

    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    )

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('Проверка фильтрации задач по статусу', async () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <TodoList />
        <Footer />
      </Provider>
    )
  
    // Изначально должны отображаться все задачи
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  
    // Переключение на активные
    await userEvent.click(screen.getByText('Active'))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Задача 1')).toBeInTheDocument()
  
    // Переключение на завершенные
    await userEvent.click(screen.getByText('Completed'))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Задача 2')).toBeInTheDocument()
  
    // Переключение на все задачи
    await userEvent.click(screen.getByText('All'))
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})
