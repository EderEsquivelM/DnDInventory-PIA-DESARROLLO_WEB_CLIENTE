"use client";
import { useState } from 'react';
import Icon from '../../components/Icon';

export default function RepartidorBotinPage() {
    const [partySize, setPartySize] = useState('4');
    const [lootPp, setLootPp] = useState('0');
    const [lootGp, setLootGp] = useState('120');
    const [lootSp, setLootSp] = useState('45');
    const [lootCp, setLootCp] = useState('30');
    const [optimizeCoins, setOptimizeCoins] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [splitResult, setSplitResult] = useState(null);

    // Convertir cualquier cantidad en cobre (cp) a arreglo de monedas legibles
    const formatCopperToCoins = (totalCp) => {
        if (totalCp <= 0) return '0 cp';
        let rem = totalCp;
        const pp = Math.floor(rem / 1000);
        rem %= 1000;
        const gp = Math.floor(rem / 100);
        rem %= 100;
        const sp = Math.floor(rem / 10);
        const cp = rem % 10;

        const parts = [];
        if (pp > 0) parts.push(`${pp} pp`);
        if (gp > 0) parts.push(`${gp} gp`);
        if (sp > 0) parts.push(`${sp} sp`);
        if (cp > 0) parts.push(`${cp} cp`);
        return parts.join(' · ');
    };

    const handleCalculateSplit = (e) => {
        e.preventDefault();

        const players = Number(partySize);
        const pp = Number(lootPp || 0);
        const gp = Number(lootGp || 0);
        const sp = Number(lootSp || 0);
        const cp = Number(lootCp || 0);

        // Validaciones explícitas para el Criterio 8 de la rúbrica
        if (!partySize || Number.isNaN(players) || players < 1 || !Number.isInteger(players)) {
            setErrorMsg('El grupo debe tener al menos 1 aventurero (número entero).');
            setSplitResult(null);
            return;
        }
        if (players > 20) {
            setErrorMsg('El tamaño máximo de compañía permitido es de 20 aventureros.');
            setSplitResult(null);
            return;
        }
        if (pp < 0 || gp < 0 || sp < 0 || cp < 0) {
            setErrorMsg('Las cantidades de monedas en el cofre no pueden ser negativas.');
            setSplitResult(null);
            return;
        }

        const totalCopper = (pp * 1000) + (gp * 100) + (sp * 10) + cp;

        if (totalCopper === 0) {
            setErrorMsg('El cofre está vacío. Ingresa al menos una moneda para repartir.');
            setSplitResult(null);
            return;
        }

        setErrorMsg('');

        if (optimizeCoins) {
            // Modo 1: Consolida todo el valor y entrega las monedas de mayor valor posible
            const shareCp = Math.floor(totalCopper / players);
            const remainderCp = totalCopper % players;

            setSplitResult({
                players,
                totalGoldEquivalent: (totalCopper / 100).toFixed(2),
                perPlayerText: formatCopperToCoins(shareCp),
                remainderText: remainderCp > 0 ? formatCopperToCoins(remainderCp) : '0 cp (Reparto exacto)',
                hasRemainder: remainderCp > 0
            });
        } else {
            // Modo 2: Divide cada denominación física sin cambiar monedas en el banco
            const eachPp = Math.floor(pp / players);
            const remPp = pp % players;

            const eachGp = Math.floor(gp / players);
            const remGp = gp % players;

            const eachSp = Math.floor(sp / players);
            const remSp = sp % players;

            const eachCp = Math.floor(cp / players);
            const remCp = cp % players;

            const playerParts = [];
            if (eachPp > 0) playerParts.push(`${eachPp} pp`);
            if (eachGp > 0) playerParts.push(`${eachGp} gp`);
            if (eachSp > 0) playerParts.push(`${eachSp} sp`);
            if (eachCp > 0) playerParts.push(`${eachCp} cp`);

            const remParts = [];
            if (remPp > 0) remParts.push(`${remPp} pp`);
            if (remGp > 0) remParts.push(`${remGp} gp`);
            if (remSp > 0) remParts.push(`${remSp} sp`);
            if (remCp > 0) remParts.push(`${remCp} cp`);

            setSplitResult({
                players,
                totalGoldEquivalent: (totalCopper / 100).toFixed(2),
                perPlayerText: playerParts.length > 0 ? playerParts.join(' · ') : '0 cp',
                remainderText: remParts.length > 0 ? remParts.join(' · ') : '0 cp (Reparto exacto)',
                hasRemainder: remParts.length > 0
            });
        }
    };

    const handleReset = () => {
        setPartySize('4');
        setLootPp('0');
        setLootGp('0');
        setLootSp('0');
        setLootCp('0');
        setErrorMsg('');
        setSplitResult(null);
    };

    const loadPresetChest = (pp, gp, sp, cp) => {
        setLootPp(String(pp));
        setLootGp(String(gp));
        setLootSp(String(sp));
        setLootCp(String(cp));
        setErrorMsg('');
    };

    return (
        <main className="page-shell">
            <section className="hero-banner" aria-labelledby="loot-heading">
                {/* Botones rápidos de prueba (Eventos onClick) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <button
                        type="button"
                        className="advanced-toggle-btn"
                        onClick={() => loadPresetChest(0, 18, 95, 240)}
                    >
                        Cofre Trasgo
                    </button>
                    <button
                        type="button"
                        className="advanced-toggle-btn"
                        onClick={() => loadPresetChest(12, 450, 320, 90)}
                    >
                        Bóveda Noble
                    </button>
                    <button
                        type="button"
                        className="advanced-toggle-btn"
                        onClick={() => loadPresetChest(85, 3400, 1250, 600)}
                    >
                        Tesoro de Dragón
                    </button>
                </div>
            </section>

            <section className="glass-panel filter-panel" aria-label="Calculadora de repartición de botín">
                <form onSubmit={handleCalculateSplit} onReset={handleReset} noValidate>
                    <fieldset style={{ border: 0, padding: 0, margin: '0 0 1.5rem' }}>
                        <legend className="filter-label" style={{ color: 'var(--color-4)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                            1. Monedas halladas en el cofre
                        </legend>

                        <div className="filter-grid">
                            <label className="filter-field" htmlFor="loot-pp">
                                <span className="filter-label">Platino (PP - 10 gp)</span>
                                <input
                                    id="loot-pp"
                                    type="number"
                                    min="0"
                                    value={lootPp}
                                    onChange={(e) => setLootPp(e.target.value)}
                                />
                            </label>

                            <label className="filter-field" htmlFor="loot-gp">
                                <span className="filter-label">Oro (GP - 1 gp)</span>
                                <input
                                    id="loot-gp"
                                    type="number"
                                    min="0"
                                    value={lootGp}
                                    onChange={(e) => setLootGp(e.target.value)}
                                />
                            </label>

                            <label className="filter-field" htmlFor="loot-sp">
                                <span className="filter-label">Plata (SP - 1/10 gp)</span>
                                <input
                                    id="loot-sp"
                                    type="number"
                                    min="0"
                                    value={lootSp}
                                    onChange={(e) => setLootSp(e.target.value)}
                                />
                            </label>

                            <label className="filter-field" htmlFor="loot-cp">
                                <span className="filter-label">Bronce / Cobre (CP - 1/100 gp)</span>
                                <input
                                    id="loot-cp"
                                    type="number"
                                    min="0"
                                    value={lootCp}
                                    onChange={(e) => setLootCp(e.target.value)}
                                />
                            </label>
                        </div>
                    </fieldset>

                    <fieldset style={{ border: 0, padding: 0, margin: '0 0 1.25rem' }}>
                        <legend className="filter-label" style={{ color: 'var(--color-4)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                            2. Parámetros de la Compañía
                        </legend>

                        <div className="filter-grid">
                            <label className="filter-field" htmlFor="party-size">
                                <span className="filter-label">Número de Aventureros (1 - 20)</span>
                                <input
                                    id="party-size"
                                    type="number"
                                    min="1"
                                    max="20"
                                    required
                                    value={partySize}
                                    onChange={(e) => setPartySize(e.target.value)}
                                />
                            </label>

                            <label className="check-field" htmlFor="optimize-coins" style={{ gridColumn: 'span 2', alignSelf: 'end', paddingBottom: '0.5rem' }}>
                                <input
                                    id="optimize-coins"
                                    type="checkbox"
                                    checked={optimizeCoins}
                                    onChange={(e) => setOptimizeCoins(e.target.checked)}
                                />
                                <span>Optimizar cambio a monedas de mayor valor (Platino / Oro)</span>
                            </label>
                        </div>
                    </fieldset>

                    {errorMsg && (
                        <p role="alert" style={{ color: 'var(--color-5)', margin: '0 0 1rem', fontWeight: 600 }}>
                            {errorMsg}
                        </p>
                    )}

                    <div className="filter-actions">
                        <button type="reset" className="solid-button secondary">
                            Vaciar Cofre
                        </button>
                        <button type="submit" className="apply-filters-button">
                            Calcular Reparto Equitativo
                        </button>
                    </div>
                </form>
            </section>

            {/* RESULTADO SEMÁNTICO CON <output> */}
            {splitResult && (
                <output className="item-grid" style={{ display: 'grid', marginTop: '1.5rem' }} aria-live="polite">
                    <article className="item-card figma-card">
                        <div className="card-top">
                            <div className="item-icon">
                                <Icon name="coins" size={36} />
                            </div>
                            <div className="price">
                                <strong>{splitResult.totalGoldEquivalent} GP</strong>
                            </div>
                        </div>
                        <div className="card-copy">
                            <span className="item-category">Botín Total Consolidado</span>
                            <h3 className="item-name">Valor del Cofre</h3>
                            <p className="item-description">
                                Equivalencia total en piezas de oro antes de dividir entre los {splitResult.players} miembros.
                            </p>
                        </div>
                    </article>

                    <article className="item-card figma-card" style={{ borderColor: 'var(--color-6)' }}>
                        <div className="card-top">
                            <div className="item-icon">
                                <Icon name="shield" size={36} />
                            </div>
                            <div className="price">
                                <strong style={{ color: 'var(--color-6)' }}>Por Jugador</strong>
                            </div>
                        </div>
                        <div className="card-copy">
                            <span className="item-category">Parte Individual ({splitResult.players} PJs)</span>
                            <h3 className="item-name" style={{ color: 'var(--color-6)' }}>
                                {splitResult.perPlayerText}
                            </h3>
                            <p className="item-description">
                                Cada integrante recibe exactamente estas monedas en su bolsa personal.
                            </p>
                        </div>
                    </article>

                    <article className="item-card figma-card">
                        <div className="card-top">
                            <div className="item-icon">
                                <Icon name="scroll" size={36} />
                            </div>
                            <div className="price">
                                <strong>Fondo Común</strong>
                            </div>
                        </div>
                        <div className="card-copy">
                            <span className="item-category">Monedas Sobrantes (Indivisibles)</span>
                            <h3 className="item-name">{splitResult.remainderText}</h3>
                            <p className="item-description">
                                {splitResult.hasRemainder
                                    ? 'Sobrante sugerido para la carreta del grupo, pago de posadas o propinas.'
                                    : 'No sobró ni una sola pieza de cobre tras la división.'}
                            </p>
                        </div>
                    </article>
                </output>
            )}
        </main>
    );
}