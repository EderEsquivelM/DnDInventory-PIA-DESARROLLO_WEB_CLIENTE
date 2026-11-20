"use client";
import { useState, useMemo } from 'react';
import Icon from './Icon';

// Ícono correspondiente a cada item_class_id de dbSeedData
const CLASS_ICONS = {
    1: 'potion', // Consumibles
    2: 'shield', // Armaduras
    3: 'sword',  // Armas
    4: 'horse',  // Transporte y Monturas
    5: 'gear'    // Equipo de Aventura
};

const EMPTY_PROPERTY_FILTERS = {
    consumableDetail: '',
    minAc: '',
    noStrengthReq: false,
    noStealthDis: false,
    dmgType: '',
    dmgDice: '',
    weaponProp: '',
    minCapacity: '',
    speedType: '',
    adventureDetail: ''
};

export default function FiltrosRitual({
    dbSeedData,
    itemsCountByCategory,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
    aplicarFiltros
}) {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filterError, setFilterError] = useState('');

    // Pestañas dinámicas desde dbSeedData.item_classes
    const categoryTabs = useMemo(() => {
        const tabs = [{ id: '', label: 'Todos', icon: 'sliders' }];
        dbSeedData.item_classes.forEach((ic) => {
            tabs.push({
                id: String(ic.id),
                label: ic.name,
                icon: CLASS_ICONS[ic.id] || 'sliders'
            });
        });
        return tabs;
    }, [dbSeedData]);

    // Chips dinámicos desde dbSeedData.categories filtrados por item_class_id
    const currentChips = useMemo(() => {
        if (!filters.categoria) {
            return [{ id: '', label: 'Todas las disciplinas' }];
        }
        const filteredCats = dbSeedData.categories
            .filter((c) => c.enable && String(c.item_class_id) === String(filters.categoria))
            .map((c) => ({ id: String(c.id), label: c.name }));

        return [{ id: '', label: 'Todas' }, ...filteredCats];
    }, [dbSeedData, filters.categoria]);

    // Opciones dinámicas de propiedades extraídas de dbSeedData
    const consumableDetails = useMemo(() => {
        const consumableCatIds = new Set(
            dbSeedData.categories.filter((c) => c.item_class_id === 1).map((c) => c.id)
        );
        const details = dbSeedData.items
            .filter((item) => item.enable && consumableCatIds.has(item.category_id) && item.detail)
            .map((item) => item.detail);
        return [...new Set(details)];
    }, [dbSeedData]);

    const adventureDetails = useMemo(() => {
        const adventureCatIds = new Set(
            dbSeedData.categories.filter((c) => c.item_class_id === 5).map((c) => c.id)
        );
        const details = dbSeedData.items
            .filter((item) => item.enable && adventureCatIds.has(item.category_id) && item.detail)
            .map((item) => item.detail);
        return [...new Set(details)];
    }, [dbSeedData]);

    const weaponDiceOptions = useMemo(() => {
        return [...new Set(dbSeedData.weapons.map((w) => w.damage_dice).filter(Boolean))];
    }, [dbSeedData]);

    const weaponPropertyOptions = useMemo(() => {
        const props = dbSeedData.weapons.flatMap((w) =>
            (w.properties || '').split('·').map((p) => p.trim()).filter(Boolean)
        );
        return [...new Set(props)];
    }, [dbSeedData]);

    const handleCategorySelect = (catId) => {
        setFilterError('');
        aplicarFiltros({
            categoria: catId,
            subCategoria: '',
            ...EMPTY_PROPERTY_FILTERS
        });
    };

    const handleSubCategorySelect = (subId) => {
        aplicarFiltros({ subCategoria: subId });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const { minPrice, maxPrice, minWeight, maxWeight, categoria, minAc, minCapacity } = filters;

        if ((minPrice !== '' && Number(minPrice) < 0) || (maxPrice !== '' && Number(maxPrice) < 0)) {
            setFilterError('Los valores de precio en oro no pueden ser negativos.');
            return;
        }
        if (minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice)) {
            setFilterError('El precio menor no puede ser superior al precio mayor.');
            return;
        }
        if ((minWeight !== '' && Number(minWeight) < 0) || (maxWeight !== '' && Number(maxWeight) < 0)) {
            setFilterError('Los valores de peso en libras no pueden ser negativos.');
            return;
        }
        if (minWeight !== '' && maxWeight !== '' && Number(minWeight) > Number(maxWeight)) {
            setFilterError('El peso menor no puede ser superior al peso mayor.');
            return;
        }
        if (String(categoria) === '2' && minAc !== '' && (Number(minAc) < 10 || Number(minAc) > 30)) {
            setFilterError('La Defensa (CA) en D&D debe estar entre 10 y 30.');
            return;
        }
        if (String(categoria) === '4' && minCapacity !== '' && Number(minCapacity) < 0) {
            setFilterError('La capacidad de carga mínima no puede ser negativa.');
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

    const hasActiveFilters = Boolean(
        searchQuery ||
        filters.categoria ||
        filters.subCategoria ||
        filters.minPrice !== '' ||
        filters.maxPrice !== '' ||
        filters.minWeight !== '' ||
        filters.maxWeight !== '' ||
        filters.sortBy !== 'id' ||
        filters.sortOrder !== 'asc' ||
        filters.consumableDetail ||
        filters.minAc !== '' ||
        filters.noStrengthReq ||
        filters.noStealthDis ||
        filters.dmgType ||
        filters.dmgDice ||
        filters.weaponProp ||
        filters.minCapacity !== '' ||
        filters.speedType ||
        filters.adventureDetail
    );

    const activeCategoryName = categoryTabs.find((c) => c.id === String(filters.categoria))?.label || 'Todos';

    return (
        <>
            <section className="hero-banner" aria-label="Buscador de reliquias">
                <div className="search-box">
                    <Icon name="search" size={19} />
                    <label className="sr-only" htmlFor="search-item-input">
                        Buscar objeto por nombre
                    </label>
                    <input
                        id="search-item-input"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar reliquia u objeto..."
                    />
                </div>
            </section>

            <section className="filter-navigation" aria-label="Filtros del inventario">
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

                <div
                    id="collapsible-filters-body"
                    className={`filter-collapsible-body ${mobileFiltersOpen ? 'is-open' : ''}`}
                >
                    <div className="category-tabs" role="tablist" aria-label="Categorías de objetos">
                        {categoryTabs.map((cat) => {
                            const isSelected = String(filters.categoria) === cat.id;
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
                                    className={String(filters.subCategoria) === chip.id ? 'selected' : ''}
                                    aria-pressed={String(filters.subCategoria) === chip.id}
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

                            {hasActiveFilters && (
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

                    <form
                        id="advanced-filters-form"
                        className={showAdvanced ? 'advanced-filters-form' : 'advanced-filters-form hidden'}
                        onSubmit={handleFormSubmit}
                        onReset={handleFormReset}
                        noValidate
                    >
                        <fieldset className="filter-fieldset">
                            <legend className="filter-legend">Rangos y Ordenamiento</legend>

                            <div className="filter-grid">
                                <label className="filter-field" htmlFor="filter-min-price">
                                    <span className="filter-label">Precio Menor (Oro)</span>
                                    <input
                                        id="filter-min-price"
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        placeholder="Ej. 5"
                                        value={filters.minPrice}
                                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                                    />
                                </label>

                                <label className="filter-field" htmlFor="filter-max-price">
                                    <span className="filter-label">Precio Mayor (Oro)</span>
                                    <input
                                        id="filter-max-price"
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        placeholder="Ej. 500"
                                        value={filters.maxPrice}
                                        onChange={(e) => updateFilter('maxPrice', e.target.value)}
                                    />
                                </label>

                                <label className="filter-field" htmlFor="filter-min-weight">
                                    <span className="filter-label">Peso Menor (lb)</span>
                                    <input
                                        id="filter-min-weight"
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        placeholder="Ej. 0"
                                        value={filters.minWeight}
                                        onChange={(e) => updateFilter('minWeight', e.target.value)}
                                    />
                                </label>

                                <label className="filter-field" htmlFor="filter-max-weight">
                                    <span className="filter-label">Peso Mayor (lb)</span>
                                    <input
                                        id="filter-max-weight"
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        placeholder="Ej. 65"
                                        value={filters.maxWeight}
                                        onChange={(e) => updateFilter('maxWeight', e.target.value)}
                                    />
                                </label>

                                <label className="filter-field" htmlFor="filter-sort-by">
                                    <span className="filter-label">Ordenar por</span>
                                    <select
                                        id="filter-sort-by"
                                        value={filters.sortBy}
                                        onChange={(e) => updateFilter('sortBy', e.target.value)}
                                    >
                                        <option value="id">Catálogo (Por defecto)</option>
                                        <option value="name">Nombre</option>
                                        <option value="price">Precio (Oro)</option>
                                        <option value="weight">Peso (lb)</option>
                                    </select>
                                </label>

                                <label className="filter-field" htmlFor="filter-sort-order">
                                    <span className="filter-label">Dirección</span>
                                    <select
                                        id="filter-sort-order"
                                        value={filters.sortOrder}
                                        onChange={(e) => updateFilter('sortOrder', e.target.value)}
                                    >
                                        <option value="asc">Ascendente</option>
                                        <option value="desc">Descendente</option>
                                    </select>
                                </label>
                            </div>
                        </fieldset>

                        {filters.categoria && (
                            <fieldset className="filter-fieldset filter-fieldset-props">
                                <legend className="filter-legend">
                                    Propiedades de {activeCategoryName}
                                </legend>

                                <div className="filter-grid">
                                    {/* ID 1 = Consumibles */}
                                    {String(filters.categoria) === '1' && (
                                        <label className="filter-field" htmlFor="filter-consumable-detail">
                                            <span className="filter-label">Tipo de Uso / Efecto</span>
                                            <select
                                                id="filter-consumable-detail"
                                                value={filters.consumableDetail}
                                                onChange={(e) => updateFilter('consumableDetail', e.target.value)}
                                            >
                                                <option value="">Cualquier uso...</option>
                                                {consumableDetails.map((detail) => (
                                                    <option key={detail} value={detail}>
                                                        {detail}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    )}

                                    {/* ID 2 = Armaduras */}
                                    {String(filters.categoria) === '2' && (
                                        <>
                                            <label className="filter-field" htmlFor="filter-min-ac">
                                                <span className="filter-label">Defensa (CA) Mínima (10-30)</span>
                                                <input
                                                    id="filter-min-ac"
                                                    type="number"
                                                    min="10"
                                                    max="30"
                                                    placeholder="Ej. 14"
                                                    value={filters.minAc}
                                                    onChange={(e) => updateFilter('minAc', e.target.value)}
                                                />
                                            </label>

                                            <label className="check-field filter-check-align" htmlFor="filter-no-str">
                                                <input
                                                    id="filter-no-str"
                                                    type="checkbox"
                                                    checked={filters.noStrengthReq}
                                                    onChange={(e) => updateFilter('noStrengthReq', e.target.checked)}
                                                />
                                                <span>Sin requisito de Fuerza</span>
                                            </label>

                                            <label className="check-field filter-check-align" htmlFor="filter-stealth">
                                                <input
                                                    id="filter-stealth"
                                                    type="checkbox"
                                                    checked={filters.noStealthDis}
                                                    onChange={(e) => updateFilter('noStealthDis', e.target.checked)}
                                                />
                                                <span>Favorece Sigilo</span>
                                            </label>
                                        </>
                                    )}

                                    {/* ID 3 = Armas */}
                                    {String(filters.categoria) === '3' && (
                                        <>
                                            <label className="filter-field" htmlFor="filter-dmg-type">
                                                <span className="filter-label">Tipo de Daño</span>
                                                <select
                                                    id="filter-dmg-type"
                                                    value={filters.dmgType}
                                                    onChange={(e) => updateFilter('dmgType', e.target.value)}
                                                >
                                                    <option value="">Cualquier tipo...</option>
                                                    {dbSeedData.damage_types.map((dt) => (
                                                        <option key={dt.id} value={String(dt.id)}>
                                                            {dt.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>

                                            <label className="filter-field" htmlFor="filter-dmg-dice">
                                                <span className="filter-label">Dado de Daño</span>
                                                <select
                                                    id="filter-dmg-dice"
                                                    value={filters.dmgDice}
                                                    onChange={(e) => updateFilter('dmgDice', e.target.value)}
                                                >
                                                    <option value="">Cualquier dado...</option>
                                                    {weaponDiceOptions.map((dice) => (
                                                        <option key={dice} value={dice}>
                                                            {dice}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>

                                            <label className="filter-field" htmlFor="filter-weapon-prop">
                                                <span className="filter-label">Propiedad del Arma</span>
                                                <select
                                                    id="filter-weapon-prop"
                                                    value={filters.weaponProp}
                                                    onChange={(e) => updateFilter('weaponProp', e.target.value)}
                                                >
                                                    <option value="">Cualquier propiedad...</option>
                                                    {weaponPropertyOptions.map((prop) => (
                                                        <option key={prop} value={prop}>
                                                            {prop}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                        </>
                                    )}

                                    {/* ID 4 = Transporte y Monturas */}
                                    {String(filters.categoria) === '4' && (
                                        <>
                                            <label className="filter-field" htmlFor="filter-min-capacity">
                                                <span className="filter-label">Capacidad de Carga Mín. (lb)</span>
                                                <input
                                                    id="filter-min-capacity"
                                                    type="number"
                                                    min="0"
                                                    placeholder="Ej. 500"
                                                    value={filters.minCapacity}
                                                    onChange={(e) => updateFilter('minCapacity', e.target.value)}
                                                />
                                            </label>

                                            <label className="filter-field" htmlFor="filter-speed-type">
                                                <span className="filter-label">Tipo de Desplazamiento</span>
                                                <select
                                                    id="filter-speed-type"
                                                    value={filters.speedType}
                                                    onChange={(e) => updateFilter('speedType', e.target.value)}
                                                >
                                                    <option value="">Cualquier velocidad...</option>
                                                    <option value="pies">Montura (velocidad en pies)</option>
                                                    <option value="mph">Vehículo / Barco (velocidad en mph)</option>
                                                </select>
                                            </label>
                                        </>
                                    )}

                                    {/* ID 5 = Equipo de Aventura */}
                                    {String(filters.categoria) === '5' && (
                                        <label className="filter-field" htmlFor="filter-adventure-detail">
                                            <span className="filter-label">Característica / Uso</span>
                                            <select
                                                id="filter-adventure-detail"
                                                value={filters.adventureDetail}
                                                onChange={(e) => updateFilter('adventureDetail', e.target.value)}
                                            >
                                                <option value="">Cualquier uso...</option>
                                                {adventureDetails.map((detail) => (
                                                    <option key={detail} value={detail}>
                                                        {detail}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    )}
                                </div>
                            </fieldset>
                        )}

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