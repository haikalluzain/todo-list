import { Request, Response } from "express"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import * as Yup from "yup"
import { ObjectShape } from "yup/lib/object"

/**
 *
 * @param req
 * @param payload
 */
export const validate = (
  req: Request,
  payload: ObjectShape
) => {
  return Yup.object().shape(payload).validate(req.body, { abortEarly: false })
}

/**
 *
 * @param error
 * @param res
 */
export const validationError = (error: any, res: Response) => {
  const errors: any = {}
  error.inner.forEach((item: any) => {
    errors[item.path] = item.message
  })

  return res.status(422).json({
    error: {
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      message: ReasonPhrases.UNPROCESSABLE_ENTITY,
      errors,
    },
  })

  // if (Object.keys(errors).length > 0) {
  //   return false
  // }

  // return true
}
