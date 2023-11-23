import { errorResponse, responseNotFound } from '../utils/response';
import Logger from './logger';
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import config from '../config';
import routes from '../api/routes';
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

export default (app: express.Application) => {
  /**
   * Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
   * It shows the real origin IP in the heroku or Cloudwatch logs
   */
  app.enable('trust proxy');

  /**
   * The magic package that prevents frontend developers going nuts
   * Alternate description:
   * Enable Cross Origin Resource Sharing to all origins by default
   */
  app.use(cors());

  // Transforms the raw string of req.body into json
  app.use(express.json());

  // Load API routes
  app.use(config.api.prefix, routes);

  /// catch not found route (404) and forward to error handler
  app.use((req: Request, res: Response) => {
    responseNotFound(res)
  });

  /**
   * All the error response (that not expected) will be generated from here
   * Also we log all the message to the error.log file
   */
  app.use((err: { status: number, message: string, stack: any }, req: Request, res: Response, next: NextFunction) => {
    Logger.error(err.stack)
    const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR
    let message = getReasonPhrase(status)
    errorResponse(res, status, message)
  });
}
