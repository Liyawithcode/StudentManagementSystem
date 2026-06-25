/**
 * Specific middleware validator for student attendance payloads.
 */
export const validateAttendancePayload = (req, res, next) => {
    const { studentId, courseId, status } = req.body;
    if (!studentId || !courseId || !status) {
        return res.status(400).json({
            success: false,
            message: "studentId, courseId, and status are required for attendance logging."
        });
    }
    next();
};
