"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                height: '2.5rem',
                padding: '0 1rem',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: theme === 'dark' ? '#f4f4f5' : '#18181b',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
                zIndex: 60,
                whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            aria-label="Toggle theme"
        >
            {/* Sun icon — shown in light mode */}
            <Sun
                style={{
                    width: '1rem',
                    height: '1rem',
                    flexShrink: 0,
                    transition: 'opacity 0.2s ease, transform 0.3s ease',
                    opacity: theme === 'dark' ? 0 : 1,
                    transform: theme === 'dark' ? 'rotate(-90deg) scale(0)' : 'rotate(0deg) scale(1)',
                    position: theme === 'dark' ? 'absolute' : 'relative',
                }}
            />
            {/* Moon icon — shown in dark mode */}
            <Moon
                style={{
                    width: '1rem',
                    height: '1rem',
                    flexShrink: 0,
                    transition: 'opacity 0.2s ease, transform 0.3s ease',
                    opacity: theme === 'dark' ? 1 : 0,
                    transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
                    position: theme === 'dark' ? 'relative' : 'absolute',
                }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.04em' }}>
                {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
        </button>
    )
}
