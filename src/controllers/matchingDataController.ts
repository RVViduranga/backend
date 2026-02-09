import { Request, Response, NextFunction } from 'express';
import MatchingData from '../models/MatchingData';

export const getMatchingData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const filters = { ...req.query };
    delete filters.page;
    delete filters.pageSize;
    delete filters.sortBy;
    delete filters.sortOrder;

    Object.keys(filters).forEach(key => {
      if (filters[key] === '' || filters[key] === undefined) delete filters[key];
    });

    const query = MatchingData.find(filters)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const [data, total] = await Promise.all([
      query,
      MatchingData.countDocuments(filters)
    ]);

    (res as any).sendSuccess({ data, total }, 'Matching data fetched');
  } catch (err) {
    next(err);
  }
};

export const createMatchingData = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement create matching data logic
  (res as any).sendSuccess(null, 'createMatchingData not implemented');
};
