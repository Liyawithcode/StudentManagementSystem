import mongoose from "mongoose";

export const validateObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id);
};

export default validateObjectId;
