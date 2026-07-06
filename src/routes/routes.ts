import express from "express";
import taskRouter from "./task.routes";
import userRouter from "./user.routes";
import authrouter from "./auth.router";
const router = express.Router();


router.use('/auth', authrouter);
router.use('/task', taskRouter);
router.use('/user', userRouter);

export default router;