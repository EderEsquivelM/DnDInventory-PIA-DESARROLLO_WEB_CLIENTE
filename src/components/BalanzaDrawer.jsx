"use client";
import { useContext, useState, useEffect } from 'react';
import { MercaderContext } from '../context/MercaderContext';

export default function BalanzaDrawer() {
    const { isOpen, toggleDrawer, selectedItem } = useContext(MercaderContext);

    const [payPp, setPayPp] = useState(0);
    const [payGp, setPayGp] = useState(0);
    const [paySp, setPaySp] = useState(0);
    const [payCp, setPayCp] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    const [changeResult, setChangeResult] = useState({
        text: 'Selecciona un ítem del códice',
        status: 'neutral'
    });

    // Evento de teclado (Criterio 9): Cerrar el Drawer al presionar Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                toggleDrawer(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, toggleDrawer]);

    useEffect(() => {
        if (selectedItem) {
            calculateChange();
        } else {
            setChangeResult({ text: 'Selecciona un ítem del códice', status: 'neutral' });
        }
    }, [payPp, payGp, paySp, payCp, selectedItem]);

    useEffect(() => {
        setPayPp(0);
        setPayGp(0);
        setPaySp(0);
        setPayCp(0);
        setErrorMsg('');
    }, [selectedItem]);

    // Validación de entrada (Criterio 8)
    const handleCoinChange = (setter) => (e) => {
        const rawValue = e.target.value;
        if (rawValue === '') {
            setter(0);
            setErrorMsg('');
            return;
        }
        const numValue = Number(rawValue);
        if (Number.isNaN(numValue) || numValue < 0) {
            setErrorMsg('No se permiten cantidades negativas.');
            return;
        }
        setErrorMsg('');
        setter(Math.floor(numValue));
    };

    const handleResetBag = () => {
        setPayPp(0);
        setPayGp(0);
        setPaySp(0);
        setPayCp(0);
        setErrorMsg('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        calculateChange();
    };

    const calculateChange = () => {
        if (!selectedItem) return;

        const costPp = selectedItem.price.platino || 0;
        const costGp = selectedItem.price.oro || 0;
        const costSp = selectedItem.price.plata || 0;
        const costCp = selectedItem.price.bronce || 0;

        const totalCostCp = (costPp * 1000) + (costGp * 100) + (costSp * 10) + costCp;
        const totalPayCp = (Number(payPp) * 1000) + (Number(payGp) * 100) + (Number(paySp) * 10) + Number(payCp);

        const diffCp = totalPayCp - totalCostCp;

        if (diffCp < 0) {
            setChangeResult({
                text: `Faltan monedas (Deuda: ${Math.abs(diffCp)} cp)`,
                status: 'danger'
            });
        } else if (diffCp === 0) {
            setChangeResult({
                text: 'Trato Justo (Sin vuelto)',
                status: 'success'
            });
        } else {
            let remaining = diffCp;
            const changePp = Math.floor(remaining / 1000);
            remaining %= 1000;
            const changeGp = Math.floor(remaining / 100);
            remaining %= 100;
            const changeSp = Math.floor(remaining / 10);
            const changeCp = remaining % 10;

            const changeArr = [];
            if (changePp > 0) changeArr.push(`${changePp} pp`);
            if (changeGp > 0) changeArr.push(`${changeGp} gp`);
            if (changeSp > 0) changeArr.push(`${changeSp} sp`);
            if (changeCp > 0) changeArr.push(`${changeCp} cp`);

            setChangeResult({
                text: changeArr.join(' / '),
                status: 'success'
            });
        }
    };

    return (
        <>
            {/* OVERLAY DEL DRAWER */}
            <div
                className={`drawer-overlay ${isOpen ? '' : 'hidden'}`}
                onClick={() => toggleDrawer(false)}
                aria-hidden="true"
            ></div>

            {/* DRAWER: Calculadora / Balanza del Mercader */}
            <aside
                className={`commercial-drawer ${isOpen ? 'open' : ''}`}
                aria-label="Calculadora Comercial del Mercader"
                aria-hidden={!isOpen}
            >
                <div className="drawer-header">
                    <h2 className="drawer-title">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="calculator-icon"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Calculadora Comercial
                    </h2>
                    <button
                        type="button"
                        onClick={() => toggleDrawer(false)}
                        className="close-button"
                        aria-label="Cerrar calculadora comercial"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="drawer-content">
                    {/* Info del Ítem (Estilo Ticket) */}
                    <section className="purchase-ticket" aria-labelledby="ticket-heading">
                        <h3 id="ticket-heading">Manifiesto de Compra</h3>
                        <strong>{selectedItem ? selectedItem.name : 'Sin reliquia seleccionada'}</strong>

                        <div className="ticket-row">
                            <span>Tasa Base:</span>
                            <b>
                                {selectedItem
                                    ? [
                                          selectedItem.price.platino > 0 ? `${selectedItem.price.platino} pp` : '',
                                          selectedItem.price.oro > 0 ? `${selectedItem.price.oro} gp` : '',
                                          selectedItem.price.plata > 0 ? `${selectedItem.price.plata} sp` : '',
                                          selectedItem.price.bronce > 0 ? `${selectedItem.price.bronce} cp` : ''
                                      ].filter(Boolean).join(', ') || '0 cp'
                                    : '0 cp'}
                            </b>
                        </div>
                        <div className="ticket-row">
                            <span>Carga Física:</span>
                            <b>{selectedItem ? `${selectedItem.weight} kg` : '0 kg'}</b>
                        </div>
                    </section>

                    {/* Formulario Dividido en 2 Columnas Reales */}
                    <form className="payment-panel" onSubmit={handleSubmit} onReset={handleResetBag} noValidate>
                        {/* Columna Izquierda: Precio Fijo */}
                        <fieldset className="payment-column" style={{ border: 0, margin: 0, padding: 0 }}>
                            <legend style={{ width: '100%', padding: 0 }}>
                                <h3>Deuda</h3>
                            </legend>
                            <div className="coin-row">
                                <label htmlFor="cost-pp">PP</label>
                                <input id="cost-pp" type="number" className="payment-input" readOnly value={selectedItem?.price?.platino || 0} />
                            </div>
                            <div className="coin-row">
                                <label htmlFor="cost-gp">GP</label>
                                <input id="cost-gp" type="number" className="payment-input" readOnly value={selectedItem?.price?.oro || 0} />
                            </div>
                            <div className="coin-row">
                                <label htmlFor="cost-sp">SP</label>
                                <input id="cost-sp" type="number" className="payment-input" readOnly value={selectedItem?.price?.plata || 0} />
                            </div>
                            <div className="coin-row">
                                <label htmlFor="cost-cp">CP</label>
                                <input id="cost-cp" type="number" className="payment-input" readOnly value={selectedItem?.price?.bronce || 0} />
                            </div>
                        </fieldset>

                        {/* Columna Derecha: Pago del Usuario */}
                        <fieldset className="payment-column" style={{ border: 0, margin: 0, padding: 0 }}>
                            <legend style={{ width: '100%', padding: 0 }}>
                                <h3>Tu Bolsa</h3>
                            </legend>
                            <div className="coin-row">
                                <label htmlFor="pay-pp">PP</label>
                                <input
                                    id="pay-pp"
                                    type="number"
                                    className="payment-input"
                                    min="0"
                                    value={payPp}
                                    onChange={handleCoinChange(setPayPp)}
                                />
                            </div>
                            <div className="coin-row">
                                <label htmlFor="pay-gp">GP</label>
                                <input
                                    id="pay-gp"
                                    type="number"
                                    className="payment-input"
                                    min="0"
                                    value={payGp}
                                    onChange={handleCoinChange(setPayGp)}
                                />
                            </div>
                            <div className="coin-row">
                                <label htmlFor="pay-sp">SP</label>
                                <input
                                    id="pay-sp"
                                    type="number"
                                    className="payment-input"
                                    min="0"
                                    value={paySp}
                                    onChange={handleCoinChange(setPaySp)}
                                />
                            </div>
                            <div className="coin-row">
                                <label htmlFor="pay-cp">CP</label>
                                <input
                                    id="pay-cp"
                                    type="number"
                                    className="payment-input"
                                    min="0"
                                    value={payCp}
                                    onChange={handleCoinChange(setPayCp)}
                                />
                            </div>
                        </fieldset>

                        {errorMsg && (
                            <p role="alert" style={{ gridColumn: '1 / -1', margin: 0, color: 'var(--color-5)', fontSize: '0.85rem', textAlign: 'center' }}>
                                {errorMsg}
                            </p>
                        )}

                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="reset" className="solid-button secondary" style={{ width: '100%' }}>
                                Vaciar Bolsa
                            </button>
                        </div>

                        {/* Resultado del Cálculo usando etiqueta semántica <output> */}
                        <output
                            className={`result-box ${changeResult.status === 'danger' ? 'danger' : changeResult.status === 'success' ? 'success' : ''}`}
                            aria-live="polite"
                        >
                            <span className="result-label">Resultado</span>
                            <div className="result-text">{changeResult.text}</div>
                        </output>
                    </form>
                </div>
            </aside>
        </>
    );
}