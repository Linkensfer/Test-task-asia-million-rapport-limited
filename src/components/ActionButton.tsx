import { useEffect, useRef, useState } from 'react'
import styles from './ActionButton.module.scss'
import { StatusEnum } from '../types/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { updateTodo } from '../store/todoSlice'

interface IProps {
    id: string
    activeStatus: StatusEnum
}

const DEFAULT_OPTIONS = [
    {
        key: StatusEnum.Pending,
        value:'В ожидании',
     },
     {
        key: StatusEnum.InProgress,
        value:'В прогрессе',
     },
     {
        key: StatusEnum.Done,
        value:'Выполнено',
     }
]

export function ActionButton({ id, activeStatus }: IProps) {
    const dispatch = useDispatch<AppDispatch>()
    const [showOptions, setShowOptions] = useState(false)
    const divRef = useRef<HTMLDivElement>(null)
  
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        onClose() // Закрыть, если кликнули вне элемента
      }
    }
  
    useEffect(() => {
      // Добавляем слушателя события при монтировании компонента
      document.addEventListener('mousedown', handleClickOutside)
  
      // Удаляем слушателя при размонтировании компонента
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])

    const onToggle = () => {
        setShowOptions(prev => !prev)
    }

    const onClose = () => {
        setShowOptions(false)
    }

    const onClickOption = (status: StatusEnum) => {
        onClose()
        dispatch(updateTodo({id: id, status}))
    }

  return (
    <div className={styles.root}>
        <div onClick={onToggle} className={styles.wrapper} role='status_button'>
            <svg viewBox="64 64 896 896" focusable="false" data-icon="more" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M456 231a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0z">
            </path>
            </svg>
        </div>
        {showOptions && (
            <div ref={divRef} className={styles.options}>
                {DEFAULT_OPTIONS
                    .filter((option) => option.key !== activeStatus)
                    .map((option) => (
                        <div className={styles.option}
                            key={option.key}
                            role={option.key}
                            onClick={() => onClickOption(option.key)}
                        >
                            {option.value}
                        </div>
                    ))}
            </div>
        )}
    </div>
  )
}
