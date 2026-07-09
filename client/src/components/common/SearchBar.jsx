import React from 'react';
import { FiSearch } from 'react-icons/fi';
import './common.css';

export const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="search-bar-container">
      <FiSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
