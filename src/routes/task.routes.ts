import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByUserId,
} from "../controllers/task.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = express.Router();

console.log("[routes] Task router loading...");
console.log("[routes] Available controllers:", { createTask, getAllTasks, getTaskById, updateTask, deleteTask, getTasksByUserId });

router.post("/", authMiddleware,requireRole(["ADMIN", "USER"]), createTask);

router.get("/",authMiddleware,requireRole(["ADMIN", "USER"]), getAllTasks);

router.get("/user", authMiddleware,requireRole(["ADMIN", "USER"]), getTasksByUserId);

console.log("[routes] /user/:userId route registered");

router.get("/:id", authMiddleware,requireRole(["ADMIN", "USER"]), getTaskById);
router.put("/:id", authMiddleware,requireRole(["ADMIN", "USER"]), updateTask);
router.delete("/:id", authMiddleware,requireRole(["ADMIN", "USER"]), deleteTask);

export default router;


