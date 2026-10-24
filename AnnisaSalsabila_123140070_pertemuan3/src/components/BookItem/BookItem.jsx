import PropTypes from 'prop-types';
import { STATUS_LABELS, STATUS_VALUES } from '../../constants/status';
import './BookItem.css';

/** Satu kartu buku. Warna sisi kiri mengikuti status (seperti punggung buku). */
function BookItem({ book, onEdit, onDelete }) {
  return (
    <li className={`book-item book-item--${book.status}`}>
      <div className="book-item__info">
        <h3 className="book-item__title">{book.title}</h3>
        <p className="book-item__author">{book.author}</p>
        <span className={`badge badge--${book.status}`}>{STATUS_LABELS[book.status]}</span>
      </div>
      <div className="book-item__actions">
        <button type="button" className="btn" onClick={() => onEdit(book)} aria-label={`Edit ${book.title}`}>
          Edit
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => onDelete(book)}
          aria-label={`Hapus ${book.title}`}
        >
          Hapus
        </button>
      </div>
    </li>
  );
}

BookItem.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(STATUS_VALUES).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookItem;
