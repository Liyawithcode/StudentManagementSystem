import { Timetable } from "../model/timetable.model.js";

export const addTimetableSlot = async (slotData) => {
  return await Timetable.create(slotData);
};

export const findTimetableByClassDetails = async (className, section, batch) => {
  return await Timetable.find({ className, section, batch });
};

export const deleteTimetableSlot = async (id) => {
  return await Timetable.findByIdAndDelete(id);
};
