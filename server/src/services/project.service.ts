import { Project, IProjectDocument } from '../models/project.model';
import { IProject } from '../types';

export class ProjectService {
  static async getAll(featuredOnly?: boolean): Promise<IProjectDocument[]> {
    const filter = featuredOnly !== undefined ? { featured: featuredOnly } : {};
    return Project.find(filter).sort({ order: 1, createdAt: -1 });
  }

  static async getById(id: string): Promise<IProjectDocument | null> {
    return Project.findById(id);
  }

  static async create(data: Partial<IProject>): Promise<IProjectDocument> {
    const project = new Project(data);
    return project.save();
  }

  static async update(id: string, data: Partial<IProject>): Promise<IProjectDocument | null> {
    return Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<IProjectDocument | null> {
    return Project.findByIdAndDelete(id);
  }
}
