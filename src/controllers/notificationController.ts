import { getPaginatedData } from '../services/paginationService';
import { Request, Response, NextFunction } from 'express';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPaginatedData(Notification, req.query);
    (res as any).sendSuccess(result, 'Notifications fetched');
  } catch (err) {
    next(err);
  }
};

export const markAsRead = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement mark as read logic
  (res as any).sendSuccess(null, 'markAsRead not implemented');
};
