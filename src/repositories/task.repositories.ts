import prisma from "../config/prisma";

export const createTaskRepository = async (data: any) => {
  const { title, description, status, dueDate, ownerId } = data;

  const cleanTitle = typeof title === "string" ? title.trim() : "";
  if (!cleanTitle) throw new Error("Invalid input: title is required");

  const parsedDue = dueDate ? new Date(dueDate) : null;
  if (!parsedDue || Number.isNaN(parsedDue.getTime())) throw new Error("Invalid input: dueDate is required and must be a valid date");

  const createData: any = {
    title: cleanTitle,
    description: typeof description === "string" ? description : null,
    dueDate: parsedDue,
    ownerId
  };

  if (status !== undefined && status !== null) {
    createData.status = status;
  }

  const task = await prisma.task.create({ data: createData });
  return task;
};

export const getAllTasksRepository = async (params: {
  page?: number;
  limit?: number;
  status?: "PENDING" | "COMPLETED" | "IN_PROGRESS";
  search?: string;
}) => {
  const { page = 1, limit = 10, status, search } = params;

  const skip = (page - 1) * limit;

  const where: any = {
    ...(status && { status }),

    ...(search && {
      title: {
        contains: search,
        mode: "insensitive",
      },
    }),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,

      include: {
        owner: {
          select: {
       
            firstname: true,
            lastname: true,
          },
        },
      },
    }),

    prisma.task.count({ where }),
  ]);

  return {
    data: tasks,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


export const getAllUserTasksRepository = async (params: {
  userId: string;
  page?: number;
  limit?: number;
  status?: "PENDING" | "COMPLETED" | "IN_PROGRESS";
  search?: string;
}) => {
  const {
    userId,
    page = 1,
    limit = 10,
    status,
    search,
  } = params;

  const skip = (page - 1) * limit;

  const where = {
    ownerId: userId, 

    ...(status && { status }),

    ...(search && {
      title: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.task.count({
      where,
    }),
  ]);

  return {
    data: tasks,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


export const deleteTaskRepository = async (id: string) => {
  await prisma.task.delete({ where: { id } });
  return true;
};