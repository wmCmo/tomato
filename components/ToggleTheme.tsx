'use client'

import { useTheme } from '@/hooks/useTheme';
import { DesktopIcon, IconContext, MoonIcon, SunIcon } from '@phosphor-icons/react';
import { useCallback, useEffect } from 'react';

const ToggleTheme = () => {
    const { theme, setTheme, toggleTheme } = useTheme();

    const handleKeys = useCallback((e: KeyboardEvent) => {
        if (!e.altKey) return;
        if (e.code === 'KeyT') toggleTheme();
    }, [toggleTheme]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [handleKeys]);

    return (
        <div className={`justify-self-end rounded-full flex items-center gap-4 p-2 bg-foreground cursor-pointer`}>
            <IconContext.Provider value={{
                size: 20,
                weight: 'fill'
            }}>
                <SunIcon className={`icon ${theme === 'light' ? 'fill-neutral-700' : theme === 'dark' ? 'fill-neutral-700 hover:fill-neutral-600' : 'fill-neutral-400 dark:fill-neutral-700 hover:fill-neutral-500 dark:hover:fill-neutral-600'}`} onClick={() => { setTheme('light'); }} />
                <MoonIcon className={`icon ${theme === 'dark' ? 'fill-neutral-400' : theme === 'system' ? 'fill-neutral-400 dark:fill-neutral-700 hover:fill-neutral-500 dark:hover:fill-neutral-600' : 'fill-neutral-400 hover:fill-neutral-500'}`} onClick={() => { setTheme('dark'); }} />
                <DesktopIcon className={`hidden sm:block icon ${theme === 'system' ? 'fill-neutral-700 dark:fill-neutral-400' : theme === 'light' ? 'fill-neutral-400 hover:fill-neutral-500' : 'fill-neutral-700 hover:fill-neutral-600'}`} onClick={() => { setTheme('system'); }} />
            </IconContext.Provider>
        </div>
    );
};

export default ToggleTheme;
