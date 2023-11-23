import express from "express";
import config from '../config';
// import Logger from '../lib/logger';
import expressLoader from '../lib/express'
import mongooseLoader from '../lib/mongoose'
  
const app = express()

async function startServer(app: express.Application) {
  try {
    
    /**
     * A little hack here
     * Import/Export can only be used in 'top-level code'
     * Well, at least in node 10 without babel and at the time of writing
     * So we are using good old require.
     **/
    // await require('./lib').default({ expressApp: app });

    expressLoader(app);
    // Logger.info('Express loaded');

    if (config.env !== config.app.stage.test) {
      await mongooseLoader()
      // Logger.info('DB Loaded and connected!')

      // app.listen(config.port, () => {
      //   Logger.info(`
      //   ####################################
      //   #  Server listening on port: ${config.port}  #
      //   ####################################
      //   `)
      // })
    }

  } catch (error) {
    // Logger.error(error.message)
    process.exit(1)
  }
}

startServer(app)

export default app