/* eslint-disable @typescript-eslint/consistent-type-imports */
type ObjectId = import('mongoose').Types.ObjectId;
type Permission = import('./models/User').Permission;
type IUser = import('./models/User').IUser;
type HydratedUser = import('mongoose').HydratedDocument<IUser>;

declare namespace Express {
  export interface Request {
    user: User;
  }

  export type User = HydratedUser;

  export interface Response {
    sendSuccess: (data: unknown, message?: string) => void;
    sendError: (error: unknown, errorCode?: number, errorData?: unknown) => void;
  }
}
