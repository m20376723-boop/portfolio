import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';

export class UploadController {
  static async uploadFile(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      ApiResponse.error(res, 'No file was uploaded', null, 400);
      return;
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    ApiResponse.success(
      res,
      'File uploaded successfully',
      {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      },
      201
    );
  }
}
