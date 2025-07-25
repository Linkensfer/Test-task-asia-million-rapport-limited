import { memo } from "react"
import { ITodo, StatusEnum } from "../types/types"
import { RemoveTodo } from "./RemoveTodo"
import styles from './TodoItem.module.scss'
import { ActionButton } from "./ActionButton"

interface TodoItemProps {
  unitElement: ITodo
}

function getStatusColorClass(status: StatusEnum) {
  switch (status) {
    case StatusEnum.Pending:
      return styles.pending
    case StatusEnum.InProgress:
      return styles.progress
    case StatusEnum.Done:
        return styles.done
    default:
      return styles.pending
  }
}

export const TodoItem = memo(
  function TodoItem({ unitElement }: TodoItemProps) {
    const statusColor = getStatusColorClass(unitElement.status)

    return (
      <div className={`${styles.elem} ${statusColor}`} role="listitem">
        <div className={styles.content}>
          <span className={`${styles.text} ${unitElement.status === StatusEnum.Done ? styles.completed : ''}`}>
            {unitElement.content}
          </span>
        </div>

        <ActionButton id={unitElement.id} activeStatus={unitElement.status} />

        <RemoveTodo id={unitElement.id} />
      </div>
    )
  }
)
