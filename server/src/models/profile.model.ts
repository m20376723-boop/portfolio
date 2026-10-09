import mongoose, { Document, Schema } from 'mongoose';
import { IProfile } from '../types';

export interface IProfileDocument extends Omit<IProfile, '_id'>, Document {}

const ProfileSchema = new Schema<IProfileDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
    },
    profileImage: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
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

export const Profile = mongoose.model<IProfileDocument>('Profile', ProfileSchema);
