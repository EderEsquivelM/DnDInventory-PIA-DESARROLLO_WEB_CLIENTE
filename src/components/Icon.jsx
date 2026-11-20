"use client";

export default function Icon({ name, size = 20 }) {
    const paths = {
        menu: <path d="M4 7h16M4 12h16M4 17h16" />,
        close: <path d="m6 6 12 12M18 6 6 18" />,
        search: (
            <>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
            </>
        ),
        chevron: <path d="m8 10 4 4 4-4" />,
        sliders: (
            <>
                <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
                <circle cx="16" cy="7" r="2" />
                <circle cx="8" cy="17" r="2" />
            </>
        ),
        coins: (
            <>
                <ellipse cx="12" cy="6" rx="7" ry="3" />
                <path d="M5 6v5c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 11v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
            </>
        ),
        arrow: <path d="M5 12h14M15 8l4 4-4 4" />,
        sword: (
            <>
                <path d="m5 19 10-10 4-5-5 4L4 18l1 1Z" />
                <path d="m9 14 3 3M3 21l3-3" />
            </>
        ),
        bow: <path d="M6 3c9 5 9 13 0 18M6 3l0 18M6 12h14M17 9l3 3-3 3" />,
        hammer: (
            <>
                <path d="m5 19 9-9M12 5l3-3 6 6-3 3M9 8l7 7" />
                <path d="m3 21 4-1-3-3-1 4Z" />
            </>
        ),
        shield: <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />,
        armor: (
            <>
                <path d="m8 4 4 2 4-2 4 4-3 3v10H7V11L4 8l4-4Z" />
                <path d="M12 6v15" />
            </>
        ),
        horse: (
            <>
                <path d="M6 20v-7l3-3-1-5 5 2 4 4v9M9 20v-4h8" />
                <path d="m13 7 3-3 2 5" />
            </>
        ),
        ship: (
            <>
                <path d="m4 14 2 6h12l2-6H4Z" />
                <path d="M12 4v10M12 5l5 6h-5M12 7 7 12h5" />
            </>
        ),
        potion: (
            <>
                <path d="M9 3h6M10 3v5l-4 6a5 5 0 0 0 4 7h4a5 5 0 0 0 4-7l-4-6V3" />
                <path d="M8 14h8" />
            </>
        ),
        scroll: (
            <>
                <path d="M6 4h12v15H8a3 3 0 0 1-3-3V6a2 2 0 0 1 4 0v10" />
                <path d="M10 8h5M10 12h5" />
            </>
        ),
        food: <path d="M8 3v7a3 3 0 0 1-6 0V3M5 3v18M16 3v18M16 3c4 3 5 7 0 10" />,
        flask: (
            <>
                <path d="M9 3h6M10 3v4.5L5.5 16a3.5 3.5 0 0 0 3 5h7a3.5 3.5 0 0 0 3-5L14 7.5V3" />
                <path d="M7.5 15h9M10 18h.01M14 17h.01" />
            </>
        ),
        tool: (
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
        ),
        ammo: (
            <>
                <path d="M5 19 19 5M14 5h5v5" />
                <path d="M4 17h3v3M7 14h3v3" />
            </>
        ),
        focus: (
            <>
                <path d="m4 20 11-11" />
                <path d="M16 4v4M14 6h4M19 10v3M17.5 11.5h3M11 3v2M10 4h2" />
            </>
        ),
        gear: (
            <>
                <path d="M6 9a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9Z" />
                <path d="M9 5V4a3 3 0 0 1 6 0v1M6 13h12M10 13v3h4v-3" />
            </>
        )

    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name] || paths.sword}
        </svg>
    );
}