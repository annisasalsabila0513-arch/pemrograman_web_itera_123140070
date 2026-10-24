import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';

/** Root aplikasi: navbar + routing multi-halaman. Provider & Router dipasang di main.jsx. */
function App() {
  return (
    <>
      <Navbar title="Rak Buku" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
