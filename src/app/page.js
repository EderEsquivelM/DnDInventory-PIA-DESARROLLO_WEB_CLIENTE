"use client";
import { useState, useMemo } from 'react';
import { dbSeedData } from '../data/mockItems';
import FiltrosRitual from '../components/Filtros';
import ItemCard from '../components/ItemCard';
import DetailModal from '../components/DetailModal';
import FabButton from '../components/FabButton';
import BalanzaDrawer from '../components/BalanzaDrawer';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoria, setCategoria] = useState(''); // Guarda el item_class_id ('1', '2', '3', '4')
    const [subCategoria, setSubCategoria] = useState(''); // Guarda el category_id ('1' al '10')
    const [maxPrice, setMaxPrice] = useState('');
    const [maxWeight, setMaxWeight] = useState('');
    const [minAc, setMinAc] = useState('');
    const [noStealthDis, setNoStealthDis] = useState(false);
    const [dmgType, setDmgType] = useState(''); // Guarda el damage_type_id ('1', '2', '3')
    const [detailItem, setDetailItem] = useState(null);

    const [appliedFilters, setAppliedFilters] = useState({
        categoria: '',
        subCategoria: '',
        maxPrice: '',
        maxWeight: '',
        minAc: '',
        noStealthDis: false,
        dmgType: ''
    });

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
                    desc: item.description, // Compatibilidad con componentes
                    category_id: item.category_id,
                    subcategory: String(item.category_id),
                    subcategoryLabel: cat ? cat.name : '',
                    item_class_id: cat ? cat.item_class_id : null,
                    category: cat ? String(cat.item_class_id) : '',
                    classNameLabel: itemClass ? itemClass.name : '',
                    // Propiedades de Armadura (item_class_id === 2)
                    armor_class: armorData.armor_class ?? null,
                    strength_requirement: armorData.strength_requirement ?? null,
                    stealth_disadvantage: armorData.stealth_disadvantage ?? null,
                    // Propiedades de Arma (item_class_id === 3)
                    damage_dice: weaponData.damage_dice ?? null,
                    damage_type_id: weaponData.damage_type_id ? String(weaponData.damage_type_id) : '',
                    damage_type_name: dmgTypeObj ? dmgTypeObj.name : null,
                    weapon_properties: weaponData.properties ?? null,
                    // Propiedades de Transporte (item_class_id === 4)
                    speed: travelData.speed ?? null,
                    carrying_capacity: travelData.carrying_capacity ?? null
                };
            });
    }, []);

    // 2. Conteo dinámico por item_class_id para las pestañas
    const itemsCountByCategory = useMemo(() => {
        const counts = { '': hydratedItems.length };
        dbSeedData.item_classes.forEach((ic) => {
            counts[String(ic.id)] = hydratedItems.filter(
                (i) => String(i.item_class_id) === String(ic.id)
            ).length;
        });
        return counts;
    }, [hydratedItems]);

    const resetFilters = () => {
        setSearchQuery('');
        setCategoria('');
        setSubCategoria('');
        setMaxPrice('');
        setMaxWeight('');
        setMinAc('');
        setNoStealthDis(false);
        setDmgType('');
        setAppliedFilters({
            categoria: '',
            subCategoria: '',
            maxPrice: '',
            maxWeight: '',
            minAc: '',
            noStealthDis: false,
            dmgType: ''
        });
    };

    const aplicarFiltros = (overrides = {}) => {
        setAppliedFilters({
            categoria: overrides.nextCategoria !== undefined ? overrides.nextCategoria : categoria,
            subCategoria: overrides.nextSubCategoria !== undefined ? overrides.nextSubCategoria : subCategoria,
            maxPrice,
            maxWeight,
            minAc,
            noStealthDis,
            dmgType
        });
    };

    // 3. Filtrado usando los IDs relacionales
    const filteredItems = useMemo(() => {
        return hydratedItems.filter((item) => {
            if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (appliedFilters.categoria && String(item.item_class_id) !== String(appliedFilters.categoria)) {
                return false;
            }
            if (appliedFilters.subCategoria && String(item.category_id) !== String(appliedFilters.subCategoria)) {
                return false;
            }
            if (appliedFilters.maxWeight && item.weight > parseFloat(appliedFilters.maxWeight)) {
                return false;
            }

            if (appliedFilters.maxPrice) {
                const itemGoldValue =
                    (item.price.platino * 10) +
                    item.price.oro +
                    (item.price.plata / 10) +
                    (item.price.bronce / 100);
                if (itemGoldValue > parseFloat(appliedFilters.maxPrice)) return false;
            }

            // ID 2 = Armaduras
            if (String(appliedFilters.categoria) === '2') {
                if (appliedFilters.minAc && (item.armor_class ?? 0) < parseInt(appliedFilters.minAc, 10)) {
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
            }

            return true;
        });
    }, [hydratedItems, appliedFilters, searchQuery]);

    // Etiqueta legible del filtro activo
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
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                categoria={categoria} setCategoria={setCategoria}
                subCategoria={subCategoria} setSubCategoria={setSubCategoria}
                maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                maxWeight={maxWeight} setMaxWeight={setMaxWeight}
                minAc={minAc} setMinAc={setMinAc}
                noStealthDis={noStealthDis} setNoStealthDis={setNoStealthDis}
                dmgType={dmgType} setDmgType={setDmgType}
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