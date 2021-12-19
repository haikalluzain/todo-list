import { generateToken } from "@lib/token"
import UserModel from "@models/User"
import { generateHash } from "@utils/password"
import { responseNotFound, responseUnprocessable, successResponse } from "@utils/response"
import { validate, validationError } from "@utils/validation"
import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import * as Yup from 'yup'

/**
 * Register function
 * @return {IUser} data
 */
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validation
    try {
      await validate(req, {
        name: Yup.string().required().min(3),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(8)
      })
    } catch (e) {
      return validationError(e, res)
    }

    const { name, email, password } = req.body

    if (await UserModel.isEmailTaken(email)) {
      return responseUnprocessable(res, 'This email is already registered')
    }

    const generatedPassword = await generateHash(password)

    const user = await UserModel.create({
      name,
      email,
      password: generatedPassword
    })

    return successResponse(res, 'Successfully registered the user', user)
  } catch (error) {
    next(error)
  }
}

/**
 * Login function
 * @return {string} token
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validation
    try {
      await validate(req, {
        email: Yup.string().email().required(),
        password: Yup.string().required().min(8)
      })
    } catch (e) {
      return validationError(e, res)
    }

    const { email, password } = req.body

    const user = await UserModel.findOne({ email }).select('+password')

    if (!user) {
      return responseNotFound(res, 'The email is not in our record')
    }

    if (await user.isPasswordMatch(password)) {
      // Create jwt
      const token = generateToken({ _id: user._id, name: user.name })

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Successfully logged in',
        token
      })
    } else {
      return responseUnprocessable(res, 'Invalid password')
    }
  } catch (error) {
    return next(error)
  }
}

export = {
  register,
  login
}
