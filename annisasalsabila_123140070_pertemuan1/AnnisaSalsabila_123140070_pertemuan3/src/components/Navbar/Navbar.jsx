import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

/** Navigasi antar halaman (React Router). */
function Navbar({ title }) {
  return (
    <header className="navbar">
      <span className="navbar__brand">{title}</span>
      <nav aria-label="Navigasi utama">
        <NavLink to="/" end>
          Koleksi
        </NavLink>
        <NavLink to="/stats">Statistik</NavLink>
      </nav>
    </header>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Navbar;
