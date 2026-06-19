import express from "express";
import { issueBook, returnBook, getLibraryStats } from "../controller/library.controller.js";
import { addBook, getBooks, deleteBook } from "../controller/book.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

export const libraryRouter = express.Router();

libraryRouter.use(protect);

// Books inventory management
libraryRouter.route("/books")
    .get(getBooks)
    .post(restrictTo("admin", "faculty"), addBook);

libraryRouter.delete("/books/:id", restrictTo("admin"), deleteBook);

// Issuing & returning books
libraryRouter.post("/issue", restrictTo("admin", "faculty"), issueBook);
libraryRouter.post("/return/:id", restrictTo("admin", "faculty"), returnBook);

// Library statistics
libraryRouter.get("/stats", restrictTo("admin", "faculty"), getLibraryStats);
