import env from '../config/env';
import jwt from 'jsonwebtoken';

const JWT_SECRET: jwt.Secret = env.jwt.secret;

export const generateToken = (payload: object, expiresIn: string = '1d'): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};
