import PropTypes from 'prop-types';
import { FILTER_ALL, STATUS_OPTIONS } from '../../constants/status';
import './BookFilter.css';

const FILTER_OPTIONS = [{ value: FILTER_ALL, label: 'Semua' }, ...STATUS_OPTIONS];

/** Pencarian (judul/penulis) dan filter status. */
function BookFilter({ status, query, onStatusChange, onQueryChange }) {
  return (
    <div className="book-filter">
      <div className="book-filter__search">
        <label htmlFor="book-search">Cari buku</label>
        <input
          id="book-search"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Ketik judul atau nama penulis"
        />
      </div>
      <div className="book-filter__status" role="group" aria-label="Filter berdasarkan status">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`chip ${status === opt.value ? 'chip--active' : ''}`}
            aria-pressed={status === opt.value}
            onClick={() => onStatusChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

BookFilter.propTypes = {
  status: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onQueryChange: PropTypes.func.isRequired,
};

export default BookFilter;
