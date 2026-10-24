import { useState } from 'react';
import PropTypes from 'prop-types';
import { STATUS_OPTIONS, STATUS_VALUES } from '../../constants/status';
import './BookForm.css';

const EMPTY_VALUES = { title: '', author: '', status: 'milik' };

// Validasi: kolom wajib diisi (tidak boleh kosong / hanya spasi).
export function validateBook(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Judul buku wajib diisi.';
  if (!values.author.trim()) errors.author = 'Nama penulis wajib diisi.';
  if (!STATUS_VALUES.includes(values.status)) errors.status = 'Pilih salah satu status buku.';
  return errors;
}

/**
 * Form controlled component untuk tambah DAN edit buku.
 * Jika `initialValues` diberikan, form berada dalam mode edit.
 */
function BookForm({ initialValues = null, onSubmit, onCancel = () => {} }) {
  const isEditing = Boolean(initialValues);
  const [values, setValues] = useState(
    initialValues
      ? { title: initialValues.title, author: initialValues.author, status: initialValues.status }
      : EMPTY_VALUES
  );
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Hapus pesan error pada kolom yang sedang diperbaiki.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validateBook(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSubmit(values);
    if (!isEditing) {
      setValues(EMPTY_VALUES);
      setErrors({});
    }
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className={`field ${errors.title ? 'field--error' : ''}`}>
        <label htmlFor="book-title">
          Judul <span aria-hidden="true">*</span>
        </label>
        <input
          id="book-title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          placeholder="Contoh: Laskar Pelangi"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'book-title-error' : undefined}
        />
        {errors.title && (
          <p id="book-title-error" className="field__error" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className={`field ${errors.author ? 'field--error' : ''}`}>
        <label htmlFor="book-author">
          Penulis <span aria-hidden="true">*</span>
        </label>
        <input
          id="book-author"
          name="author"
          type="text"
          value={values.author}
          onChange={handleChange}
          placeholder="Contoh: Andrea Hirata"
          aria-invalid={Boolean(errors.author)}
          aria-describedby={errors.author ? 'book-author-error' : undefined}
        />
        {errors.author && (
          <p id="book-author-error" className="field__error" role="alert">
            {errors.author}
          </p>
        )}
      </div>

      <div className={`field ${errors.status ? 'field--error' : ''}`}>
        <label htmlFor="book-status">Status</label>
        <select id="book-status" name="status" value={values.status} onChange={handleChange}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="field__error" role="alert">
            {errors.status}
          </p>
        )}
      </div>

      <div className="book-form__actions">
        <button type="submit" className="btn btn--primary">
          {isEditing ? 'Simpan perubahan' : 'Tambah buku'}
        </button>
        {isEditing && (
          <button type="button" className="btn" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

BookForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(STATUS_VALUES).isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default BookForm;
