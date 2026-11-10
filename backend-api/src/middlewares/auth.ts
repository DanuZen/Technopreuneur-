import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: 'jobseeker' | 'employer' | 'admin';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token otentikasi tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Sesi kedaluwarsa atau token tidak valid.' });
  }
};

export const requireRole = (allowedRoles: ('jobseeker' | 'employer' | 'admin')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak: role tidak memiliki izin.' });
    }
    next();
  };
};

