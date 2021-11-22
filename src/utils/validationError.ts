import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const validationError = (e: any, res: Response) => {
  const errors: any = {}
  e.inner.forEach((item: any) => {
    errors[item.path] = item.message
  })

  res.status(422).json({ 
    error: {
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      message: ReasonPhrases.UNPROCESSABLE_ENTITY,
      errors
    } 
  })

  if (Object.keys(errors).length > 0) {
    return false
  }

  return true
}
