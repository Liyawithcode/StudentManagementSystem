import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { libraryService } from '../../services/libraryService.js';
import { toast } from '../../utils/toast.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { FiBookOpen, FiPlus, FiTrash2, FiCornerDownLeft, FiBookmark } from 'react-icons/fi';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

export const LibraryList = () => {
  const { role, user } = useAuth();
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'issues'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);

  // Add Book Form state
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', quantity: 1 });
  // Issue Book Form state
  const [issueForm, setIssueForm] = useState({ studentId: '', isbn: '', dueDate: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const booksRes = await libraryService.getBooks();
      setBooks(booksRes.books || []);
      
      // Let's mock or fetch issued logs if any
      // Since backend doesn't have list endpoint for issues, we will mock some base issues
      // and allow adding new ones which append to state.
      setIssues([
        { _id: 'i1', bookId: { title: 'Clean Code' }, studentId: 'ST-2026-0001', dueDate: '2026-07-20', status: 'Issued' },
        { _id: 'i2', bookId: { title: 'Introduction to Algorithms' }, studentId: 'ST-2026-0002', dueDate: '2026-07-10', status: 'Issued' }
      ]);
    } catch (err) {
      toast.error('Failed to load library catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.isbn) {
      return toast.error('Required fields: Title, Author, ISBN');
    }
    try {
      const res = await libraryService.addBook(newBook);
      if (res.success) {
        toast.success('Book added to library catalog!');
        setBooks([...books, res.book]);
        setShowAddModal(false);
        setNewBook({ title: '', author: '', isbn: '', quantity: 1 });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add book');
    }
  };

  const handleDeleteBook = async () => {
    try {
      const res = await libraryService.deleteBook(deleteBookId);
      if (res.success) {
        toast.success('Book deleted successfully');
        setBooks(books.filter(b => b._id !== deleteBookId));
        setDeleteBookId(null);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete book');
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    if (!issueForm.studentId || !issueForm.isbn || !issueForm.dueDate) {
      return toast.error('Required fields: Student ID, ISBN, Due Date');
    }
    try {
      const res = await libraryService.issueBook(issueForm);
      if (res.success) {
        toast.success('Book issued successfully!');
        
        // Find matching book title
        const bookObj = books.find(b => b.isbn === issueForm.isbn);
        
        // Add to issues state
        const newIssue = {
          _id: res.issue?._id || `i_${Date.now()}`,
          bookId: { title: bookObj?.title || 'Unknown Book' },
          studentId: issueForm.studentId,
          dueDate: issueForm.dueDate,
          status: 'Issued'
        };
        
        setIssues([newIssue, ...issues]);
        
        // Update available quantity in books state
        setBooks(books.map(b => b.isbn === issueForm.isbn ? { ...b, availableQuantity: b.availableQuantity - 1 } : b));
        
        setShowIssueModal(false);
        setIssueForm({ studentId: '', isbn: '', dueDate: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to issue book');
    }
  };

  const handleReturnBook = async (id) => {
    try {
      const res = await libraryService.returnBook(id);
      if (res.success) {
        toast.success('Book returned successfully!');
        
        // Update issues log status to returned
        setIssues(issues.map(iss => {
          if (iss._id === id) {
            return {
              ...iss,
              status: 'Returned',
              returnDate: new Date().toISOString(),
              fineAmount: res.issue?.fineAmount || 0
            };
          }
          return iss;
        }));
        
        // Refresh catalog to reflect returned book availability
        const booksRes = await libraryService.getBooks();
        setBooks(booksRes.books || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to return book');
    }
  };

  const filteredBooks = books.filter((book) => {
    const term = search.toLowerCase();
    const title = (book.title || '').toLowerCase();
    const author = (book.author || '').toLowerCase();
    const isbn = (book.isbn || '').toLowerCase();
    return title.includes(term) || author.includes(term) || isbn.includes(term);
  });

  const filteredIssues = issues.filter((issue) => {
    const term = search.toLowerCase();
    const title = (issue.bookId?.title || '').toLowerCase();
    const student = (issue.studentId || '').toLowerCase();
    return title.includes(term) || student.includes(term);
  });

  if (loading) return <Loader />;

  return (
    <div>
      <Header
        title="Library Inventory Management"
        subtitle="Manage reference books catalog and borrowing logs."
        actions={
          <div className="flex gap-2">
            {['admin', 'faculty'].includes(role) && (
              <>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  <FiPlus /> Add Book
                </Button>
                <Button variant="secondary" onClick={() => setShowIssueModal(true)}>
                  <FiBookmark /> Issue Book
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Tabs */}
      <div className="noticeboard-tabs mt-4">
        <button
          className={`notice-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          Books Catalog
        </button>
        <button
          className={`notice-tab-btn ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          Borrowing Log
        </button>
      </div>

      <div className="flex justify-between items-center mt-4 mb-2 flex-responsive">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={activeTab === 'catalog' ? "Search books by title, author, or ISBN..." : "Search borrow logs by book title or student ID..."}
        />
      </div>

      {activeTab === 'catalog' ? (
        <div className="card mt-4">
          <Table
            headers={['Title', 'Author', 'ISBN', 'Total Qty', 'Available Qty', 'Actions']}
            data={filteredBooks}
            renderRow={(book) => (
              <tr key={book._id}>
                <td style={{ fontWeight: 600 }}>{book.title}</td>
                <td>{book.author}</td>
                <td style={{ fontFamily: 'monospace' }}>{book.isbn}</td>
                <td>{book.quantity}</td>
                <td>
                  <span className={`badge ${book.availableQuantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {book.availableQuantity}
                  </span>
                </td>
                <td>
                  {role === 'admin' && (
                    <Button variant="danger" style={{ padding: '0.4rem' }} onClick={() => setDeleteBookId(book._id)}>
                      <FiTrash2 />
                    </Button>
                  )}
                </td>
              </tr>
            )}
            emptyMessage="No books registered in library catalog"
          />
        </div>
      ) : (
        <div className="card mt-4">
          <Table
            headers={['Book Title', 'Student ID', 'Due Date', 'Status', 'Fines', 'Actions']}
            data={role === 'student' ? filteredIssues.filter(i => i.studentId === user?.studentId) : filteredIssues}
            renderRow={(issue) => (
              <tr key={issue._id}>
                <td style={{ fontWeight: 600 }}>{issue.bookId?.title || 'Unknown Book'}</td>
                <td>{issue.studentId}</td>
                <td>{formatDate(issue.dueDate)}</td>
                <td>
                  <span className={`badge ${issue.status === 'Returned' ? 'badge-success' : 'badge-warning'}`}>
                    {issue.status}
                  </span>
                </td>
                <td>{issue.fineAmount ? `$${issue.fineAmount}` : '-'}</td>
                <td>
                  {issue.status === 'Issued' && ['admin', 'faculty'].includes(role) && (
                    <Button variant="secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => handleReturnBook(issue._id)}>
                      <FiCornerDownLeft /> Return
                    </Button>
                  )}
                </td>
              </tr>
            )}
            emptyMessage="No borrowing log records found"
          />
        </div>
      )}

      {/* Add Book Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Book to Catalog">
        <form onSubmit={handleAddBook} className="flex flex-column gap-4">
          <Input
            label="Book Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            placeholder="e.g. Modern Operating Systems"
            required
          />
          <Input
            label="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            placeholder="e.g. Andrew S. Tanenbaum"
            required
          />
          <Input
            label="ISBN Number"
            value={newBook.isbn}
            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
            placeholder="e.g. 978-0133591620"
            required
          />
          <Input
            label="Quantity"
            type="number"
            value={newBook.quantity}
            onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value) || 1 })}
            min="1"
            required
          />
          <Button type="submit" variant="primary">Add Book</Button>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      <Modal isOpen={showIssueModal} onClose={() => setShowIssueModal(false)} title="Issue Book to Student">
        <form onSubmit={handleIssueBook} className="flex flex-column gap-4">
          <Input
            label="Student ID"
            value={issueForm.studentId}
            onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
            placeholder="e.g. ST-2026-0001"
            required
          />
          <Input
            label="Book ISBN"
            value={issueForm.isbn}
            onChange={(e) => setIssueForm({ ...issueForm, isbn: e.target.value })}
            placeholder="e.g. 978-0133591620"
            required
          />
          <Input
            label="Due Date"
            type="date"
            value={issueForm.dueDate}
            onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
            required
          />
          <Button type="submit" variant="primary">Issue Book</Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteBookId}
        onClose={() => setDeleteBookId(null)}
        onConfirm={handleDeleteBook}
        message="Are you sure you want to delete this book from the catalog? This cannot be undone."
      />
    </div>
  );
};

export default LibraryList;
