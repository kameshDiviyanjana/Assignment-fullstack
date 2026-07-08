import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),

dueDate: z.string().date().optional(),  ownerId: z.string().optional(),
});


export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
    dueDate: z.string().date().optional(),

    ownerId: z.string().optional(),

})


export  const createUserSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const updateUserSchema = z.object({
  firstname: z.string().min(1, "First name is required").optional(),
  lastname: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
  isActive: z.boolean().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});


