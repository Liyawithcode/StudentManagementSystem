import { Facility } from "../model/facility.model.js";

// Create Facility
export const createFacility = async (req, res) => {
  try {
    const { name, description, location, status, capacity } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Facility name and location are required",
      });
    }

    const existingFacility = await Facility.findOne({ name });
    if (existingFacility) {
      return res.status(400).json({
        success: false,
        message: "Facility with this name already exists",
      });
    }

    const facility = await Facility.create({
      name,
      description,
      location,
      status: status || "Available",
      capacity: capacity || 0,
    });

    res.status(201).json({
      success: true,
      message: "Facility created successfully",
      facility,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Facilities
export const getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find();

    res.status(200).json({
      success: true,
      count: facilities.length,
      facilities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Facility by ID
export const getFacilityById = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await Facility.findById(id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found",
      });
    }

    res.status(200).json({
      success: true,
      facility,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Facility
export const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, status, capacity } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (location) updateData.location = location;
    if (status) updateData.status = status;
    if (capacity !== undefined) updateData.capacity = capacity;

    const facility = await Facility.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Facility updated successfully",
      facility,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Facility
export const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await Facility.findByIdAndDelete(id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Facility deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
