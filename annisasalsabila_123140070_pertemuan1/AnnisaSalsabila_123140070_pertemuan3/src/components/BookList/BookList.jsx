import PropTypes from 'prop-types';
import BookItem from '../BookItem/BookItem';
import { STATUS_VALUES } from '../../constants/status';
import './BookList.css';

/** Daftar buku. Setiap item memakai `key` berupa id unik buku. */
function BookList({ books, isFiltering = false, onEdit, onDelete }) {
  if (books.length === 0) {
    return (
      <p className="book-list__empty">
        {isFiltering
          ? 'Tidak ada buku yang cocok. Ubah kata kunci atau filter status.'
          : 'Belum ada buku. Tambahkan buku pertama lewat formulir.'}
      </p>
    );
  }

  return (
    <ul className="book-list" aria-label="Daftar buku">
      {books.map((book) => (
        <BookItem key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.oneOf(STATUS_VALUES).isRequired,
    })
  ).isRequired,
  isFiltering: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookList;
