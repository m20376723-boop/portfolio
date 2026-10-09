import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing: string[] = [];
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      ApiResponse.error(
        res,
        `Validation failed: Missing required fields (${missing.join(', ')})`,
        { missingFields: missing },
        400
      );
      return;
    }
    next();
  };
};

export const validateEmail = (req: Request, res: Response, next: NextFunction): void => {
  const { email } = req.body;
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    ApiResponse.error(res, 'Validation failed: Invalid email format', null, 400);
    return;
  }
  next();
};
