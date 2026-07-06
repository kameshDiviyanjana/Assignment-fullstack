import { Request, Response, NextFunction } from "express";
import { asyerrohander } from "../utils/errorhandel";
import { makerespon } from "../utils/respons";

export const createController = asyerrohander(async (req: Request, res: Response) => {
  return makerespon({ res, message: "poste create placeholder" });
});

export const getByIdUserPostController = asyerrohander(async (req: Request, res: Response) => {
  return makerespon({ res, message: "get user posts placeholder" });
});

export const invoicesActiveController = asyerrohander(async (req: Request, res: Response) => {
  return makerespon({ res, message: "invoices active placeholder" });
});

export const getUserImageAndVedioUploadController = asyerrohander(async (req: Request, res: Response) => {
  return makerespon({ res, message: "user media placeholder" });
});

export const getByIdController = asyerrohander(async (req: Request, res: Response) => {
  return makerespon({ res, message: "get by id placeholder" });
});

export const getAllController = asyerrohander(async (req: Request, res: Response) => {
  return makerespon({ res, message: "get all public posts placeholder" });
});

export const updateController = asyerrohander(async (req: Request, res: Response) => {
  return makerespon({ res, message: "update placeholder" });
});

export const deleteController = asyerrohander(async (req: Request, res: Response) => {
  return makerespon({ res, message: "delete placeholder" });
});
