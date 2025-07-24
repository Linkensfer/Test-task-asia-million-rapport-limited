import { TodoItem } from "./TodoItem"
import { useSelector } from 'react-redux'
import { RootState } from "../store"
import styles from './TodoList.module.scss'

export function TodoList() {
  const todos = useSelector((state: RootState) => state.todos.todos)
  const filter = useSelector((state: RootState) => state.todos.filter)

  const filteredTodos = filter === 'all' ? todos : 
    todos.filter(todo => filter === 'active' ? !todo.completed : todo.completed)
  
  return (
    <div className={styles.list} role="list">
      {filteredTodos.map(unitElement => (
        <TodoItem
          key={unitElement.id}
          unitElement={unitElement}
        />
      ))}
    </div>
  )
}
