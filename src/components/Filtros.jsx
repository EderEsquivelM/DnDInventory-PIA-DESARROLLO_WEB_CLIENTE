"use client";
import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

const CATEGORIES = [
    { id: '', label: 'Todos', icon: 'sliders' },
    { id: 'weapons', label: 'Armamento', icon: 'sword' },
    { id: 'armor', label: 'Armaduras', icon: 'shield' },
    { id: 'travel', label: 'Viaje', icon: 'horse' },
    { id: 'consumables', label: 'Consumibles', icon: 'potion' }
];

const SUBCATEGORIES = {
    '': [{ id: '', label: 'Todas las disciplinas' }],
    weapons: [
        { id: '', label: 'Todas' },
        { id: 'simple', label: 'Armas Simples' },
        { id: 'martial', label: 'Armas Marciales' }
    ],
    armor: [
        { id: '', label: 'Todas' },
        { id: 'light', label: 'Ligera (Movilidad)' },
        { id: 'medium', label: 'Media (Equilibrio)' },
        { id: 'heavy', label: 'Pesada (Defensa)' }
    ],
    travel: [
        { id: '', label: 'Todos' },
        { id: 'mounts', label: 'Bestias de Monta' },
        { id: 'vehicles', label: 'Carruajes & Barcos' }
    ],
    consumables: [
        { id: '', label: 'Todos' },
        { id: 'potion', label: 'Elixires & Raciones' },
        { id: 'scroll', label: 'Pergaminos Arcanos' }
    ]
};

