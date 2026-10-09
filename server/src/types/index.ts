import { Request } from 'express';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
}

export interface IProfile {
  _id?: string;
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  resumeUrl: string;
  location: string;
  email: string;
  phone: string;
  socialLinks: ISocialLinks;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISkill {
  _id?: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps & Cloud' | 'Mobile & Other' | 'Tools';
  proficiency: number;
  icon?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProject {
  _id?: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExperience {
  _id?: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  technologies: string[];
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEducation {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IService {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: string;
  tags: string[];
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactMessage {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
