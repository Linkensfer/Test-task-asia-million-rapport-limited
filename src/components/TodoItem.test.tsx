import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import todoReducer from '../store/todoSlice'
import { TodoItem } from './TodoItem'
import { TodoList } from './TodoList' 
import { FilterType, ITodo, StatusEnum } from '../types/types'
import userEvent from '@testing-library/user-event'

beforeAll(() => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  }
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
})

describe('TodoItem', () => {
  const mockTodo: ITodo = {
    id: '1',
    content: 'Тестовая задача',
    status: StatusEnum.Pending
  }

  it('Проверка корректного отображения элемента todo', () => {
    const store = configureStore({ reducer: { todos: todoReducer } })

    render(
      <Provider store={store}>
        <TodoItem unitElement={mockTodo} />
      </Provider>
    )

    expect(screen.getByText('Тестовая задача')).toBeInTheDocument()
    expect(screen.getByRole('listitem')).toHaveClass('pending')
  })

  it('Проверка смены статуса задачи при нажатии', async () => {
    const store = configureStore({
      reducer: { todos: todoReducer },
      preloadedState: {
        todos: {
          todos: [mockTodo],
          filter: 'all' as FilterType
        }
      }
    })

    render(
      <Provider store={store}>
        <TodoItem unitElement={mockTodo} />
      </Provider>
    )

    await userEvent.click(screen.getByRole('status_button'))
    await userEvent.click(screen.getByRole('done'))
    expect(store.getState().todos.todos[0].status === StatusEnum.Done).toBe(true)
  })
})

describe('Интеграция TodoItem с фильтрами', () => {
  const todos = [
    { id: '1', content: 'Активная задача', status: StatusEnum.InProgress },
    { id: '2', content: 'Завершенная задача', status: StatusEnum.Done }
  ]

  it('Задача не отображается при фильтре "active", если она завершена', () => {
    const store = configureStore({
      reducer: { todos: todoReducer },
      preloadedState: {
        todos: {
          todos,
          filter: 'active' as FilterType
        }
      }
    })

    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    )

    expect(screen.queryByText('Завершенная задача')).not.toBeInTheDocument()
    expect(screen.getByText('Активная задача')).toBeInTheDocument()
  })
})
