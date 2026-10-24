import { useState } from 'react';
import BookForm from '../../components/BookForm/BookForm';
import BookFilter from '../../components/BookFilter/BookFilter';
import BookList from '../../components/BookList/BookList';
import { useBooks } from '../../context/BookContext';
import { FILTER_ALL } from '../../constants/status';
import './Home.css';

/** Halaman utama: form tambah/edit di kiri, pencarian + daftar buku di kanan. */
function Home() {
  const {
    filteredBooks,
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    addBook,
    updateBook,
    deleteBook,
  } = useBooks();

  // Buku yang sedang diedit (null = form dalam mode tambah).
  const [editingBook, setEditingBook] = useState(null);

  const handleSubmit = (values) => {
    if (editingBook) {
      updateBook(editingBook.id, values);
      setEditingBook(null);
    } else {
      addBook(values);
    }
  };

  const handleDelete = (book) => {
    if (!window.confirm(`Hapus "${book.title}" dari koleksi?`)) return;
    deleteBook(book.id);
    if (editingBook && editingBook.id === book.id) setEditingBook(null);
  };

  const isFiltering = statusFilter !== FILTER_ALL || searchQuery.trim() !== '';

  return (
    <main className="home">
      <section className="home__form" aria-labelledby="form-heading">
        <h2 id="form-heading">{editingBook ? 'Edit buku' : 'Tambah buku'}</h2>
        {/* `key` memaksa form dibuat ulang saat berpindah antara tambah / edit buku lain. */}
        <BookForm
          key={editingBook ? editingBook.id : 'new'}
          initialValues={editingBook}
          onSubmit={handleSubmit}
          onCancel={() => setEditingBook(null)}
        />
      </section>

      <section className="home__list" aria-labelledby="list-heading">
        <h2 id="list-heading">Koleksi buku</h2>
        <BookFilter
          status={statusFilter}
          query={searchQuery}
          onStatusChange={setStatusFilter}
          onQueryChange={setSearchQuery}
        />
        <BookList
          books={filteredBooks}
          isFiltering={isFiltering}
          onEdit={setEditingBook}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}

export default Home;
