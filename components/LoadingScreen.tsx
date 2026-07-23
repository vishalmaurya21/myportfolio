'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
    const [visible, setVisible] = useState(true);
    const [hiding, setHiding] = useState(false);

    useEffect(() => {
        const hideTimer = setTimeout(() => {
            setHiding(true);
        }, 1400);
        const removeTimer = setTimeout(() => {
            setVisible(false);
        }, 1900);
        return () => {
            clearTimeout(hideTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className="loading-screen"
            aria-hidden="true"
            style={{
                opacity: hiding ? 0 : 1,
                transition: 'opacity 0.5s ease',
            }}
        >
            <div className="loading-logo">
                <span className="loading-logo-text">VM</span>
                <div className="loading-bar-wrap">
                    <div className="loading-bar" />
                </div>
            </div>
        </div>
    );
}
