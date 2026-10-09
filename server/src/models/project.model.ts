import mongoose, { Document, Schema } from 'mongoose';
import { IProject } from '../types';

export interface IProjectDocument extends Omit<IProject, '_id'>, Document {}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    image: {
      type: String,
      default: '',
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology is required'],
      default: [],
    },
    githubUrl: {
      type: String,
      default: '',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
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

ProjectSchema.index({ featured: -1, order: 1 });

export const Project = mongoose.model<IProjectDocument>('Project', ProjectSchema);
