import { Request, Response, NextFunction } from 'express';

export const requireRole = (roles: string | string[]) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const user = req.user as any;
    if (!user) return res.status(401).json({ error: 'No authentication token' });
    if (!allowed.includes(user.role)) return res.status(403).json({ error: 'Forbidden: insufficient role' });
    return next();
  };
};
