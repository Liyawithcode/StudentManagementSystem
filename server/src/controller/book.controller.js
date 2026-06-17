import { Book } from "../model/library.model.js";

export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, quantity } = req.body;
    if (!title || !author || !isbn) {
      return res.status(400).json({ success: false, message: "Required fields: title, author, isbn" });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      quantity: quantity || 1,
      availableQuantity: quantity || 1,
    });

    res.status(201).json({ success: true, message: "Book added to catalog", book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ success: true, count: books.length, books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
