import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from '../store/todoSlice'
import { AppDispatch } from '../store'
import styles from './AddTodo.module.scss'

export function AddTodo() {
  const [inputText, setInputText] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()

  const onClick = () => {
    if (inputText.trim().length) {
      dispatch(addTodo(inputText))
    }
    setInputText('')
  }

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.input}
        placeholder="Add todos..."
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onClick()}
      />
      <button className={styles.button} onClick={onClick}>
        Add Todo
      </button>
    </div>
  )
}
