import express from "express";
import { getMe, login, refresh } from "../controllers/auth.controllers";

const router = express.Router();

router.post("/login", login);
router.get("/refresh", refresh);
router.get("/me", getMe);

export default router;
