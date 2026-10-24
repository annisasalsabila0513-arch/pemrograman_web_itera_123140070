import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { BookProvider, STORAGE_KEY } from '../context/BookContext';

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <BookProvider>
        <App />
      </BookProvider>
    </MemoryRouter>
  );
}

async function addBook(title, author, status = 'milik') {
  await userEvent.type(screen.getByLabelText(/^Judul/), title);
  await userEvent.type(screen.getByLabelText(/^Penulis/), author);
  await userEvent.selectOptions(screen.getByLabelText('Status'), status);
  await userEvent.click(screen.getByRole('button', { name: 'Tambah buku' }));
}

describe('Aplikasi Rak Buku (integrasi)', () => {
  beforeEach(() => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('menambah buku, menampilkannya di daftar, dan menyimpannya ke localStorage', async () => {
    renderApp();
    await addBook('Laskar Pelangi', 'Andrea Hirata', 'baca');

    const list = screen.getByRole('list', { name: 'Daftar buku' });
    expect(within(list).getByText('Laskar Pelangi')).toBeInTheDocument();

    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ title: 'Laskar Pelangi', author: 'Andrea Hirata', status: 'baca' });
  });

  it('memuat buku yang sudah tersimpan di localStorage saat aplikasi dibuka', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 'x1', title: 'Negeri 5 Menara', author: 'A. Fuadi', status: 'milik' }])
    );
    renderApp();
    expect(screen.getByText('Negeri 5 Menara')).toBeInTheDocument();
  });

  it('mengedit buku', async () => {
    renderApp();
    await addBook('Judul Lama', 'Penulis A');

    await userEvent.click(screen.getByRole('button', { name: 'Edit Judul Lama' }));
    const titleInput = screen.getByLabelText(/^Judul/);
    expect(titleInput).toHaveValue('Judul Lama');

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Judul Baru');
    await userEvent.click(screen.getByRole('button', { name: 'Simpan perubahan' }));

    expect(screen.getByText('Judul Baru')).toBeInTheDocument();
    expect(screen.queryByText('Judul Lama')).not.toBeInTheDocument();
  });

  it('menghapus buku', async () => {
    renderApp();
    await addBook('Buku Hapus', 'Penulis B');

    await userEvent.click(screen.getByRole('button', { name: 'Hapus Buku Hapus' }));

    expect(screen.queryByText('Buku Hapus')).not.toBeInTheDocument();
    expect(screen.getByText(/Belum ada buku/)).toBeInTheDocument();
  });

  it('memfilter berdasarkan status', async () => {
    renderApp();
    await addBook('Buku Milik', 'Penulis A', 'milik');
    await addBook('Buku Beli', 'Penulis B', 'beli');

    await userEvent.click(screen.getByRole('button', { name: 'Ingin dibeli' }));

    expect(screen.getByText('Buku Beli')).toBeInTheDocument();
    expect(screen.queryByText('Buku Milik')).not.toBeInTheDocument();
  });

  it('mencari berdasarkan judul atau nama penulis', async () => {
    renderApp();
    await addBook('Bumi', 'Tere Liye');
    await addBook('Hujan', 'Eka Kurniawan');

    const search = screen.getByLabelText('Cari buku');
    await userEvent.type(search, 'tere');
    expect(screen.getByText('Bumi')).toBeInTheDocument();
    expect(screen.queryByText('Hujan')).not.toBeInTheDocument();

    await userEvent.clear(search);
    await userEvent.type(search, 'hujan');
    expect(screen.getByText('Hujan')).toBeInTheDocument();
    expect(screen.queryByText('Bumi')).not.toBeInTheDocument();
  });

  it('berpindah ke halaman statistik lewat navigasi', async () => {
    renderApp();
    await addBook('Buku Satu', 'Penulis A');

    await userEvent.click(screen.getByRole('link', { name: 'Statistik' }));

    expect(screen.getByRole('heading', { name: 'Statistik' })).toBeInTheDocument();
    expect(screen.getByText('Total buku')).toBeInTheDocument();
  });
});
