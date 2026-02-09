import { Request, Response, NextFunction } from 'express';


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const resAny = res as any;
  if (typeof resAny.sendError === 'function') {
    resAny.status(err.status || 500);
    resAny.sendError(err, err.status || 500);
  } else {
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  }
};

export default errorHandler;
