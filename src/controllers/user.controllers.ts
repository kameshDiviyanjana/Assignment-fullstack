import { Request, Response } from "express";
import { asyerrohander } from "../utils/errorhandel";
import { makerespon } from "../utils/respons";
import { sanitizeBody } from "../utils/sanitize";
import {
  createUserService,
  getUserService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
  getuserByadminService,
  ActiveAndDeactiveUserServices,
} from "../services/user.services";

const normalizeRegisterBody = (body: any) => ({
  ...body,
  firstname: body.firstname ?? body.firstName ?? body.first_name,
  lastname: body.lastname ?? body.lastName ?? body.last_name,
});

export const register = asyerrohander(async (req: Request, res: Response) => {
  console.log("Registering user with body:", req.body);
  const userdata = normalizeRegisterBody(req.body);
  if (!userdata.firstname || !userdata.lastname || !userdata.email || !userdata.password) {
    return res.status(400).json({
      status: 400,
      message: "firstname, lastname, email and password are required",
    });
  }
  const created = await createUserService(userdata);
  return makerespon({ res, data: created, message: "User created", status: 201 });
});

export const getAllUsers = asyerrohander(async (req: Request, res: Response) => {
  const params = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    search: req.query.search ? String(req.query.search) : undefined,
  };
  const users = await getAllUsersService(params);
  return makerespon({ res, data: users, message: "Users fetched" });
});

export const getUserById = asyerrohander(async (req: Request, res: Response) => {
  const id = String((req.params as any).id);
  const user = await getUserService(id);
  return makerespon({ res, data: user, message: "User fetched" });
});

export const updateUser = asyerrohander(async (req: Request, res: Response) => {
  const id = String((req.params as any).id);
  const safe = sanitizeBody(req.body);
  const updated = await updateUserService(id, safe);
  return makerespon({ res, data: updated, message: "User updated" });
});

export const deleteUser = asyerrohander(async (req: Request, res: Response) => {
  const id = String((req.params as any).id);
  const ok = await deleteUserService(id);
  return makerespon({ res, data: ok, message: "User deleted" });
});


export const getAllUserAdmin = asyerrohander(async (req: Request, res: Response) => {
  const users = await getuserByadminService();
  return makerespon({ res, data: users, message: "Users fetched" });
});


export const UserActiveAndDeactive = asyerrohander(async (req: Request, res: Response) => {
  const id = String((req.params as any).id);
  const status = (req.body as any).isActive;
  const users = await ActiveAndDeactiveUserServices(id, status);
  return makerespon({ res, data: users, message: "Users fetched" });
});

