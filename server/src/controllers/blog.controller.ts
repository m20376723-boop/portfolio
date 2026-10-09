import { Request, Response, NextFunction } from 'express';
import { BlogService } from '../services/blog.service';
import { ApiResponse } from '../utils/apiResponse';

export class BlogController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const publishedOnly = req.query.all !== 'true'; // Default to published for public
      const blogs = await BlogService.getAll(publishedOnly);
      ApiResponse.success(res, 'Blogs fetched successfully', blogs, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blog = await BlogService.getBySlug(req.params.slug);
      if (!blog) {
        ApiResponse.error(res, 'Blog post not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Blog post fetched successfully', blog, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blog = await BlogService.getById(req.params.id);
      if (!blog) {
        ApiResponse.error(res, 'Blog post not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Blog post fetched successfully', blog, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blog = await BlogService.create(req.body);
      ApiResponse.success(res, 'Blog post created successfully', blog, 201);
    } catch (error: any) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blog = await BlogService.update(req.params.id, req.body);
      if (!blog) {
        ApiResponse.error(res, 'Blog post not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Blog post updated successfully', blog, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blog = await BlogService.delete(req.params.id);
      if (!blog) {
        ApiResponse.error(res, 'Blog post not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Blog post deleted successfully', { id: req.params.id }, 200);
    } catch (error: any) {
      next(error);
    }
  }
}
