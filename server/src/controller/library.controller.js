import { Book, BookIssue } from "../model/library.model.js";

export const issueBook = async (req, res) => {
  try {
    const { studentId, isbn, dueDate } = req.body;
    if (!studentId || !isbn || !dueDate) {
      return res.status(400).json({ success: false, message: "Required fields: studentId, isbn, dueDate" });
    }

    const book = await Book.findOne({ isbn });
    if (!book) return res.status(404).json({ success: false, message: "Book not found in catalog" });

    if (book.availableQuantity <= 0) {
      return res.status(400).json({ success: false, message: "Book is currently out of stock" });
    }

    book.availableQuantity -= 1;
    await book.save();

    const issue = await BookIssue.create({
      bookId: book._id,
      studentId,
      dueDate,
      status: "Issued",
    });

    res.status(201).json({ success: true, message: "Book issued successfully", issue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { id } = req.params; // BookIssue ID
    const issue = await BookIssue.findById(id);
    if (!issue) return res.status(404).json({ success: false, message: "Issue log record not found" });

    if (issue.status === "Returned") {
      return res.status(400).json({ success: false, message: "Book already returned" });
    }

    const book = await Book.findById(issue.bookId);
    if (book) {
      book.availableQuantity += 1;
      await book.save();
    }

    issue.returnDate = new Date();
    issue.status = "Returned";

    // Calculate overdue fine if returned past due date ($1/day)
    const dueTime = new Date(issue.dueDate).getTime();
    const returnTime = issue.returnDate.getTime();
    if (returnTime > dueTime) {
      const diffDays = Math.ceil((returnTime - dueTime) / (1000 * 60 * 60 * 24));
      issue.fineAmount = diffDays * 1; // $1.00 per day
    }

    await issue.save();

    res.status(200).json({ success: true, message: "Book returned successfully", issue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLibraryStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const activeIssues = await BookIssue.countDocuments({ status: "Issued" });
    const overdueIssues = await BookIssue.countDocuments({ status: "Overdue" });

    res.status(200).json({
      success: true,
      stats: {
        totalBooks,
        activeIssues,
        overdueIssues
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
