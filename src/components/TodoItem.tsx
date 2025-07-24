import { memo } from "react"
import { ITodo } from "../types/types"
import { RemoveTodo } from "./RemoveTodo"
import { useDispatch } from 'react-redux'
import { updateTodo } from "../store/todoSlice"
import { AppDispatch } from '../store'
import styles from './TodoItem.module.scss'

interface TodoItemProps {
  unitElement: ITodo
}

export const TodoItem = memo(
  function TodoItem({ unitElement }: TodoItemProps) {
    const dispatch = useDispatch<AppDispatch>()
    return (
      <div className={styles.elem} role="listitem">
        <div className={styles.content} onClick={() => dispatch(updateTodo(unitElement.id))}>
          <input
            type="checkbox"
            checked={unitElement.completed}
            onChange={() => {}}
            className={styles.checkbox}
          />
          <span className={`${styles.text} ${unitElement.completed ? styles.completed : ''}`}>
            {unitElement.content}
          </span>
        </div>
        <RemoveTodo id={unitElement.id} />
      </div>
    )
  }
)
