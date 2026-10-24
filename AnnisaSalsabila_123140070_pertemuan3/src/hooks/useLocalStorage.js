import { useEffect, useState } from 'react';

/**
 * Custom hook: state yang otomatis tersinkron dengan localStorage.
 * - Nilai awal dibaca sekali (lazy initializer) saat komponen pertama dirender.
 * - Setiap perubahan nilai disimpan kembali lewat useEffect.
 * - Aman dari error (JSON rusak / storage tidak tersedia): kembali ke initialValue.
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Abaikan: mis. storage penuh atau diblokir. Data tetap ada di memori.
    }
  }, [key, value]);

  return [value, setValue];
}
