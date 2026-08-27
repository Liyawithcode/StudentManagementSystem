import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config_ENV } from "./config/auth.config.js";
import { errorMiddleware } from "./middleware/auth.middleware.js";

// Import Routers
import { authRouter } from "./routes/auth.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { studentRouter } from "./routes/student.routes.js";
import { facultyRouter } from "./routes/faculty.routes.js";
import { courseRouter } from "./routes/course.routes.js";
import { attendanceRouter } from "./routes/attendance.routes.js";
import { resultRouter } from "./routes/result.routes.js";
import { admissionRouter } from "./routes/admission.routes.js";
import { examRouter } from "./routes/exam.routes.js";
import { libraryRouter } from "./routes/library.routes.js";
import { parentRouter } from "./routes/parent.routes.js";
import { communicationRouter } from "./routes/communication.routes.js";
import { reportRouter } from "./routes/report.routes.js";
import { hostelRouter } from "./routes/hostel.routes.js";
import { transportRouter } from "./routes/transport.routes.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { settingsRouter } from "./routes/settings.routes.js";
import { documentRouter } from "./routes/document.routes.js";
import { facilityRouter } from "./routes/facility.routes.js";
import { notificationRouter } from "./routes/notification.routes.js";
import { groupRouter } from "./routes/group.routes.js";

export const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://student-management-system-ke1w.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static("public"));
if (config_ENV.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Register Routers
app.use("/api/auth", authRouter);
app.use("/api/admins", adminRouter);
app.use("/api/students", studentRouter);
app.use("/api/faculties", facultyRouter);
app.use("/api/courses", courseRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/results", resultRouter);
app.use("/api/admissions", admissionRouter);
app.use("/api/exams", examRouter);
app.use("/api/library", libraryRouter);
app.use("/api/parents", parentRouter);
app.use("/api/communication", communicationRouter);
app.use("/api/reports", reportRouter);
app.use("/api/hostels", hostelRouter);
app.use("/api/transport", transportRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/documents", documentRouter);
app.use("/api/facilities", facilityRouter);
app.use("/api/groups", groupRouter);

// Alias to support direct registration routes
app.use("/", authRouter);

app.use(errorMiddleware);