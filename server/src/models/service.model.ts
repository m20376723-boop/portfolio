import mongoose, { Document, Schema } from 'mongoose';
import { IService } from '../types';

export interface IServiceDocument extends Omit<IService, '_id'>, Document {}

const ServiceSchema = new Schema<IServiceDocument>(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    icon: {
      type: String,
      default: 'code',
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

export const Service = mongoose.model<IServiceDocument>('Service', ServiceSchema);
