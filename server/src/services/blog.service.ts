import { Blog, IBlogDocument } from '../models/blog.model';
import { IBlog } from '../types';

export class BlogService {
  static async getAll(publishedOnly: boolean = false): Promise<IBlogDocument[]> {
    const filter = publishedOnly ? { published: true } : {};
    return Blog.find(filter).sort({ createdAt: -1 });
  }

  static async getBySlug(slug: string): Promise<IBlogDocument | null> {
    return Blog.findOne({ slug: slug.toLowerCase() });
  }

  static async getById(id: string): Promise<IBlogDocument | null> {
    return Blog.findById(id);
  }

  static async create(data: Partial<IBlog>): Promise<IBlogDocument> {
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    const blog = new Blog(data);
    return blog.save();
  }

  static async update(id: string, data: Partial<IBlog>): Promise<IBlogDocument | null> {
    if (data.title && !data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    return Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<IBlogDocument | null> {
    return Blog.findByIdAndDelete(id);
  }
}
