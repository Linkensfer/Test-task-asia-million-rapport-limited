import { AddTodo } from './components/AddTodo'
import { TodoList } from './components/TodoList'
import styles from './App.module.scss'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import { Footer } from './components/Footer'

function App() {
  const todos = useSelector((state: RootState) => state.todos.todos)

  return (
    <div className={styles.wrapper}>
      <AddTodo/>

      {todos.length ? (
        <>
          <TodoList />
          <Footer />
        </>
      ) : (
        <div className={styles.text}>Пока нет задач</div>
      )}

    </div>
  )
}

export default App
