import mongoose, { Document, Schema } from 'mongoose';
import { IExperience } from '../types';

export interface IExperienceDocument extends Omit<IExperience, '_id'>, Document {}

const ExperienceSchema = new Schema<IExperienceDocument>(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String,
      default: 'Present',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
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

ExperienceSchema.index({ order: 1, createdAt: -1 });

export const Experience = mongoose.model<IExperienceDocument>('Experience', ExperienceSchema);
