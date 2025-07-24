import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteTodo } from '../store/todoSlice'
import { AppDispatch } from '../store'
import styles from './RemoveTodo.module.scss'

interface RemoveTodoProps {
  id: string
}

export function RemoveTodo({ id }: RemoveTodoProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDeleteAndClose = () => {
    dispatch(deleteTodo(id))
    setOpen(false)
  }

  return (
    <>
      <button className={styles.deleteButton} onClick={handleClickOpen} aria-label="Удалить задачу">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#00838F"/>
        </svg>
      </button>

      {open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Удаление элемента</h3>
            <p className={styles.modalText}>Вы действительно хотите удалить задачу?</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={handleClose}>Отмена</button>
              <button className={styles.confirmButton} onClick={handleDeleteAndClose}>Да</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
