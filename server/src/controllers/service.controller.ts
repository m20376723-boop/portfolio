import { Request, Response, NextFunction } from 'express';
import { FreelanceService } from '../services/service.service';
import { ApiResponse } from '../utils/apiResponse';

export class ServiceController {
  static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await FreelanceService.getAll();
      ApiResponse.success(res, 'Services fetched successfully', services, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = await FreelanceService.getById(req.params.id);
      if (!service) {
        ApiResponse.error(res, 'Service not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Service fetched successfully', service, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = await FreelanceService.create(req.body);
      ApiResponse.success(res, 'Service created successfully', service, 201);
    } catch (error: any) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = await FreelanceService.update(req.params.id, req.body);
      if (!service) {
        ApiResponse.error(res, 'Service not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Service updated successfully', service, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = await FreelanceService.delete(req.params.id);
      if (!service) {
        ApiResponse.error(res, 'Service not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Service deleted successfully', { id: req.params.id }, 200);
    } catch (error: any) {
      next(error);
    }
  }
}
