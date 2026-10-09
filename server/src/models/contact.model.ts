import mongoose, { Document, Schema } from 'mongoose';
import { IContactMessage } from '../types';

export interface IContactMessageDocument extends Omit<IContactMessage, '_id'>, Document {}

const ContactMessageSchema = new Schema<IContactMessageDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied', 'archived'],
      default: 'unread',
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

ContactMessageSchema.index({ status: 1, createdAt: -1 });

export const ContactMessage = mongoose.model<IContactMessageDocument>('ContactMessage', ContactMessageSchema);
