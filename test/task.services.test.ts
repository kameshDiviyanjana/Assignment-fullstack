import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import prisma from "../src/config/prisma";
import { 
  createTaskService, 
  getTaskByIdService, 
  updateTaskService, 
  deleteTaskService 
} from "../src/services/task.services";

// Mock the prisma configuration module
jest.mock("../src/config/prisma", () => ({
  __esModule: true,
  default: {
    task: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockPrisma = jest.mocked(prisma);

describe("Task CRUD services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a task successfully", async () => {
    const mockTaskInput = {
      title: "Test Task",
      description: "My Test Description",
      status: "PENDING",
      dueDate: "2026-07-10T12:00:00Z",
      ownerId: "user-123",
    };

    const mockReturnedTask = {
      id: "task-1",
      title: "Test Task",
      description: "My Test Description",
      status: "PENDING",
      dueDate: new Date("2026-07-10T12:00:00Z"),
      ownerId: "user-123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.task.create.mockResolvedValue(mockReturnedTask as any);

    const result = await createTaskService(mockTaskInput);

    expect(mockPrisma.task.create).toHaveBeenCalledWith({
      data: {
        title: "Test Task",
        description: "My Test Description",
        dueDate: new Date("2026-07-10T12:00:00Z"),
        ownerId: "user-123",
        status: "PENDING",
      },
    });
    expect(result).toEqual(mockReturnedTask);
  });

  it("should get a task by id successfully", async () => {
    const mockReturnedTask = {
      id: "task-1",
      title: "Test Task",
      description: "My Test Description",
      status: "PENDING",
      dueDate: new Date("2026-07-10T12:00:00Z"),
      ownerId: "user-123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.task.findUnique.mockResolvedValue(mockReturnedTask as any);

    const result = await getTaskByIdService("task-1");

    expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
      where: { id: "task-1" },
    });
    expect(result).toEqual(mockReturnedTask);
  });

  it("should update a task successfully", async () => {
    const mockReturnedTask = {
      id: "task-1",
      title: "Updated Title",
      description: "My Test Description",
      status: "COMPLETED",
      dueDate: new Date("2026-07-10T12:00:00Z"),
      ownerId: "user-123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.task.update.mockResolvedValue(mockReturnedTask as any);

    const result = await updateTaskService("task-1", {
      title: "Updated Title",
      status: "COMPLETED",
    });

    expect(mockPrisma.task.update).toHaveBeenCalledWith({
      where: { id: "task-1" },
      data: {
        title: "Updated Title",
        status: "COMPLETED",
      },
    });
    expect(result).toEqual(mockReturnedTask);
  });

  it("should delete a task successfully", async () => {
    mockPrisma.task.delete.mockResolvedValue({} as any);

    const result = await deleteTaskService("task-1");

    expect(mockPrisma.task.delete).toHaveBeenCalledWith({
      where: { id: "task-1" },
    });
    expect(result).toBe(true);
  });
});
