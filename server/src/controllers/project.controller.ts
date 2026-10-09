import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { ApiResponse } from '../utils/apiResponse';

export class ProjectController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const featured = req.query.featured ? req.query.featured === 'true' : undefined;
      const projects = await ProjectService.getAll(featured);
      ApiResponse.success(res, 'Projects fetched successfully', projects, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await ProjectService.getById(req.params.id);
      if (!project) {
        ApiResponse.error(res, 'Project not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Project fetched successfully', project, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await ProjectService.create(req.body);
      ApiResponse.success(res, 'Project created successfully', project, 201);
    } catch (error: any) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await ProjectService.update(req.params.id, req.body);
      if (!project) {
        ApiResponse.error(res, 'Project not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Project updated successfully', project, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await ProjectService.delete(req.params.id);
      if (!project) {
        ApiResponse.error(res, 'Project not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Project deleted successfully', { id: req.params.id }, 200);
    } catch (error: any) {
      next(error);
    }
  }
}
