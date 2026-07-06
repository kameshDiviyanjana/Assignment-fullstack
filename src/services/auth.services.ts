import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  const payload = { id: user.id, firstname: user.firstname, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "devsecret", { expiresIn: "1h" });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET || "devrefresh", { expiresIn: "7d" });

  return { user, accessToken, refreshToken };
};

export const refreshTokens = (token: string) => {
  try {
    const payload = jwt.verify(token, process.env.REFRESH_SECRET || "devrefresh") as any;
    const newAccess = jwt.sign({ id: payload.id, firstname: payload.firstname, email: payload.email, role: payload.role }, process.env.JWT_SECRET || "devsecret", { expiresIn: "1h" });
    return { accessToken: newAccess };
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
};


interface TokenPayload extends JwtPayload {
  id: string;
  firstname: string;
  email: string;
  role: string;
}

const isTokenPayload = (value: unknown): value is TokenPayload => {
  if (typeof value !== "object" || value === null) return false;

  const payload = value as Partial<TokenPayload>;
  return (
    typeof payload.id === "string" &&
    typeof payload.firstname === "string" &&
    typeof payload.email === "string" &&
    typeof payload.role === "string"
  );
};

export const tokenDecodeServices = (
  authHeader: string | undefined
): TokenPayload => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Unauthorized");
  }
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT secret is not configured");
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (!isTokenPayload(decoded)) {
      throw new Error("Invalid token");
    }

    return decoded;
  } catch {
    throw new Error("Invalid token");
  }
};