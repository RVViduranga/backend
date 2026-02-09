import { Request, Response, NextFunction } from 'express';

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement file upload logic
  (res as any).sendSuccess(null, 'uploadFile not implemented');
};

export const getFile = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement get file logic
  (res as any).sendSuccess(null, 'getFile not implemented');
};
