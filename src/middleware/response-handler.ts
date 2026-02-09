import type { NextFunction, Request, Response } from 'express';
// import { ErrorLogger } from '../common/logging'; // Uncomment and adjust if you have a logger

export function ResponseHandler(req: Request, res: Response, next: NextFunction) {
  const resAny = res as any;
  resAny.sendSuccess = (data: unknown, message: string | null = null) => {
    res.send({ success: true, data, message });
  };
  resAny.sendError = (error: unknown, errorCode: unknown = 0, errorData: unknown = undefined) => {
    if (typeof error === 'string') {
      res.send({ success: false, error, errorCode, errorData });
    } else {
      if (!error) {
        error = { stack: null, message: "Unknown Error" };
      }
      // ErrorLogger.error((error as Error).stack); // Uncomment if you have a logger
      res.send({ success: false, error: (error as Error).message, errorData: error, errorCode });
    }
  };
  next();
}
