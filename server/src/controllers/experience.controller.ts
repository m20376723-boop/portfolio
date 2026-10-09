import { Request, Response, NextFunction } from 'express';
import { ExperienceService } from '../services/experience.service';
import { ApiResponse } from '../utils/apiResponse';

export class ExperienceController {
  static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const experiences = await ExperienceService.getAll();
      ApiResponse.success(res, 'Work experiences fetched successfully', experiences, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const exp = await ExperienceService.getById(req.params.id);
      if (!exp) {
        ApiResponse.error(res, 'Experience record not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Experience fetched successfully', exp, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const exp = await ExperienceService.create(req.body);
      ApiResponse.success(res, 'Experience created successfully', exp, 201);
    } catch (error: any) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const exp = await ExperienceService.update(req.params.id, req.body);
      if (!exp) {
        ApiResponse.error(res, 'Experience record not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Experience updated successfully', exp, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const exp = await ExperienceService.delete(req.params.id);
      if (!exp) {
        ApiResponse.error(res, 'Experience record not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Experience deleted successfully', { id: req.params.id }, 200);
    } catch (error: any) {
      next(error);
    }
  }
}
