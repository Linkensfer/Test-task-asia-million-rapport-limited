import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "../store"
import { deleteCompletedTodo, setFilter } from "../store/todoSlice"
import { AppDispatch } from '../store'
import styles from './Footer.module.scss'
import { StatusEnum } from '../types/types'

export function Footer() {
  const todos = useSelector((state: RootState) => state.todos.todos)
  const dispatch = useDispatch<AppDispatch>()
  const countLeftTodo = todos.filter(todo => todo.status !== StatusEnum.Done).length
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.count}>{countLeftTodo} items left</div>

      <div className={styles.filters}>
        <button 
          className={styles.filterButton} 
          onClick={() => dispatch(setFilter('all'))}
        >
          All
        </button>
        <button 
          className={styles.filterButton} 
          onClick={() => dispatch(setFilter('pending'))}
        >
          Pending
        </button>
        <button 
          className={styles.filterButton} 
          onClick={() => dispatch(setFilter('active'))}
        >
          Active
        </button>
        <button 
          className={styles.filterButton} 
          onClick={() => dispatch(setFilter('completed'))}
        >
          Completed
        </button>
        <button 
          className={styles.clearButton}
          onClick={() => dispatch(deleteCompletedTodo())}
          disabled={!todos.some(todo => todo.status === StatusEnum.Done)}
        >
          Clear Completed
        </button>
      </div>
    </div>
  )
}
