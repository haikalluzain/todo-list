import userController from '../../api/controllers/userController'
import authMiddleware from '../../api/middlewares/authMiddleware'
import { Router } from 'express'

const router = Router()

router
.route('/')
.get(authMiddleware, userController.getUser)

const userRoute = router
export default userRoute