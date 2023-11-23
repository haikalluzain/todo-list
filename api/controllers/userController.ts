import { RequestWithAuth } from "../../api/middlewares/authMiddleware";
import { successResponse } from "../../utils/response";
import { NextFunction, Request, Response } from "express";


const getUser = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  try {
    return successResponse(res, "Get the user data", req.user)
  } catch (error) {
    next(error)
  }
}

export = {
  getUser
}