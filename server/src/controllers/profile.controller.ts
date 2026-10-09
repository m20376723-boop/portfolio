import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service';
import { ApiResponse } from '../utils/apiResponse';

export class ProfileController {
  static async getProfile(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await ProfileService.getProfile();
      ApiResponse.success(res, 'Profile fetched successfully', profile, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedProfile = await ProfileService.updateProfile(req.body);
      ApiResponse.success(res, 'Profile updated successfully', updatedProfile, 200);
    } catch (error: any) {
      next(error);
    }
  }
}
