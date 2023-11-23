import { Router } from 'express'
import authController from '../../api/controllers/authController'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)

const authRoute = router
export default authRoute