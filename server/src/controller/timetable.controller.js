import { Timetable } from "../model/timetable.model.js";

export const createTimetable = async (req, res) => {
  try {
    const { className, section, batch, subject, day, startTime, endTime, roomNumber, facultyId } = req.body;
    if (!className || !section || !batch || !subject || !day || !startTime || !endTime || !roomNumber || !facultyId) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const timetable = await Timetable.create({
      className,
      section,
      batch,
      subject,
      day,
      startTime,
      endTime,
      roomNumber,
      facultyId
    });

    res.status(201).json({ success: true, message: "Timetable slot created successfully", timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTimetableByClass = async (req, res) => {
  try {
    const { className, section, batch } = req.query;
    if (!className) {
      return res.status(400).json({ success: false, message: "Required query: className" });
    }

    const query = { className };
    if (section) query.section = section;
    if (batch) query.batch = batch;

    const timetable = await Timetable.find(query);
    res.status(200).json({ success: true, count: timetable.length, timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(404).json({ success: false, message: "Timetable slot not found" });
    }
    res.status(200).json({ success: true, message: "Timetable slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
