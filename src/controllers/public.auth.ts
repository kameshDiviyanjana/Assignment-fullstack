// authController.ts
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const issueToken = (req: Request, res: Response) => {
    const token = jwt.sign(
        { client: "public_frontend" },
        process.env.JWT_SECRET_public!,
        { expiresIn: "1h" }
    );

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.json({ accessToken: token });
};