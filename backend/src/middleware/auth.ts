import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { createErrorResponse } from '../utils/helpers';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json(createErrorResponse('Access token required'));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json(createErrorResponse('Invalid or expired token'));
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json(createErrorResponse('Authentication required'));
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json(createErrorResponse('Admin access required'));
  }

  next();
};
