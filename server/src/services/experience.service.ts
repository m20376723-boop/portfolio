import { Experience, IExperienceDocument } from '../models/experience.model';
import { IExperience } from '../types';

export class ExperienceService {
  static async getAll(): Promise<IExperienceDocument[]> {
    return Experience.find().sort({ order: 1, createdAt: -1 });
  }

  static async getById(id: string): Promise<IExperienceDocument | null> {
    return Experience.findById(id);
  }

  static async create(data: Partial<IExperience>): Promise<IExperienceDocument> {
    const exp = new Experience(data);
    return exp.save();
  }

  static async update(id: string, data: Partial<IExperience>): Promise<IExperienceDocument | null> {
    return Experience.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<IExperienceDocument | null> {
    return Experience.findByIdAndDelete(id);
  }
}
