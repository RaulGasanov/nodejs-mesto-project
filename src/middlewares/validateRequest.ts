import { Request, Response, NextFunction } from "express";
import { requestSchema } from "../validation";
import { ValidationError } from "../errors/validationError";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = requestSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }
  next();
};
