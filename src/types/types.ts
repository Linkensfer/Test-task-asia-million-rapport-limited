export const enum StatusEnum {
  Pending = 'pending',
  InProgress = 'in_progress',
  Done = 'done'
}

export interface ITodo {
  id: string
  content: string
  status: StatusEnum
}

export type FilterType = 'all' | 'pending' | 'active' | 'completed'
