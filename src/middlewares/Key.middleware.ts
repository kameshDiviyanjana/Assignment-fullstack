import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // expects "Bearer <API_KEY>"
  
  if (!token || token !== process.env.PUBLIC_API_KEY) {
    return res.status(403).json({ message: "Forbidden: Invalid API Key" });
  }

  next(); 
};



export const tokenAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_public !);
        next();
    } catch {
        return res.status(403).json({ message: "Invalid or Expired Token" });
    }
};