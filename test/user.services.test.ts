import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import prisma from "../src/config/prisma";
import {
  createUserService,
  getUserService,
  updateUserService,
  deleteUserService,
} from "../src/services/user.services";

// Mock the prisma configuration module
jest.mock("../src/config/prisma", () => ({
  __esModule: true,
  default: {
    user: {
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

describe("User Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch a user by id successfully", async () => {
    const mockReturnedUser = {
      id: "user-123",
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      role: "USER",
      isActive: true,
      createdAt: new Date(),
    };

    mockPrisma.user.findUnique.mockResolvedValue(mockReturnedUser as any);

    const result = await getUserService("user-123");

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-123" },
    });
    expect(result).toEqual(mockReturnedUser);
  });

  it("should update a user's status and information successfully", async () => {
    const mockReturnedUser = {
      id: "user-123",
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      role: "USER",
      isActive: false,
      createdAt: new Date(),
    };

    mockPrisma.user.update.mockResolvedValue(mockReturnedUser as any);

    const result = await updateUserService("user-123", {
      firstname: "John",
      isActive: false,
    });

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-123" },
      data: {
        firstname: "John",
        isActive: false,
      },
    });
    expect(result).toEqual(mockReturnedUser);
  });

  it("should fail user update with validation error if invalid fields are provided", async () => {
    await expect(
      updateUserService("user-123", {
        email: "not-an-email",
      })
    ).rejects.toThrow("Validation error");
  });
});
