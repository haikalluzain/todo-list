import faker from 'faker';
import moment from "moment"
import { ITask, TaskRepeat } from "../../src/interfaces"
import TaskModel from '../../src/models/Task'

export const createTasks = async (num = 1) => {
  let tasks: ITask[] = []
  const taskRepeat = Object.keys(TaskRepeat)
  for (let i = 0; i < num; i++) {

    const repeat = taskRepeat[faker.datatype.number({ min: 0, max: taskRepeat.length })] as TaskRepeat

    tasks.push({
      title: faker.name.title(),
      pinned: i % 2 === 0,
      pinnedAt: moment().toDate(),
      dueAt: moment().add(faker.datatype.number({ min: 7, max: 21 }), 'days').toDate(),
      remindAt: moment().add(12, 'hours').toDate(),
      repeat,
      notes: faker.lorem.words(10)
    })
  }

  return await TaskModel.insertMany(tasks)

}