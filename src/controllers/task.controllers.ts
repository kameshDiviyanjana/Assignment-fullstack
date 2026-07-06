import { Request, Response, NextFunction } from "express";
import { asyerrohander } from "../utils/errorhandel";
import { makerespon } from "../utils/respons";
import { sanitizeBody } from "../utils/sanitize";
import {
  createTaskService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
  getAllUserTasksService,
} from "../services/task.services";
import { createTaskSchema } from "../utils/validation";

const isTaskStatus = (value: unknown): value is "PENDING" | "IN_PROGRESS" | "COMPLETED" => {
  return value === "PENDING" || value === "IN_PROGRESS" || value === "COMPLETED";
};
export const createTask = asyerrohander(
  async (req: Request, res: Response, next: NextFunction) => {
    const safe = sanitizeBody(req.body);

    // 🔥 VALIDATE FIRST
    const parsed = createTaskSchema.safeParse(safe);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.format(),
      });
    }

    const data = parsed.data;

    const authUser: any = (req as any).user;

    if (!data.ownerId && authUser?.id) {
      data.ownerId = authUser.id;
    }

    if (!data.dueDate) {
      const def = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      data.dueDate = def.toISOString();
    }

    const created = await createTaskService(data);

    return makerespon({
      res,
      data: created,
      message: "Task created",
      status: 201,
    });
  }
);
// export const createTask = asyerrohander(async (req: Request, res: Response, next: NextFunction) => {
//   const safe = sanitizeBody(req.body);

//   const authUser: any = (req as any).user;
//   if (!safe.ownerId && authUser?.id) safe.ownerId = authUser.id;

//   if (!safe.dueDate) {
//     const def = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//     safe.dueDate = def.toISOString();
//   }

//   const created = await createTaskService(safe);
//   return makerespon({ res, data: created, message: "Task created", status: 201 });
// });

export const getAllTasks = asyerrohander(async (req: Request, res: Response) => {
  const { page, limit, status, search } = req.query;
  const query: {
    page?: number;
    limit?: number;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    search?: string;
  } = {};

  if (typeof page === "string") {
    query.page = Number(page);
  }

  if (typeof limit === "string") {
    query.limit = Number(limit);
  }

  if (typeof search === "string") {
    query.search = search;
  }

  if (isTaskStatus(status)) {
    query.status = status;
  }

  const tasks = await getAllTasksService(query);
  return makerespon({ res, data: tasks, message: "Tasks fetched" });
});

export const getTaskById = asyerrohander(async (req: Request, res: Response) => {
  const id = String((req.params as any).id);
  const task = await getTaskByIdService(id);
  return makerespon({ res, data: task, message: "Task fetched" });
});

export const updateTask = asyerrohander(async (req: Request, res: Response) => {
  const id = String((req.params as any).id);
  const safe = sanitizeBody(req.body);
  const updated = await updateTaskService(id, safe);
  return makerespon({ res, data: updated, message: "Task updated" });
});

export const deleteTask = asyerrohander(async (req: Request, res: Response) => {
  const id = String((req.params as any).id);
  await deleteTaskService(id);
  return makerespon({ res, message: "Task deleted" });
});

export const getTasksByUserId = asyerrohander(async (req: Request, res: Response) => {

  const { page, limit, status, search,userId } = req.query;

      if (typeof userId !== "string" || !userId) {
      return res.status(400).json({ message: "userId is required" });
    }
  
  const query: {
    userId: string;
    page?: number;
    limit?: number;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    search?: string;
  } = { userId };

  if (typeof userId === "string") {
    query.userId = userId;
  }

  if (typeof page === "string") {
    query.page = Number(page);
  }

  if (typeof limit === "string") {
    query.limit = Number(limit);
  }

  if (typeof search === "string") {
    query.search = search;
  }

  if (isTaskStatus(status)) {
    query.status = status;
  }

  const tasks = await getAllUserTasksService(query);
  return makerespon({ res, data: tasks, message: "User tasks fetched" });
});


