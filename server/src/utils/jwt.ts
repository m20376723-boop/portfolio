import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types';

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'default_super_secret_jwt_key_fallback';
};

export const generateToken = (payload: AuthPayload): string => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn,
  });
};

export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, getJwtSecret()) as AuthPayload;
};
