
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthUser {
  id: string;
  firstname: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

const SECRET = process.env.JWT_SECRET;

// authMiddleware.ts
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("[auth-middleware] Called for", req.method, req.path);
  const authHeader = req.headers.authorization;
  const token =
    (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null)
    ?? req.cookies?.accessToken;

  if (!token) {
    console.log("[auth-middleware] No token found, returning 401");
    return res.status(401).json({ error: "No authentication token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET!) as AuthUser;
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
