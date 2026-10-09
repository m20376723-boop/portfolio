import { Request, Response, NextFunction } from 'express';
import { EducationService } from '../services/education.service';
import { ApiResponse } from '../utils/apiResponse';

export class EducationController {
  static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await EducationService.getAll();
      ApiResponse.success(res, 'Education records fetched successfully', records, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await EducationService.getById(req.params.id);
      if (!record) {
        ApiResponse.error(res, 'Education record not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Education record fetched successfully', record, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await EducationService.create(req.body);
      ApiResponse.success(res, 'Education record created successfully', record, 201);
    } catch (error: any) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await EducationService.update(req.params.id, req.body);
      if (!record) {
        ApiResponse.error(res, 'Education record not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Education record updated successfully', record, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await EducationService.delete(req.params.id);
      if (!record) {
        ApiResponse.error(res, 'Education record not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Education record deleted successfully', { id: req.params.id }, 200);
    } catch (error: any) {
      next(error);
    }
  }
}
