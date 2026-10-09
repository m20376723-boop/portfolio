import { Skill, ISkillDocument } from '../models/skill.model';
import { ISkill } from '../types';

export class SkillService {
  static async getAll(): Promise<ISkillDocument[]> {
    return Skill.find().sort({ order: 1, createdAt: 1 });
  }

  static async getById(id: string): Promise<ISkillDocument | null> {
    return Skill.findById(id);
  }

  static async create(data: Partial<ISkill>): Promise<ISkillDocument> {
    const skill = new Skill(data);
    return skill.save();
  }

  static async update(id: string, data: Partial<ISkill>): Promise<ISkillDocument | null> {
    return Skill.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<ISkillDocument | null> {
    return Skill.findByIdAndDelete(id);
  }
}
