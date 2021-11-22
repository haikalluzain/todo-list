import expressLoader from './express'
import mongooseLoader from './mongoose'
import Logger from './logger'
// import scheduler from './scheduler'

export default async ({ expressApp }) => {
  try {
    await mongooseLoader()
    Logger.info('DB Loaded and connected!')

    expressLoader({ app: expressApp });
    Logger.info('Express loaded');

    // scheduler()
    // Logger.info("Scheduler is ready")

  } catch (error) {
    Logger.error(error.message)
    process.exit()
  }
}