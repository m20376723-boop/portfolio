import { User, IUserDocument } from '../models/user.model';
import { IUser, AuthPayload } from '../types';
import { generateToken } from '../utils/jwt';

export class AuthService {
  static async register(userData: Partial<IUser>): Promise<{ user: Partial<IUser>; token: string }> {
    const existing = await User.findOne({ email: userData.email?.toLowerCase() });
    if (existing) {
      throw new Error('User with this email already exists');
    }

    // Default first registered user to admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : (userData.role || 'user');

    const user = new User({
      ...userData,
      email: userData.email?.toLowerCase(),
      role,
    });

    await user.save();

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async login(email: string, password: string): Promise<{ user: Partial<IUser>; token: string }> {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async getMe(userId: string): Promise<Partial<IUser> | null> {
    return User.findById(userId).select('-password');
  }
}
