import prisma from "../config/prisma";
import { createTaskRepository, deleteTaskRepository, getAllTasksRepository, getAllUserTasksRepository } from "../repositories/task.repositories";

export const createTaskService = async (data: any) => {

try{

  const createtask = await  createTaskRepository(data);
  return createtask;

}catch(err){
    throw new Error("Error creating tasks");

}
};

export const getAllTasksService = async (params: {
  page?: number;
  limit?: number;
  status?: "PENDING" | "COMPLETED" | "IN_PROGRESS";
  search?: string;
}) => {
  try {
    const task = await getAllTasksRepository(params);
    return task;
  } catch (err) {
    throw new Error("Error fetching tasks: ");
  }
};
export const getTaskByIdService = async (id: string) => {
  return prisma.task.findUnique({ where: { id } });
};

export const updateTaskService = async (id: string, data: any) => {
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = String(data.title).trim();
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.dueDate !== undefined) {
    const parsed = new Date(data.dueDate);
    if (Number.isNaN(parsed.getTime())) throw new Error("Invalid input: dueDate must be a valid date");
    updateData.dueDate = parsed;
  }

  return prisma.task.update({ where: { id }, data: updateData });
};

export const deleteTaskService = async (id: string) => {
   try{
    await deleteTaskRepository(id);
  return true;
   }catch(err){
    throw new Error("Error deleting task: ");
   }
};



export const getAllUserTasksService = async (params: {
  userId: string;
  page?: number;
  limit?: number;
  status?: "PENDING" | "COMPLETED" | "IN_PROGRESS";
  search?: string;
}) => {
  try {
    const task = await getAllUserTasksRepository(params);
    return task;
  } catch (err) {
    throw new Error("Error fetching tasks: ");
  }
};


