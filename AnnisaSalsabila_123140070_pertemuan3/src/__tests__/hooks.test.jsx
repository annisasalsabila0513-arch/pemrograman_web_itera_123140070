import { act, renderHook } from '@testing-library/react';
import useLocalStorage from '../hooks/useLocalStorage';
import useBookStats from '../hooks/useBookStats';

describe('useLocalStorage', () => {
  it('memakai nilai awal jika localStorage kosong', () => {
    const { result } = renderHook(() => useLocalStorage('kunci-test', ['awal']));
    expect(result.current[0]).toEqual(['awal']);
  });

  it('membaca nilai yang sudah tersimpan dan menyimpan perubahan baru', () => {
    window.localStorage.setItem('kunci-test', JSON.stringify(['lama']));
    const { result } = renderHook(() => useLocalStorage('kunci-test', []));
    expect(result.current[0]).toEqual(['lama']);

    act(() => result.current[1](['baru']));
    expect(JSON.parse(window.localStorage.getItem('kunci-test'))).toEqual(['baru']);
  });

  it('kembali ke nilai awal jika isi localStorage bukan JSON valid', () => {
    window.localStorage.setItem('kunci-test', '{rusak');
    const { result } = renderHook(() => useLocalStorage('kunci-test', 'cadangan'));
    expect(result.current[0]).toBe('cadangan');
  });
});

describe('useBookStats', () => {
  const books = [
    { id: '1', title: 'A', author: 'Tere Liye', status: 'milik' },
    { id: '2', title: 'B', author: 'tere liye', status: 'baca' },
    { id: '3', title: 'C', author: 'Andrea Hirata', status: 'milik' },
    { id: '4', title: 'D', author: 'Pram', status: 'beli' },
  ];

  it('menghitung total, jumlah per status, persentase, dan penulis unik', () => {
    const { result } = renderHook(() => useBookStats(books));
    expect(result.current.total).toBe(4);
    expect(result.current.byStatus).toEqual({ milik: 2, baca: 1, beli: 1 });
    expect(result.current.percentage.milik).toBe(50);
    expect(result.current.authorCount).toBe(3); // "Tere Liye" dihitung sekali
  });

  it('menangani daftar kosong tanpa pembagian dengan nol', () => {
    const { result } = renderHook(() => useBookStats([]));
    expect(result.current.total).toBe(0);
    expect(result.current.percentage).toEqual({ milik: 0, baca: 0, beli: 0 });
  });
});
