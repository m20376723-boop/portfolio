export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ISkill {
  _id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps & Cloud' | 'Mobile & Other' | 'Tools';
  proficiency: number;
  icon?: string;
  order: number;
}

export interface IProject {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IExperience {
  _id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  technologies: string[];
  order: number;
}

export interface IEducation {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface IService {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}
