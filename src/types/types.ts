export interface ITodo {
  id: string
  content: string
  completed: boolean
}

export type FilterType = 'all' | 'active' | 'completed'
