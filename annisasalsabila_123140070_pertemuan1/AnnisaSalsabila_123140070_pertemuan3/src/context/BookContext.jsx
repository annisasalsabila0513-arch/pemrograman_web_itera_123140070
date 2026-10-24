import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';
import { FILTER_ALL } from '../constants/status';

export const STORAGE_KEY = 'rak-buku:books';

const BookContext = createContext(null);

// ID unik sederhana (tidak bergantung pada crypto.randomUUID agar aman di semua lingkungan).
const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Provider yang menyimpan SELURUH state aplikasi:
 * daftar buku (persisten di localStorage), filter status, dan kata kunci pencarian.
 */
export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage(STORAGE_KEY, []);
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL);
  const [searchQuery, setSearchQuery] = useState('');

  const addBook = useCallback(
    ({ title, author, status }) => {
      const newBook = { id: createId(), title: title.trim(), author: author.trim(), status };
      setBooks((prev) => [newBook, ...prev]);
    },
    [setBooks]
  );

  const updateBook = useCallback(
    (id, { title, author, status }) => {
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, title: title.trim(), author: author.trim(), status } : b))
      );
    },
    [setBooks]
  );

  const deleteBook = useCallback(
    (id) => {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    },
    [setBooks]
  );

  // Buku yang tampil = hasil filter status + pencarian judul/penulis.
  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return books.filter((b) => {
      const matchStatus = statusFilter === FILTER_ALL || b.status === statusFilter;
      const matchQuery =
        query === '' || b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
      return matchStatus && matchQuery;
    });
  }, [books, statusFilter, searchQuery]);

  const value = useMemo(
    () => ({
      books,
      filteredBooks,
      statusFilter,
      searchQuery,
      setStatusFilter,
      setSearchQuery,
      addBook,
      updateBook,
      deleteBook,
    }),
    [books, filteredBooks, statusFilter, searchQuery, addBook, updateBook, deleteBook]
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook akses context, dengan pesan error jelas jika dipakai di luar Provider.
export function useBooks() {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBooks harus dipakai di dalam <BookProvider>');
  return ctx;
}
