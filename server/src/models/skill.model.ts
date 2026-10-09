import mongoose, { Document, Schema } from 'mongoose';
import { ISkill } from '../types';

export interface ISkillDocument extends Omit<ISkill, '_id'>, Document {}

const SkillSchema = new Schema<ISkillDocument>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: ['Frontend', 'Backend', 'Database', 'DevOps & Cloud', 'Mobile & Other', 'Tools'],
      default: 'Frontend',
    },
    proficiency: {
      type: Number,
      required: [true, 'Proficiency percentage is required'],
      min: [1, 'Proficiency must be at least 1'],
      max: [100, 'Proficiency cannot exceed 100'],
      default: 80,
    },
    icon: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

SkillSchema.index({ category: 1, order: 1 });

export const Skill = mongoose.model<ISkillDocument>('Skill', SkillSchema);
