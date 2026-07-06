import { Request, Response } from "express";
import { asyerrohander } from "../utils/errorhandel";
import { loginUser, refreshTokens, tokenDecodeServices } from "../services/auth.services";

export const login = asyerrohander(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "email and password required" });
  const result = await loginUser(email, password);
  res.cookie("accessToken", result.accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 });
  res.cookie("refreshToken", result.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  return res.json({  accessToken: result.accessToken, refreshToken: result.refreshToken });
});

export const refresh = asyerrohander(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null) ?? req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });
  const newTokens = refreshTokens(token);
  return res.json(newTokens);
});
export const getMe = asyerrohander(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  const decodedToken =  tokenDecodeServices(authHeader);

  res.status(200).json({
    success: true,
    user: decodedToken,
  });
});
