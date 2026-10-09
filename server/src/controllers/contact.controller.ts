import { Request, Response, NextFunction } from 'express';
import { ContactService } from '../services/contact.service';
import { ApiResponse } from '../utils/apiResponse';

export class ContactController {
  static async submitMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, subject, message } = req.body;
      const newMessage = await ContactService.create({ name, email, subject, message });
      ApiResponse.success(
        res,
        'Thank you! Your message has been sent successfully. I will get back to you soon.',
        newMessage,
        201
      );
    } catch (error: any) {
      next(error);
    }
  }

  static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await ContactService.getAll();
      ApiResponse.success(res, 'Contact messages fetched successfully', messages, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await ContactService.getById(req.params.id);
      if (!message) {
        ApiResponse.error(res, 'Message not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Message fetched successfully', message, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const updated = await ContactService.updateStatus(req.params.id, status);
      if (!updated) {
        ApiResponse.error(res, 'Message not found', null, 404);
        return;
      }
      ApiResponse.success(res, `Message status updated to ${status}`, updated, 200);
    } catch (error: any) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await ContactService.delete(req.params.id);
      if (!deleted) {
        ApiResponse.error(res, 'Message not found', null, 404);
        return;
      }
      ApiResponse.success(res, 'Message deleted successfully', { id: req.params.id }, 200);
    } catch (error: any) {
      next(error);
    }
  }
}
