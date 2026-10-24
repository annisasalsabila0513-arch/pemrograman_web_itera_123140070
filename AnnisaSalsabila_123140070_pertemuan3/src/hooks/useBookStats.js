import { useMemo } from 'react';
import { STATUS_VALUES } from '../constants/status';

/**
 * Custom hook: menghitung statistik koleksi buku.
 * Hasil di-memoize sehingga hanya dihitung ulang ketika daftar buku berubah.
 */
export default function useBookStats(books) {
  return useMemo(() => {
    const byStatus = Object.fromEntries(STATUS_VALUES.map((s) => [s, 0]));
    const authors = new Set();

    books.forEach((book) => {
      if (byStatus[book.status] !== undefined) byStatus[book.status] += 1;
      authors.add(book.author.trim().toLowerCase());
    });

    const total = books.length;
    const percentage = Object.fromEntries(
      STATUS_VALUES.map((s) => [s, total === 0 ? 0 : Math.round((byStatus[s] / total) * 100)])
    );

    return { total, byStatus, percentage, authorCount: authors.size };
  }, [books]);
}
