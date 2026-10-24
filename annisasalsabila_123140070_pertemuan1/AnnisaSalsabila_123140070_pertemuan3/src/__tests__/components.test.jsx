import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookForm from '../components/BookForm/BookForm';
import BookFilter from '../components/BookFilter/BookFilter';
import BookList from '../components/BookList/BookList';
import BookItem from '../components/BookItem/BookItem';

const sampleBook = { id: 'b1', title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', status: 'baca' };

describe('BookForm', () => {
  it('menampilkan pesan error dan tidak submit saat kolom wajib kosong', async () => {
    const onSubmit = vi.fn();
    render(<BookForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Tambah buku' }));

    expect(screen.getByText('Judul buku wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Nama penulis wajib diisi.')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Judul/)).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('menolak input yang hanya berisi spasi', async () => {
    const onSubmit = vi.fn();
    render(<BookForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/^Judul/), '   ');
    await userEvent.type(screen.getByLabelText(/^Penulis/), '   ');
    await userEvent.click(screen.getByRole('button', { name: 'Tambah buku' }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('memanggil onSubmit dengan data benar dan mengosongkan form (mode tambah)', async () => {
    const onSubmit = vi.fn();
    render(<BookForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/^Judul/), 'Laskar Pelangi');
    await userEvent.type(screen.getByLabelText(/^Penulis/), 'Andrea Hirata');
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'beli');
    await userEvent.click(screen.getByRole('button', { name: 'Tambah buku' }));

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Laskar Pelangi', author: 'Andrea Hirata', status: 'beli' });
    expect(screen.getByLabelText(/^Judul/)).toHaveValue('');
  });

  it('terisi data awal dan menampilkan tombol simpan pada mode edit', () => {
    render(<BookForm initialValues={sampleBook} onSubmit={() => {}} />);
    expect(screen.getByLabelText(/^Judul/)).toHaveValue('Bumi Manusia');
    expect(screen.getByRole('button', { name: 'Simpan perubahan' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Batal' })).toBeInTheDocument();
  });
});

describe('BookFilter', () => {
  it('memanggil callback saat status dipilih dan kata kunci diketik', async () => {
    const onStatusChange = vi.fn();
    const onQueryChange = vi.fn();
    render(<BookFilter status="semua" query="" onStatusChange={onStatusChange} onQueryChange={onQueryChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Sedang dibaca' }));
    expect(onStatusChange).toHaveBeenCalledWith('baca');

    await userEvent.type(screen.getByLabelText('Cari buku'), 'a');
    expect(onQueryChange).toHaveBeenCalledWith('a');
  });

  it('menandai filter aktif dengan aria-pressed', () => {
    render(<BookFilter status="beli" query="" onStatusChange={() => {}} onQueryChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Ingin dibeli' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Semua' })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('BookList & BookItem', () => {
  it('menampilkan pesan kosong yang berbeda untuk koleksi kosong vs hasil filter kosong', () => {
    const { rerender } = render(<BookList books={[]} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/Belum ada buku/)).toBeInTheDocument();

    rerender(<BookList books={[]} isFiltering onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/Tidak ada buku yang cocok/)).toBeInTheDocument();
  });

  it('merender seluruh buku pada daftar', () => {
    const books = [sampleBook, { id: 'b2', title: 'Cantik Itu Luka', author: 'Eka Kurniawan', status: 'milik' }];
    render(<BookList books={books} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('memanggil onEdit dan onDelete dengan data buku', async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<ul><BookItem book={sampleBook} onEdit={onEdit} onDelete={onDelete} /></ul>);

    await userEvent.click(screen.getByRole('button', { name: 'Edit Bumi Manusia' }));
    await userEvent.click(screen.getByRole('button', { name: 'Hapus Bumi Manusia' }));

    expect(onEdit).toHaveBeenCalledWith(sampleBook);
    expect(onDelete).toHaveBeenCalledWith(sampleBook);
  });
});
