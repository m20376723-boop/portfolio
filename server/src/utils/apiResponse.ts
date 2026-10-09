import { Response } from 'express';

export class ApiResponse {
  static success<T>(res: Response, message: string = 'Operation successful', data?: T, statusCode: number = 200): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data: data !== undefined ? data : null,
    });
  }

  static error(res: Response, message: string = 'Internal Server Error', error: any = null, statusCode: number = 500): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error !== undefined ? error : null,
    });
  }
}
