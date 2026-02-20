import { useEffect, useState } from "react";
import { ThemeProviderContext } from "./theme-context";

export function ThemeProvider({
    children,
    defaultTheme = "light",
    storageKey = "app-theme",
    ...props
}) {
    const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
            return;
        }
        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
        toggleTheme: () => {
            setTheme(prev => {
                const newTheme = prev === 'light' ? 'dark' : 'light';
                localStorage.setItem(storageKey, newTheme);
                return newTheme;
            });
        }
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}