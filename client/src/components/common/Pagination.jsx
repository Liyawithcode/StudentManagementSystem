import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './common.css';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination flex items-center justify-between mt-4">
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
      <div className="pagination-buttons flex gap-2">
        <button
          className="btn btn-secondary pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FiChevronLeft /> Previous
        </button>
        <button
          className="btn btn-secondary pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
