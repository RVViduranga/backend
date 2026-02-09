import { Request, Response, NextFunction } from 'express';

const role = function(roles: string[] | string = []) {
  if (typeof roles === 'string') roles = [roles];
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

export default role;
