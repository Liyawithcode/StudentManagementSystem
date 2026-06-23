import { Fee } from "../model/fee.model.js";

export const createFeeRecord = async (feeData) => {
  return await Fee.create(feeData);
};

export const getFeeRecordById = async (id) => {
  return await Fee.findById(id);
};

export const findAllFeeRecords = async () => {
  return await Fee.find();
};

export const findFeesByStudentId = async (studentId) => {
  return await Fee.find({ studentId });
};

export const updateFeeRecord = async (id, updateData) => {
  return await Fee.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteFeeRecord = async (id) => {
  return await Fee.findByIdAndDelete(id);
};
