import { User } from "../model/user.model.js";
import { BaseService } from "./baseService.js";

const userDb = new BaseService(User);

export const findUserByEmail = (email) => userDb.findOne({ email });
export const findUserById = (id) => userDb.findById(id);
export const createUser = (userData) => userDb.create(userData);
export const findAllUsers = () => userDb.find();
export const updateUser = (id, updateData) => userDb.findByIdAndUpdate(id, updateData);
export const deleteUser = (id) => userDb.findByIdAndDelete(id);