export default function FiltrosRitual({
    itemsCountByCategory,
    searchQuery, setSearchQuery,
    categoria, setCategoria,
    subCategoria, setSubCategoria,
    maxPrice, setMaxPrice,
    maxWeight, setMaxWeight,
    minAc, setMinAc,
    noStealthDis, setNoStealthDis,
    dmgType, setDmgType,
    resetFilters, aplicarFiltros
}) {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filterError, setFilterError] = useState('');
    const searchInputRef = useRef(null);

    // Atajo Ctrl+K / Cmd+K para enfocar el buscador
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleCategorySelect = (catId) => {
        setCategoria(catId);
        setSubCategoria('');
        setFilterError('');
        aplicarFiltros({ nextCategoria: catId, nextSubCategoria: '' });
    };

    const handleSubCategorySelect = (subId) => {
        setSubCategoria(subId);
        aplicarFiltros({ nextCategoria: categoria, nextSubCategoria: subId });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (maxPrice !== '' && Number(maxPrice) < 0) {
            setFilterError('El tributo máximo en oro no puede ser negativo.');
            return;
        }
        if (maxWeight !== '' && Number(maxWeight) < 0) {
            setFilterError('La carga máxima en kg no puede ser negativa.');
            return;
        }
        if (categoria === 'armor' && minAc !== '' && (Number(minAc) < 10 || Number(minAc) > 30)) {
            setFilterError('La Defensa (AC) en D&D debe estar entre 10 y 30.');
            return;
        }

        setFilterError('');
        aplicarFiltros();
        setMobileFiltersOpen(false);
    };

    const handleFormReset = () => {
        setFilterError('');
        resetFilters();
    };

    const currentChips = SUBCATEGORIES[categoria] || SUBCATEGORIES[''];
    const activeCategoryName = CATEGORIES.find((c) => c.id === categoria)?.label || 'Todos';

    return (
        <>
            {/* HERO CON BUSCADOR */}
            <section className="hero-banner" aria-labelledby="hero-heading">
                <div>
                    <h2 id="hero-heading" className="hero-title">Inventario de Campaña</h2>
                    <p className="eyebrow">
                        Consulta equipo, precios y propiedades sin interrumpir la aventura.
                    </p>
                </div>

                <div className="search-box">
                    <Icon name="search" size={19} />
                    <label className="sr-only" htmlFor="search-item-input">
                        Buscar objeto por nombre
                    </label>
                    <input
                        ref={searchInputRef}
                        id="search-item-input"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar reliquia u objeto..."
                    />
                    <kbd aria-hidden="true">⌘ K</kbd>
                </div>
            </section>

            {/* NAVEGACIÓN DE FILTROS CON BOTÓN HAMBURGUESA EN MÓVIL */}
            <section className="filter-navigation" aria-label="Filtros del inventario">
                {/* Botón tipo Hamburguesa / Desplegable exclusivo para Móvil */}
                <button
                    type="button"
                    className="mobile-filter-toggle"
                    onClick={() => setMobileFiltersOpen((prev) => !prev)}
                    aria-expanded={mobileFiltersOpen}
                    aria-controls="collapsible-filters-body"
                >
                    <span className="mobile-filter-toggle-left">
                        <Icon name="sliders" size={18} />
                        <span>Filtros y Categorías</span>
                        <small className="mobile-active-badge">{activeCategoryName}</small>
                    </span>
                    <Icon name={mobileFiltersOpen ? 'close' : 'menu'} size={20} />
                </button>

                {/* Cuerpo colapsable en móvil, siempre visible en Tablet y PC */}
                <div
                    id="collapsible-filters-body"
                    className={`filter-collapsible-body ${mobileFiltersOpen ? 'is-open' : ''}`}
                >
                    {/* Pestañas de Categoría con Ícono y Contador */}
                    <div className="category-tabs" role="tablist" aria-label="Categorías de objetos">
                        {CATEGORIES.map((cat) => {
                            const isSelected = categoria === cat.id;
                            const count = itemsCountByCategory[cat.id] ?? 0;
                            return (
                                <button
                                    key={cat.id || 'all'}
                                    type="button"
                                    role="tab"
                                    aria-selected={isSelected}
                                    className={isSelected ? 'selected' : ''}
                                    onClick={() => handleCategorySelect(cat.id)}
                                >
                                    <Icon name={cat.icon} size={18} />
                                    <span>{cat.label}</span>
                                    <small>{count}</small>
                                </button>
                            );
                        })}
                    </div>

                    {/* Barra de Subcategorías (Chips) + Botón de Filtros Avanzados */}
                    <div className="subfilter-bar">
                        <div className="subfilter-label">
                            <Icon name="sliders" size={15} />
                            <span>Disciplina</span>
                        </div>

                        <div className="filter-chips" role="group" aria-label="Subcategorías">
                            {currentChips.map((chip) => (
                                <button
                                    key={chip.id || 'all-sub'}
                                    type="button"
                                    className={subCategoria === chip.id ? 'selected' : ''}
                                    aria-pressed={subCategoria === chip.id}
                                    onClick={() => handleSubCategorySelect(chip.id)}
                                >
                                    {chip.label}
                                </button>
                            ))}
                        </div>

                        <div className="subfilter-actions">
                            <button
                                type="button"
                                className="advanced-toggle-btn"
                                aria-expanded={showAdvanced}
                                aria-controls="advanced-filters-form"
                                onClick={() => setShowAdvanced((prev) => !prev)}
                            >
                                {showAdvanced ? 'Ocultar parámetros −' : 'Parámetros avanzados +'}
                            </button>

                            {(categoria || subCategoria || searchQuery || maxPrice || maxWeight || minAc || noStealthDis || dmgType) && (
                                <button
                                    type="button"
                                    className="clear-button"
                                    onClick={handleFormReset}
                                >
                                    Limpiar todo
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Formulario de Parámetros Avanzados */}
                    <form
                        id="advanced-filters-form"
                        className={showAdvanced ? 'advanced-filters-form' : 'advanced-filters-form hidden'}
                        onSubmit={handleFormSubmit}
                        onReset={handleFormReset}
                        noValidate
                    >
                        <div className="filter-grid">
                            <label className="filter-field" htmlFor="filter-max-price">
                                <span className="filter-label">Tributo Máx (Oro)</span>
                                <input
                                    id="filter-max-price"
                                    type="number"
                                    min="0"
                                    placeholder="Ej. 50"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </label>

                            <label className="filter-field" htmlFor="filter-max-weight">
                                <span className="filter-label">Carga Máx (kg)</span>
                                <input
                                    id="filter-max-weight"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    placeholder="Ej. 10"
                                    value={maxWeight}
                                    onChange={(e) => setMaxWeight(e.target.value)}
                                />
                            </label>

                            {categoria === 'armor' && (
                                <>
                                    <label className="filter-field" htmlFor="filter-min-ac">
                                        <span className="filter-label">Defensa (AC) Mínima (10-30)</span>
                                        <input
                                            id="filter-min-ac"
                                            type="number"
                                            min="10"
                                            max="30"
                                            placeholder="Ej. 14"
                                            value={minAc}
                                            onChange={(e) => setMinAc(e.target.value)}
                                        />
                                    </label>
                                    <label className="check-field" htmlFor="filter-stealth" style={{ alignSelf: 'end', paddingBottom: '0.5rem' }}>
                                        <input
                                            id="filter-stealth"
                                            type="checkbox"
                                            checked={noStealthDis}
                                            onChange={(e) => setNoStealthDis(e.target.checked)}
                                        />
                                        <span>Favorece Sigilo</span>
                                    </label>
                                </>
                            )}

                            {categoria === 'weapons' && (
                                <label className="filter-field" htmlFor="filter-dmg-type">
                                    <span className="filter-label">Tipo de Estrago</span>
                                    <select
                                        id="filter-dmg-type"
                                        value={dmgType}
                                        onChange={(e) => setDmgType(e.target.value)}
                                    >
                                        <option value="">Cualquier tipo...</option>
                                        <option value="slashing">Cortante</option>
                                        <option value="piercing">Perforante</option>
                                        <option value="bludgeoning">Contundente</option>
                                    </select>
                                </label>
                            )}
                        </div>

                        {filterError && (
                            <p role="alert" style={{ margin: '1rem 0 0', color: 'var(--color-5)', fontSize: '0.9rem' }}>
                                {filterError}
                            </p>
                        )}

                        <div className="filter-actions">
                            <button type="reset" className="solid-button secondary">
                                Disipar Parámetros
                            </button>
                            <button type="submit" className="apply-filters-button">
                                Aplicar Parámetros
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}