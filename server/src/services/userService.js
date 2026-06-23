import { User } from "../model/user.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findAllUsers = async () => {
  return await User.find();
};

export const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
