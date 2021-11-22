import { successResponse } from "@utils/response";
import { NextFunction, Request, Response } from "express";


const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return successResponse(res, "Get the user data", req.user)
  } catch (error) {
    next(error)
  }
}

export = {
  getUser
}