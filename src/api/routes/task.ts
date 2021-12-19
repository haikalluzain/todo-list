import { Router } from 'express'
import taskController from '@api/controllers/taskController'
import authMiddleware from '@api/middlewares/authMiddleware'

const taskRoute = Router()

taskRoute.post('/', authMiddleware, taskController.createTask)
taskRoute.get('/', authMiddleware, taskController.getTaskList)
taskRoute.put('/:id', authMiddleware, taskController.updateTask)
taskRoute.delete('/:id', authMiddleware, taskController.deleteTask)

export default taskRoute
