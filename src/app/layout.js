import './globals.css';
import Link from 'next/link';
import { MercaderProvider } from '../context/MercaderContext';
import Header from '../components/Header';

export const metadata = {
  title: 'D&D Inventory | Códice del Dungeon Master',
  description: 'Tomo de Insumos, Reliquias, Calculadora Comercial y Transmutador de Divisas para D&D 5e.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <MercaderProvider>
          <Header />
          {children}
          <footer className="site-footer">
            <div className="footer-inner">
              <p style={{ margin: 0 }}>
                <strong>D&D Inventory</strong> — Herramienta de asistencia para Dungeon Masters.
              </p>
            </div>
          </footer>
        </MercaderProvider>
      </body>
    </html>
  );
}