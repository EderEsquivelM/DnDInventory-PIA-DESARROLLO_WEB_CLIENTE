"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

export default function Header() {
    const pathname = usePathname();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <header className="site-header">
            <div className="header-inner">
                <div className="header-top-row">
                    <div className="brand">
                        <div className="brand-mark" aria-hidden="true">
                            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M20 2 35 11l-3 18-12 9L8 29 5 11 20 2Z" />
                                <path d="m20 2 3 12 12-3M23 14l9 15M23 14l-3 24M23 14 8 29M23 14 5 11" />
                            </svg>
                        </div>
                        <h1 className="brand-title">
                            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                                D&amp;D Inventory
                            </Link>
                        </h1>
                    </div>

                    <button
                        type="button"
                        className="mobile-menu-btn"
                        onClick={() => setMobileNavOpen((prev) => !prev)}
                        aria-expanded={mobileNavOpen}
                        aria-controls="main-navigation"
                        aria-label={mobileNavOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
                    >
                        <Icon name={mobileNavOpen ? 'close' : 'menu'} size={22} />
                    </button>
                </div>

                <nav
                    id="main-navigation"
                    className={`site-nav ${mobileNavOpen ? 'is-open' : ''}`}
                    aria-label="Navegación principal"
                >
                    <Link
                        href="/"
                        aria-current={pathname === '/' ? 'page' : undefined}
                        onClick={() => setMobileNavOpen(false)}
                    >
                        Códice de Ítems
                    </Link>
                    <Link
                        href="/conversor"
                        aria-current={pathname === '/conversor' ? 'page' : undefined}
                        onClick={() => setMobileNavOpen(false)}
                    >
                        Conversor de Monedas
                    </Link>
                    <Link
                        href="/guia-mercader"
                        aria-current={pathname === '/guia-mercader' ? 'page' : undefined}
                        onClick={() => setMobileNavOpen(false)}
                    >
                        Repartidor de Botín
                    </Link>
                </nav>
            </div>
        </header>
    );
}