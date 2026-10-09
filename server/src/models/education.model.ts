import mongoose, { Document, Schema } from 'mongoose';
import { IEducation } from '../types';

export interface IEducationDocument extends Omit<IEducation, '_id'>, Document {}

const EducationSchema = new Schema<IEducationDocument>(
  {
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    field: {
      type: String,
      required: [true, 'Field of study is required'],
      trim: true,
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
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

export const Education = mongoose.model<IEducationDocument>('Education', EducationSchema);
