import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useBooks } from '../../context/BookContext';
import useBookStats from '../../hooks/useBookStats';
import { STATUS_OPTIONS } from '../../constants/status';
import './Stats.css';

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

/** Halaman statistik koleksi (memakai custom hook useBookStats). */
function Stats() {
  const { books } = useBooks();
  const { total, byStatus, percentage, authorCount } = useBookStats(books);

  if (total === 0) {
    return (
      <main className="stats">
        <h2>Statistik</h2>
        <p className="stats__empty">
          Belum ada data. <Link to="/">Tambahkan buku</Link> untuk melihat statistik.
        </p>
      </main>
    );
  }

  return (
    <main className="stats">
      <h2>Statistik</h2>
      <div className="stats__cards">
        <StatCard label="Total buku" value={total} />
        <StatCard label="Penulis berbeda" value={authorCount} />
      </div>

      <h3>Sebaran status</h3>
      <ul className="stats__bars">
        {STATUS_OPTIONS.map((opt) => (
          <li key={opt.value}>
            <div className="stats__bar-head">
              <span>{opt.label}</span>
              <span>
                {byStatus[opt.value]} buku ({percentage[opt.value]}%)
              </span>
            </div>
            <div className="stats__track">
              <div
                className={`stats__fill stats__fill--${opt.value}`}
                style={{ width: `${percentage[opt.value]}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Stats;
