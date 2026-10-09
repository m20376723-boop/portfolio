import { Service, IServiceDocument } from '../models/service.model';
import { IService } from '../types';

export class FreelanceService {
  static async getAll(): Promise<IServiceDocument[]> {
    return Service.find().sort({ createdAt: 1 });
  }

  static async getById(id: string): Promise<IServiceDocument | null> {
    return Service.findById(id);
  }

  static async create(data: Partial<IService>): Promise<IServiceDocument> {
    const s = new Service(data);
    return s.save();
  }

  static async update(id: string, data: Partial<IService>): Promise<IServiceDocument | null> {
    return Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<IServiceDocument | null> {
    return Service.findByIdAndDelete(id);
  }
}
