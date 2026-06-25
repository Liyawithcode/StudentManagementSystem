import { Fee } from "../model/fee.model.js";
import { BaseService } from "./baseService.js";

const feeDb = new BaseService(Fee);

export const createFeeRecord = (feeData) => feeDb.create(feeData);
export const getFeeRecordById = (id) => feeDb.findById(id);
export const findAllFeeRecords = () => feeDb.find();
export const findFeesByStudentId = (studentId) => feeDb.find({ studentId });
export const updateFeeRecord = (id, updateData) =>
  feeDb.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
export const deleteFeeRecord = (id) => feeDb.findByIdAndDelete(id);
