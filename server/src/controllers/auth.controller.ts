import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.register({ name, email, password });
      ApiResponse.success(res, 'User registered successfully', result, 201);
    } catch (error: any) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      ApiResponse.success(res, 'Logged in successfully', result, 200);
    } catch (error: any) {
      ApiResponse.error(res, error.message || 'Authentication failed', null, 401);
    }
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, 'Unauthorized', null, 401);
        return;
      }
      const user = await AuthService.getMe(req.user.userId);
      if (!user) {
        ApiResponse.error(res, 'User not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'User profile fetched successfully', user, 200);
    } catch (error: any) {
      next(error);
    }
  }
}
