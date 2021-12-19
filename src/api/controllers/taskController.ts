import { RequestWithAuth } from '@api/middlewares/authMiddleware';
import {ITask, TaskRepeat} from "@interfaces/ITask";
import { validate, validationError } from "@utils/validation";
import { NextFunction, Response } from "express";
import TaskModel from "@models/Task"
import * as Yup from 'yup'
import {responseNotFound, successResponse} from '@utils/response';


const validateTask = async (req: RequestWithAuth, res: Response) => {
    return await validate(req, {
      title: Yup.string().required(),
      pinned: Yup.boolean().nullable(),
      pinnedAt: Yup.date().nullable(),
      dueAt: Yup.date().nullable(),
      remindAt: Yup.date().nullable(),
      repeat: Yup.string().oneOf(Object.values(TaskRepeat)).nullable(),
      notes: Yup.string().nullable()
    })
}
/**
 * Get the list of task
 * @return {ITask[]} data
 */
const getTaskList = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  try {
    const data = await TaskModel.find({}).populate('user')
    return successResponse(res, 'Get the list of task', data)
  } catch (error) {
    next(error)
  }
}

const createTask = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  try {
    //validation
    try {
      await validateTask(req, res)
    } catch (e) {
      return validationError(e, res)
    }

    const { title, pinned, pinnedAt, dueAt, remindAt, repeat, notes } = req.body

    const task = await TaskModel.create({
      title,
      pinned,
      pinnedAt,
      dueAt,
      remindAt,
      repeat,
      notes,
      user: req.user._id
    })

    return successResponse(res, 'Successfully created the task', task)
  } catch (error) {
    next(error)
  }
}

/**
 * Update the task
 * @return {ITask} data
 */
const updateTask = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id

    //validation
    try {
      await validateTask(req, res)
    } catch (e) {
      return validationError(e, res)
    }

    const { title, pinned, pinnedAt, dueAt, remindAt, repeat, notes } = req.body

    const task = await TaskModel.findById(id)
    if (!task) {
      return responseNotFound(res, 'Task is not found')
    }
    task.title = title
    task.pinned = pinned
    task.pinnedAt = pinnedAt
    task.dueAt = dueAt
    task.remindAt = remindAt
    task.repeat = repeat
    task.notes = notes
    await task.save()

    return successResponse(res, 'Successfully updated the task', task)

  } catch (error) {
    next(error)
  }
}

/**
 * Update the task
 * @return {ITask} data
 */
const deleteTask = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id

    const task = await TaskModel.findById(id)
    if (!task) {
      return responseNotFound(res, 'Task is not found')
    }
    await task.deleteOne()

    return successResponse(res, 'Successfully deleted the task')

  } catch (error) {
    next(error)
  }
}

export = {
  getTaskList,
  createTask,
  updateTask,
  deleteTask
}
