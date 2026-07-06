import express from "express";
import * as userController from "../controllers/user.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", userController.register);
router.get("/", authMiddleware,  userController.getAllUsers);
router.get("/admin", authMiddleware, userController.getAllUserAdmin);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);

export default router;
