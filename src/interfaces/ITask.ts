import { IUser } from "@interfaces";

export enum TaskRepeat {
  Daily = 'DAILY',
  WeekDays = 'WEEKDAYS',
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY',
  Yearly = 'YEARLY'
}

export interface ITask {
  _id?: string
  title: string
  notes: string
  pinned: boolean
  user: IUser
  dueAt?: Date
  remindAt?: Date
  repeat: boolean
  pinnedAt: Date
  createdAt?: Date
  updatedAt?: Date
}