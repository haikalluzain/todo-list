import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

/**
 * Success response
 * @param res 
 * @param message 
 * @param data 
 * @param statusCode
 */
export const successResponse = (res: Response, message: string, data: any = null, statusCode: number = StatusCodes.OK) => {
  res.status(statusCode).json({
    statusCode,
    message,
    data
  })
}

/**
 * Error response
 * @param res
 * @param statusCode
 * @param message
 */
export const errorResponse = (res: Response, statusCode: number, message: string) => {
  res.status(statusCode).json({
    error: {
      statusCode,
      message
    }
  })
}

export const responseNotFound = (
  res: Response,
  message: string = ReasonPhrases.NOT_FOUND
) => {
  return errorResponse(res, StatusCodes.NOT_FOUND, message)
}

export const responseUnauthorized = (res: Response) => {
  return errorResponse(res, StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
}

export const responseUnprocessable = (
  res: Response,
  message: string = ReasonPhrases.UNPROCESSABLE_ENTITY
) => {
  return errorResponse(res, StatusCodes.UNPROCESSABLE_ENTITY, message)
}

export const responseBadRequest = (
  res: Response,
  message: string = ReasonPhrases.BAD_REQUEST
) => {
  return errorResponse(res, StatusCodes.BAD_REQUEST, message)
}
