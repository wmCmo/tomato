'use client'

import { createContext } from "react";

export const themeInitialState = {
    theme: "system",
    setTheme: (target: string) => null,
    toggleTheme: () => null,
};

export const ThemeProviderContext = createContext(themeInitialState);
