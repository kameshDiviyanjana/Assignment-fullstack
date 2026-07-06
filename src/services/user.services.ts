import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { sanitizeBody } from "../utils/sanitize";
import { createUserRepositorie, deleteUserRepositorie, getAllUserAdminRepository, getAllUsersRepository, getUserRepositorie, updateUserRepositorie } from "../repositories/user.repositories";
import { updateTaskSchema } from "../utils/validation";

export const createUserService = async (data: any) => {


   try{
    const safe = sanitizeBody(data);
      const user = await createUserRepositorie(safe);
     return user;
   }catch(err){
    throw new Error("Error creating user: " + (err as Error).message);
   }
};

export const getUserService = async (id: string) => {

    try{
        const user = await getUserRepositorie(id);
        return user;
    } catch (err) {
        throw new Error("Error fetching user: " + (err as Error).message);
    }

};

export const getAllUsersService = async (params: any) => {

    try{
        const users = await getAllUsersRepository(params);
        return users;
    } catch (err) {
        throw new Error("Error fetching users: " + (err as Error).message);
    }
};

export const updateUserService = async (id: string, data: any) => {

    try{
        const uupdatedata = sanitizeBody(data);
        
        const valiadte = await updateTaskSchema.safeParse(uupdatedata);
        const results = await updateUserRepositorie(id, valiadte);
        return results;
    } catch (err) {
        throw new Error("Error updating user: " + (err as Error).message);
    }
};

export const deleteUserService = async (id: string) => {
  try {
    await deleteUserRepositorie(id);
    return true;
  } catch (err) {
    throw new Error("Error deleting user: " + (err as Error).message);
  }
};


export const getuserByadminService = async () => {
    try {
        const users = await getAllUserAdminRepository();
        return users;
    } catch (err) {
        throw new Error("Error fetching users: " + (err as Error).message);
    }
}