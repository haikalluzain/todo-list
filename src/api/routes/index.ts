import { Router } from 'express'
import authRoute from './auth'
import taskRoute from './task'
import userRoute from './user'

const router = Router()

interface routeInterface {
  path: string
  route: Router
}

const routes: routeInterface[] = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/task',
    route: taskRoute
  }
]

routes.forEach((route) => {
  router.use(route.path, route.route)
})

export default router