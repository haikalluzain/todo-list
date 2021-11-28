import UserModel from '@models/User';
import { NextFunction, Request, Response } from "express"
import { IUser } from "@interfaces";
import jwt from 'jsonwebtoken'
import config from "@config";
import Logger from '@lib/logger'
import { responseBadRequest, responseUnauthorized } from "@utils/response";

export interface RequestWithAuth extends Request {
  user: IUser
}

/**
 * We are assuming that the JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 *
 * But it could come in a query parameter with the name that you want like
 * GET https://my-api.com/stats?apiKey=${JWT}
 * Luckily this API follow _common sense_ ergo a _good design_ and don't allow that ugly stuff
 */

const getTokenFormHeader = (req: Request) => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   * So I believe that this should handle more 'edge' cases ;)
   */
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1]
  }

  return null
}

const authMiddleware = async (
  req: RequestWithAuth,
  res: Response,
  next: NextFunction
) => {
  try {

    const token = getTokenFormHeader(req)
  
    if (!token) {
      return responseUnauthorized(res)
    }

    const decode: any = jwt.verify(token.toString(), config.jwtSecret)
    const user = await UserModel.findById(decode._id)
    req.user = user
    
    return next()
  } catch (err) {
    Logger.error(err)
    responseBadRequest(res, "Invalid Token!")
  }
}

export default authMiddleware