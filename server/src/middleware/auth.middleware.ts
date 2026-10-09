import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyToken } from '../utils/jwt';
import { ApiResponse } from '../utils/apiResponse';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ApiResponse.error(res, 'Authentication token missing or invalid format', null, 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      ApiResponse.error(res, 'Authentication token not provided', null, 401);
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      ApiResponse.error(res, 'Session token expired. Please login again.', null, 401);
      return;
    }
    ApiResponse.error(res, 'Invalid or malformed authentication token', null, 401);
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    ApiResponse.error(res, 'Access forbidden. Administrator privileges required.', null, 403);
    return;
  }
  next();
};
