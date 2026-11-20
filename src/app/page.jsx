"use client";
import { useState, useMemo } from 'react';
import { dbSeedData } from '../data/mockItems';
import FiltrosRitual from '../components/Filtros';
import ItemCard from '../components/ItemCard';
import DetailModal from '../components/DetailModal';
import FabButton from '../components/FabButton';
import BalanzaDrawer from '../components/BalanzaDrawer';

const INITIAL_FILTERS = {
    categoria: '',
    subCategoria: '',
    minPrice: '',
    maxPrice: '',
    minWeight: '',
    maxWeight: '',
    sortBy: 'id',
    sortOrder: 'asc',
    // Propiedades por tipo de ítem
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

const getGoldValue = (price) =>
    (price.platino * 10) +
    price.oro +
    (price.plata / 10) +
    (price.bronce / 100);

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
    const [detailItem, setDetailItem] = useState(null);

    // 1. JOIN relacional de las tablas de dbSeedData
    const hydratedItems = useMemo(() => {
        const categoriesMap = new Map(dbSeedData.categories.map((c) => [c.id, c]));
        const classesMap = new Map(dbSeedData.item_classes.map((ic) => [ic.id, ic]));
        const dmgTypesMap = new Map(dbSeedData.damage_types.map((dt) => [dt.id, dt]));
        const armorsMap = new Map(dbSeedData.armors.map((a) => [a.item_id, a]));
        const weaponsMap = new Map(dbSeedData.weapons.map((w) => [w.item_id, w]));
        const travelMap = new Map(dbSeedData.travel_options.map((t) => [t.item_id, t]));

        return dbSeedData.items
            .filter((item) => item.enable)
            .map((item) => {
                const cat = categoriesMap.get(item.category_id);
                const itemClass = cat ? classesMap.get(cat.item_class_id) : null;
                const armorData = armorsMap.get(item.id) || {};
                const weaponData = weaponsMap.get(item.id) || {};
                const travelData = travelMap.get(item.id) || {};
                const dmgTypeObj = weaponData.damage_type_id
                    ? dmgTypesMap.get(weaponData.damage_type_id)
                    : null;

                return {
                    ...item,
                    desc: item.description,
                    goldValue: getGoldValue(item.price),
                    category_id: item.category_id,
                    subcategory: String(item.category_id),
                    subcategoryLabel: cat ? cat.name : '',
                    item_class_id: cat ? cat.item_class_id : null,
                    category: cat ? String(cat.item_class_id) : '',
                    classNameLabel: itemClass ? itemClass.name : '',
                    // Armaduras (item_class_id === 2)
                    armor_class: armorData.armor_class ?? null,
                    strength_requirement: armorData.strength_requirement ?? null,
                    stealth_disadvantage: armorData.stealth_disadvantage ?? null,
                    // Armas (item_class_id === 3)
                    damage_dice: weaponData.damage_dice ?? null,
                    damage_type_id: weaponData.damage_type_id ? String(weaponData.damage_type_id) : '',
                    damage_type_name: dmgTypeObj ? dmgTypeObj.name : null,
                    weapon_properties: weaponData.properties ?? null,
                    // Transporte y Monturas (item_class_id === 4)
                    speed: travelData.speed ?? null,
                    carrying_capacity: travelData.carrying_capacity ?? null
                };
            });
    }, []);

    // 2. Conteo dinámico por clase para las pestañas
    const itemsCountByCategory = useMemo(() => {
        const counts = { '': hydratedItems.length };
        dbSeedData.item_classes.forEach((ic) => {
            counts[String(ic.id)] = hydratedItems.filter(
                (i) => String(i.item_class_id) === String(ic.id)
            ).length;
        });
        return counts;
    }, [hydratedItems]);

    const updateFilter = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const resetFilters = () => {
        setSearchQuery('');
        setFilters(INITIAL_FILTERS);
        setAppliedFilters(INITIAL_FILTERS);
    };

    const aplicarFiltros = (overrides = {}) => {
        const nextState = { ...filters, ...overrides };
        setFilters(nextState);
        setAppliedFilters(nextState);
    };

    // 3. Filtrado relacional + Ordenamiento ascendente / descendente
    const filteredItems = useMemo(() => {
        const result = hydratedItems.filter((item) => {
            if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (appliedFilters.categoria && String(item.item_class_id) !== String(appliedFilters.categoria)) {
                return false;
            }
            if (appliedFilters.subCategoria && String(item.category_id) !== String(appliedFilters.subCategoria)) {
                return false;
            }

            // Rango de precio (en Oro equivalente)
            if (appliedFilters.minPrice !== '' && item.goldValue < parseFloat(appliedFilters.minPrice)) {
                return false;
            }
            if (appliedFilters.maxPrice !== '' && item.goldValue > parseFloat(appliedFilters.maxPrice)) {
                return false;
            }

            // Rango de peso (en lb)
            if (appliedFilters.minWeight !== '' && item.weight < parseFloat(appliedFilters.minWeight)) {
                return false;
            }
            if (appliedFilters.maxWeight !== '' && item.weight > parseFloat(appliedFilters.maxWeight)) {
                return false;
            }

            // ID 1 = Consumibles
            if (String(appliedFilters.categoria) === '1') {
                if (appliedFilters.consumableDetail && item.detail !== appliedFilters.consumableDetail) {
                    return false;
                }
            }

            // ID 2 = Armaduras
            if (String(appliedFilters.categoria) === '2') {
                if (appliedFilters.minAc !== '' && (item.armor_class ?? 0) < parseInt(appliedFilters.minAc, 10)) {
                    return false;
                }
                if (appliedFilters.noStrengthReq && item.strength_requirement !== null) {
                    return false;
                }
                if (appliedFilters.noStealthDis && item.stealth_disadvantage === true) {
                    return false;
                }
            }

            // ID 3 = Armas
            if (String(appliedFilters.categoria) === '3') {
                if (appliedFilters.dmgType && String(item.damage_type_id) !== String(appliedFilters.dmgType)) {
                    return false;
                }
                if (appliedFilters.dmgDice && item.damage_dice !== appliedFilters.dmgDice) {
                    return false;
                }
                if (
                    appliedFilters.weaponProp &&
                    !(item.weapon_properties || '').includes(appliedFilters.weaponProp)
                ) {
                    return false;
                }
            }

            // ID 4 = Transporte y Monturas
            if (String(appliedFilters.categoria) === '4') {
                if (
                    appliedFilters.minCapacity !== '' &&
                    (item.carrying_capacity ?? 0) < parseFloat(appliedFilters.minCapacity)
                ) {
                    return false;
                }
                if (
                    appliedFilters.speedType &&
                    !(item.speed || '').toLowerCase().includes(appliedFilters.speedType)
                ) {
                    return false;
                }
            }

            // ID 5 = Equipo de Aventura
            if (String(appliedFilters.categoria) === '5') {
                if (appliedFilters.adventureDetail && item.detail !== appliedFilters.adventureDetail) {
                    return false;
                }
            }

            return true;
        });

        // Ordenamiento
        const direction = appliedFilters.sortOrder === 'desc' ? -1 : 1;
        return [...result].sort((a, b) => {
            switch (appliedFilters.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name, 'es') * direction;
                case 'price':
                    return (a.goldValue - b.goldValue) * direction;
                case 'weight':
                    return (a.weight - b.weight) * direction;
                case 'id':
                default:
                    return (a.id - b.id) * direction;
            }
        });
    }, [hydratedItems, appliedFilters, searchQuery]);

    const activeContextLabel = useMemo(() => {
        if (appliedFilters.subCategoria) {
            const sub = dbSeedData.categories.find((c) => String(c.id) === String(appliedFilters.subCategoria));
            if (sub) return sub.name;
        }
        if (appliedFilters.categoria) {
            const cls = dbSeedData.item_classes.find((c) => String(c.id) === String(appliedFilters.categoria));
            if (cls) return cls.name;
        }
        return 'Catálogo completo';
    }, [appliedFilters]);

    return (
        <main className="page-shell">
            <FiltrosRitual
                dbSeedData={dbSeedData}
                itemsCountByCategory={itemsCountByCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
                aplicarFiltros={aplicarFiltros}
            />

            <section aria-live="polite">
                <div className="results-heading">
                    <div>
                        <span className="count">{filteredItems.length}</span>
                        <span> reliquias encontradas</span>
                    </div>
                    <span className="results-context">{activeContextLabel}</span>
                </div>

                <div className="item-grid">
                    {filteredItems.length === 0 ? (
                        <div className="empty-state">
                            El oráculo no encuentra reliquias con estas condiciones.
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                onOpenDetail={setDetailItem}
                            />
                        ))
                    )}
                </div>
            </section>

            <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />
            <FabButton />
            <BalanzaDrawer />
        </main>
    );
}