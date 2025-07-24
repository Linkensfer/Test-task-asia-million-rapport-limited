import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import todoReducer from '../store/todoSlice'
import { AddTodo } from './AddTodo'
import { RootState } from '../store'

beforeAll(() => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  }
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
})

describe('AddTodo', () => {
  const createTestStore = () => {
    return configureStore({
      reducer: {
        todos: todoReducer
      }
    })
  }

  it('Проверка рендера input и button', () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <AddTodo />
      </Provider>
    )

    expect(screen.getByPlaceholderText('Add todos...')).toBeInTheDocument()
    expect(screen.getByText('Add Todo')).toBeInTheDocument()
  })

  it('Проверка добавления новой задачи по нажатию кнопки', () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <AddTodo />
      </Provider>
    )

    const input = screen.getByPlaceholderText('Add todos...')
    const button = screen.getByText('Add Todo')

    fireEvent.change(input, { target: { value: 'Новая задача' } })
    fireEvent.click(button)

    const state = store.getState() as RootState
    expect(state.todos.todos).toHaveLength(1)
    expect(state.todos.todos[0].content).toBe('Новая задача')
  })

  it('Проверка добавления новой задачи при нажатии клавиши Enter', () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <AddTodo />
      </Provider>
    )

    const input = screen.getByPlaceholderText('Add todos...')
    fireEvent.change(input, { target: { value: 'Задача 2' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    const state = store.getState() as RootState
    expect(state.todos.todos).toHaveLength(1)
    expect(state.todos.todos[0].content).toBe('Задача 2')
  })

  it('Проверка: пустые задачи не добавляются', () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <AddTodo />
      </Provider>
    )

    const button = screen.getByText('Add Todo')
    fireEvent.click(button)

    const state = store.getState() as RootState
    expect(state.todos.todos).toHaveLength(0)
  })

  it('Проверка очистки input после добавления задачи', () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <AddTodo />
      </Provider>
    )
  
    const input = screen.getByPlaceholderText('Add todos...')
    fireEvent.change(input, { target: { value: 'Новая задача' } })
    fireEvent.click(screen.getByText('Add Todo'))
  
    expect((input as HTMLInputElement).value).toBe('')
  })
})
