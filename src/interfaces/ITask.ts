import { IUser } from "@interfaces/IUser";

export enum TaskRepeat {
  DAILY = 'DAILY',
  WEEKDAYS = 'WEEKDAYS',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export type TaskRepeatString = keyof typeof TaskRepeat

export interface ITask {
  _id?: string
  title: string
  notes: string
  pinned: boolean
  user?: IUser
  dueAt?: Date
  remindAt?: Date
  repeat: TaskRepeatString
  pinnedAt: Date
  createdAt?: Date
  updatedAt?: Date
}