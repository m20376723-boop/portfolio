import { Education, IEducationDocument } from '../models/education.model';
import { IEducation } from '../types';

export class EducationService {
  static async getAll(): Promise<IEducationDocument[]> {
    return Education.find().sort({ createdAt: -1 });
  }

  static async getById(id: string): Promise<IEducationDocument | null> {
    return Education.findById(id);
  }

  static async create(data: Partial<IEducation>): Promise<IEducationDocument> {
    const edu = new Education(data);
    return edu.save();
  }

  static async update(id: string, data: Partial<IEducation>): Promise<IEducationDocument | null> {
    return Education.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<IEducationDocument | null> {
    return Education.findByIdAndDelete(id);
  }
}
