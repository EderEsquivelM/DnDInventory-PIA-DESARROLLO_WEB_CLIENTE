"use client";
import { useEffect, useContext } from 'react';
import { MercaderContext } from '../context/MercaderContext';
import Icon from './Icon';

export default function DetailModal({ item, onClose }) {
    const { openCalculator } = useContext(MercaderContext);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && item) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [item, onClose]);

    if (!item) return null;

    const displayPrice = [
        item.price.platino > 0 ? `${item.price.platino} pp` : '',
        item.price.oro > 0 ? `${item.price.oro} gp` : '',
        item.price.plata > 0 ? `${item.price.plata} sp` : '',
        item.price.bronce > 0 ? `${item.price.bronce} cp` : ''
    ].filter(Boolean).join(', ') || '0 cp';

    return (
        <div
            className="modal-backdrop detail-backdrop"
            role="presentation"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <section
                className="detail-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="detail-title"
            >
                <header className="detail-modal-top">
                    <span className="detail-category">
                        {item.classNameLabel || 'Reliquia'}
                    </span>
                    <button
                        type="button"
                        className="detail-close-icon"
                        onClick={onClose}
                        aria-label="Cerrar detalles del objeto"
                    >
                        <Icon name="close" size={19} />
                    </button>
                </header>

                <div className="detail-hero">
                    <div className="detail-icon">
                        <Icon name={item.icon} size={46} />
                    </div>
                    <div>
                        <span className="detail-subtype">
                            {item.subcategoryLabel}
                        </span>
                        <h2 id="detail-title">{item.name}</h2>
                    </div>
                </div>

                <dl className="detail-stats" aria-label="Estadísticas del objeto" style={{ margin: 0 }}>
                    <div>
                        <dt>Carga Física</dt>
                        <dd style={{ margin: 0 }}>
                            <strong>{item.weight > 0 ? `${item.weight} lb` : 'Sin peso'}</strong>
                        </dd>
                    </div>
                    <div>
                        <dt>Valor Oficial</dt>
                        <dd style={{ margin: 0 }}>
                            <strong>{displayPrice}</strong>
                        </dd>
                    </div>
                    <div>
                        <dt>Propiedad</dt>
                        <dd style={{ margin: 0 }}>
                            <strong>
                                {item.damage_type_name
                                    ? `${item.damage_dice} ${item.damage_type_name}`
                                    : item.armor_class
                                        ? (item.category_id === 11
                                            ? `+${item.armor_class} CA`
                                            : `CA ${item.armor_class}`)
                                        : item.speed
                                            ? `Vel. ${item.speed}`
                                            : item.meta}
                            </strong>
                        </dd>
                    </div>
                </dl>

                <div className="detail-description">
                    <span>Descripción del Códice</span>
                    <p>{item.description || item.desc}</p>
                    <div className="detail-note">
                        <i aria-hidden="true" />
                        <span>
                            {item.weapon_properties ||
                                (item.carrying_capacity ? `Capacidad de carga: ${item.carrying_capacity} lb` : item.detail)}
                        </span>
                    </div>
                </div>

                <footer className="detail-actions">
                    <button
                        type="button"
                        className="detail-close-button"
                        onClick={onClose}
                    >
                        Cerrar detalle
                    </button>
                    <button
                        type="button"
                        className="detail-calculate-button"
                        onClick={() => {
                            onClose();
                            openCalculator(item);
                        }}
                    >
                        <Icon name="coins" size={17} />
                        <span>Enviar a Balanza Comercial</span>
                    </button>
                </footer>
            </section>
        </div>
    );
}