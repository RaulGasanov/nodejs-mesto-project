import { Request, Response, NextFunction } from "express";
import { errorLogger, requestLogger } from "../logger";

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  requestLogger.info({
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });
  next();
};

export const logError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorLogger.error({
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    error: {
      message: err.message,
      stack: err.stack,
    },
  });
  next(err);
};
