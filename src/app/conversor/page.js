"use client";
import { useState, useMemo } from 'react';

const CURRENCIES = [
    { rate: '1000', name: 'Platino (pp)', short: 'pp' },
    { rate: '100', name: 'Oro (gp)', short: 'gp' },
    { rate: '10', name: 'Plata (sp)', short: 'sp' },
    { rate: '1', name: 'Bronce (cp)', short: 'cp' }
];

export default function ConversorPage() {
    const [amount, setAmount] = useState('1');
    const [fromRate, setFromRate] = useState('100');
    const [toRate, setToRate] = useState('10');
    const [errorMsg, setErrorMsg] = useState('');

    const toLabel = useMemo(() => {
        const found = CURRENCIES.find((c) => c.rate === String(toRate));
        return found ? found.short : 'sp';
    }, [toRate]);

    const handleAmountChange = (e) => {
        const val = e.target.value;
        setAmount(val);

        if (val === '') {
            setErrorMsg('Ingresa una cantidad para transmutar.');
        } else if (Number(val) < 0) {
            setErrorMsg('No puedes transmutar cantidades negativas de monedas.');
        } else {
            setErrorMsg('');
        }
    };

    const handleSwapCurrencies = () => {
        setFromRate(toRate);
        setToRate(fromRate);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const conversionResult = useMemo(() => {
        const numAmount = Number(amount);
        if (amount === '' || Number.isNaN(numAmount) || numAmount < 0) {
            return '0';
        }
        const converted = (numAmount * Number(fromRate)) / Number(toRate);
        return converted % 1 === 0 ? String(converted) : converted.toFixed(2);
    }, [amount, fromRate, toRate]);

    return (
        <main className="converter-page">
            <section className="converter-panel" aria-labelledby="converter-title">
                <header className="converter-heading">
                    <h2 id="converter-title">Conversor de Monedas</h2>
                </header>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="conversion-fields">
                        <fieldset className="conversion-box" style={{ margin: 0 }}>
                            <legend className="conversion-caption" style={{ padding: '0 0.25rem' }}>
                                Ofrenda
                            </legend>
                            <div className="conversion-row">
                                <div style={{ width: '35%' }}>
                                    <label htmlFor="conv-amount" className="filter-label" style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                                        Cantidad
                                    </label>
                                    <input
                                        id="conv-amount"
                                        className="conversion-input"
                                        style={{ width: '100%' }}
                                        type="number"
                                        min="0"
                                        step="any"
                                        value={amount}
                                        onChange={handleAmountChange}
                                    />
                                </div>
                                <div style={{ width: '65%' }}>
                                    <label htmlFor="conv-from" className="filter-label" style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                                        Divisa Origen
                                    </label>
                                    <select
                                        id="conv-from"
                                        className="conversion-select"
                                        style={{ width: '100%' }}
                                        value={fromRate}
                                        onChange={(e) => setFromRate(e.target.value)}
                                    >
                                        {CURRENCIES.map((coin) => (
                                            <option key={coin.rate} value={coin.rate}>
                                                {coin.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </fieldset>

                        <button
                            type="button"
                            className="swap-mark"
                            onClick={handleSwapCurrencies}
                            aria-label="Invertir divisas de origen y destino"
                            title="Invertir divisas"
                            style={{ background: 'transparent', border: '1px solid var(--color-4)', padding: '0.4rem 0.75rem' }}
                        >
                            ⇄
                        </button>

                        <fieldset className="conversion-box desire-box" style={{ margin: 0 }}>
                            <legend className="conversion-caption" style={{ padding: '0 0.25rem' }}>
                                Deseo
                            </legend>
                            <div style={{ width: '100%' }}>
                                <label htmlFor="conv-to" className="filter-label" style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                                    Divisa Destino
                                </label>
                                <select
                                    id="conv-to"
                                    className="conversion-select"
                                    style={{ width: '100%' }}
                                    value={toRate}
                                    onChange={(e) => setToRate(e.target.value)}
                                >
                                    {CURRENCIES.map((coin) => (
                                        <option key={coin.rate} value={coin.rate}>
                                            {coin.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </fieldset>
                    </div>

                    {errorMsg && (
                        <p
                            role="alert"
                            style={{
                                margin: '0 0 1.25rem',
                                color: 'var(--color-5)',
                                textAlign: 'center',
                                fontSize: '0.9rem'
                            }}
                        >
                            {errorMsg}
                        </p>
                    )}

                    <output
                        className="conversion-result"
                        style={{ display: 'block' }}
                        htmlFor="conv-amount conv-from conv-to"
                        aria-live="polite"
                    >
                        <small>Conversión en</small>
                        <strong>
                            {conversionResult} <em>{toLabel}</em>
                        </strong>
                    </output>
                </form>
            </section>
        </main>
    );
}