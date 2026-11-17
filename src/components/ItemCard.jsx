"use client";
import { useContext } from 'react';
import { MercaderContext } from '../context/MercaderContext';
import Icon from './Icon';

export default function ItemCard({ item, onOpenDetail }) {
    const { openCalculator } = useContext(MercaderContext);

    const displayPrice = [
        item.price.platino > 0 ? `${item.price.platino} PP` : '',
        item.price.oro > 0 ? `${item.price.oro} GP` : '',
        item.price.plata > 0 ? `${item.price.plata} SP` : '',
        item.price.bronce > 0 ? `${item.price.bronce} CP` : ''
    ].filter(Boolean).join(' · ') || '0 CP';

    return (
        <article className="item-card figma-card">
            {/* Cuerpo clickeable que abre el Modal de Detalle (Sin anidar botones) */}
            <button
                type="button"
                className="card-body-trigger"
                onClick={() => onOpenDetail(item)}
                aria-label={`Ver detalles completos de ${item.name}`}
            >
                <div className="card-top">
                    <div className="item-icon">
                        <Icon name={item.icon} size={38} />
                    </div>
                    <div className="price">
                        <strong>{displayPrice}</strong>
                    </div>
                </div>

                <div className="card-copy">
                    <span className="item-category">{item.subcategoryLabel || item.subcategory}</span>
                    <h2 className="item-name">{item.name}</h2>
                    <div className="item-stats">
                        <span>{item.meta}</span>
                        <i aria-hidden="true" />
                        <span>{item.detail}</span>
                    </div>
                </div>
            </button>

            {/* Botón inferior independiente para abrir la BalanzaDrawer */}
            <button
                type="button"
                className="calculate-button"
                onClick={() => openCalculator(item)}
                aria-label={`Calcular venta o compra de ${item.name}`}
            >
                <Icon name="coins" size={18} />
                <span>Calcular venta / compra</span>
                <Icon name="arrow" size={16} />
            </button>
        </article>
    );
}