import prisma from "../config/prisma";
import bcrypt from "bcrypt";

const readUserNameField = (data: any, keys: string[]) => {
  for (const key of keys) {
    const value = data?.[key];
    if (typeof value === "string" && value.trim() !== "") return value.trim();
  }
  return "";
};

export const createUserRepositorie = async (data: any) => {
  const firstname = readUserNameField(data, ["firstname", "firstName", "first_name"]);
  const lastname = readUserNameField(data, ["lastname", "lastName", "last_name"]);
  const email = data.email;
  const password = data.password;
  const role = data.role ?? "USER";

  if (!firstname || !lastname || !email || !password) throw new Error("Missing required fields");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);
  const isActive = data.isActive !== undefined ? Boolean(data.isActive) : true;

  const user = await prisma.user.create({
    data: {
      firstname,
      lastname,
      email,
      password: hashed,
      role: role as any,
      isActive,
    },
  });

  return user;
};

export const getUserRepositorie = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};
export const getAllUsersRepository = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const {
    page = 1,
    limit = 10,
    search,
  } = params;

  const skip = (page - 1) * limit;

  const where = search
    ? {
      OR: [
        {
          firstname: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          lastname: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    data: users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateUserRepositorie = async (id: string, data: any) => {
  const updateData: any = { ...data };
  if (typeof updateData.first_name === "string" && !updateData.firstname) updateData.firstname = updateData.first_name;
  if (typeof updateData.last_name === "string" && !updateData.lastname) updateData.lastname = updateData.last_name;
  if (updateData.firstName && !updateData.firstname) updateData.firstname = updateData.firstName;
  if (updateData.lastName && !updateData.lastname) updateData.lastname = updateData.lastName;
  if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 10);
  return prisma.user.update({ where: { id }, data: updateData });
};

export const deleteUserRepositorie = async (id: string) => {
  await prisma.user.delete({ where: { id } });
  return true;
};

export const getAllUserAdminRepository = async () => {
  return prisma.user.findMany({
    where: {
      role: "USER",
    },
    select: {
      id: true,
      firstname: true,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


export const ActiveAndDeactiveUserRepositorie = async (id: string, status: boolean) => {
  return prisma.user.update({
    where: { id },
    data: { isActive: status },
  });
};

// export const DeactiveUserRepositorie = async (id: string) => {
//   return prisma.user.update({
//     where: { id },
//     data: { isActive: false },
//   });
// };