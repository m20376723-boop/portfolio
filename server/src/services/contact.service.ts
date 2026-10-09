import { ContactMessage, IContactMessageDocument } from '../models/contact.model';
import { IContactMessage } from '../types';

export class ContactService {
  static async create(data: Partial<IContactMessage>): Promise<IContactMessageDocument> {
    const message = new ContactMessage(data);
    return message.save();
  }

  static async getAll(): Promise<IContactMessageDocument[]> {
    return ContactMessage.find().sort({ createdAt: -1 });
  }

  static async getById(id: string): Promise<IContactMessageDocument | null> {
    return ContactMessage.findById(id);
  }

  static async updateStatus(id: string, status: 'unread' | 'read' | 'replied' | 'archived'): Promise<IContactMessageDocument | null> {
    return ContactMessage.findByIdAndUpdate(id, { status }, { new: true });
  }

  static async delete(id: string): Promise<IContactMessageDocument | null> {
    return ContactMessage.findByIdAndDelete(id);
  }
}
