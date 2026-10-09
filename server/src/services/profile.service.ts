import { Profile, IProfileDocument } from '../models/profile.model';
import { IProfile } from '../types';

export class ProfileService {
  static async getProfile(): Promise<IProfileDocument | null> {
    let profile = await Profile.findOne();
    if (!profile) {
      // Default initial profile
      profile = await Profile.create({
        name: 'Alex Rivera',
        title: 'Senior Full-Stack Engineer & Cloud Architect',
        bio: 'Passionate software craftsman with 7+ years of building resilient distributed systems, modern web apps, and high-impact digital experiences.',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        resumeUrl: '',
        location: 'San Francisco, CA / Remote',
        email: 'alex.rivera@example.com',
        phone: '+1 (555) 234-5678',
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
          website: 'https://alexrivera.dev',
        },
      });
    }
    return profile;
  }

  static async updateProfile(data: Partial<IProfile>): Promise<IProfileDocument> {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(data);
    } else {
      Object.assign(profile, data);
    }
    await profile.save();
    return profile;
  }
}
