import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Bersihkan DOM dan localStorage setelah tiap test agar test saling independen.
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
