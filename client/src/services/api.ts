import axios from 'axios';
import {
  ApiResponse,
  IUser,
  IProfile,
  ISkill,
  IProject,
  IExperience,
  IEducation,
  IService,
  IBlog,
  IContactMessage,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const api = {
  // Authentication
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const res = await apiClient.post<ApiResponse<{ user: IUser; token: string }>>('/auth/login', credentials);
      return res.data;
    },
    register: async (userData: { name: string; email: string; password: string }) => {
      const res = await apiClient.post<ApiResponse<{ user: IUser; token: string }>>('/auth/register', userData);
      return res.data;
    },
    getMe: async () => {
      const res = await apiClient.get<ApiResponse<IUser>>('/auth/me');
      return res.data;
    },
  },

  // Profile
  profile: {
    get: async () => {
      const res = await apiClient.get<ApiResponse<IProfile>>('/profile');
      return res.data;
    },
    update: async (data: Partial<IProfile>) => {
      const res = await apiClient.put<ApiResponse<IProfile>>('/profile', data);
      return res.data;
    },
  },

  // Skills
  skills: {
    getAll: async () => {
      const res = await apiClient.get<ApiResponse<ISkill[]>>('/skills');
      return res.data;
    },
    create: async (data: Partial<ISkill>) => {
      const res = await apiClient.post<ApiResponse<ISkill>>('/skills', data);
      return res.data;
    },
    update: async (id: string, data: Partial<ISkill>) => {
      const res = await apiClient.put<ApiResponse<ISkill>>(`/skills/${id}`, data);
      return res.data;
    },
    delete: async (id: string) => {
      const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/skills/${id}`);
      return res.data;
    },
  },

  // Projects
  projects: {
    getAll: async (featured?: boolean) => {
      const params = featured !== undefined ? { featured } : {};
      const res = await apiClient.get<ApiResponse<IProject[]>>('/projects', { params });
      return res.data;
    },
    getById: async (id: string) => {
      const res = await apiClient.get<ApiResponse<IProject>>(`/projects/${id}`);
      return res.data;
    },
    create: async (data: Partial<IProject>) => {
      const res = await apiClient.post<ApiResponse<IProject>>('/projects', data);
      return res.data;
    },
    update: async (id: string, data: Partial<IProject>) => {
      const res = await apiClient.put<ApiResponse<IProject>>(`/projects/${id}`, data);
      return res.data;
    },
    delete: async (id: string) => {
      const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/projects/${id}`);
      return res.data;
    },
  },

  // Experience
  experience: {
    getAll: async () => {
      const res = await apiClient.get<ApiResponse<IExperience[]>>('/experience');
      return res.data;
    },
    create: async (data: Partial<IExperience>) => {
      const res = await apiClient.post<ApiResponse<IExperience>>('/experience', data);
      return res.data;
    },
    update: async (id: string, data: Partial<IExperience>) => {
      const res = await apiClient.put<ApiResponse<IExperience>>(`/experience/${id}`, data);
      return res.data;
    },
    delete: async (id: string) => {
      const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/experience/${id}`);
      return res.data;
    },
  },

  // Education
  education: {
    getAll: async () => {
      const res = await apiClient.get<ApiResponse<IEducation[]>>('/education');
      return res.data;
    },
    create: async (data: Partial<IEducation>) => {
      const res = await apiClient.post<ApiResponse<IEducation>>('/education', data);
      return res.data;
    },
    update: async (id: string, data: Partial<IEducation>) => {
      const res = await apiClient.put<ApiResponse<IEducation>>(`/education/${id}`, data);
      return res.data;
    },
    delete: async (id: string) => {
      const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/education/${id}`);
      return res.data;
    },
  },

  // Services
  services: {
    getAll: async () => {
      const res = await apiClient.get<ApiResponse<IService[]>>('/services');
      return res.data;
    },
    create: async (data: Partial<IService>) => {
      const res = await apiClient.post<ApiResponse<IService>>('/services', data);
      return res.data;
    },
    update: async (id: string, data: Partial<IService>) => {
      const res = await apiClient.put<ApiResponse<IService>>(`/services/${id}`, data);
      return res.data;
    },
    delete: async (id: string) => {
      const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/services/${id}`);
      return res.data;
    },
  },

  // Blogs
  blogs: {
    getAll: async (all: boolean = false) => {
      const params = all ? { all: 'true' } : {};
      const res = await apiClient.get<ApiResponse<IBlog[]>>('/blogs', { params });
      return res.data;
    },
    getBySlug: async (slug: string) => {
      const res = await apiClient.get<ApiResponse<IBlog>>(`/blogs/${slug}`);
      return res.data;
    },
    getById: async (id: string) => {
      const res = await apiClient.get<ApiResponse<IBlog>>(`/blogs/id/${id}`);
      return res.data;
    },
    create: async (data: Partial<IBlog>) => {
      const res = await apiClient.post<ApiResponse<IBlog>>('/blogs', data);
      return res.data;
    },
    update: async (id: string, data: Partial<IBlog>) => {
      const res = await apiClient.put<ApiResponse<IBlog>>(`/blogs/${id}`, data);
      return res.data;
    },
    delete: async (id: string) => {
      const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/blogs/${id}`);
      return res.data;
    },
  },

  // Contact
  contact: {
    submit: async (messageData: { name: string; email: string; subject: string; message: string }) => {
      const res = await apiClient.post<ApiResponse<IContactMessage>>('/contact', messageData);
      return res.data;
    },
    getAll: async () => {
      const res = await apiClient.get<ApiResponse<IContactMessage[]>>('/contact');
      return res.data;
    },
    updateStatus: async (id: string, status: 'unread' | 'read' | 'replied' | 'archived') => {
      const res = await apiClient.put<ApiResponse<IContactMessage>>(`/contact/${id}`, { status });
      return res.data;
    },
    delete: async (id: string) => {
      const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/contact/${id}`);
      return res.data;
    },
  },

  // File Upload
  upload: {
    uploadFile: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post<ApiResponse<{ url: string; filename: string }>>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
  },
};
