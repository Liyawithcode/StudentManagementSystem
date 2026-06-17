import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Book author is required"],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Total quantity is required"],
      min: 0,
      default: 1,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
  },
  { timestamps: true }
);

const bookIssueSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      trim: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    fineAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Issued", "Returned", "Overdue"],
      default: "Issued",
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
export const BookIssue = mongoose.model("BookIssue", bookIssueSchema);
