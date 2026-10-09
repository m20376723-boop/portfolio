import { Request, Response, NextFunction } from 'express';
import { SkillService } from '../services/skill.service';
import { ApiResponse } from '../utils/apiResponse';

export class SkillController {
  static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skills = await SkillService.getAll();
      ApiResponse.success(res, 'Skills fetched successfully', skills, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skill = await SkillService.getById(req.params.id);
      if (!skill) {
        ApiResponse.error(res, 'Skill not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Skill fetched successfully', skill, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skill = await SkillService.create(req.body);
      ApiResponse.success(res, 'Skill created successfully', skill, 201);
    } catch (error: any) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skill = await SkillService.update(req.params.id, req.body);
      if (!skill) {
        ApiResponse.error(res, 'Skill not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Skill updated successfully', skill, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skill = await SkillService.delete(req.params.id);
      if (!skill) {
        ApiResponse.error(res, 'Skill not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Skill deleted successfully', { id: req.params.id }, 200);
    } catch (error: any) {
      next(error);
    }
  }
}
