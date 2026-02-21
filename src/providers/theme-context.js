import { createContext } from "react";

export const themeInitialState = {
    theme: "system",
    setTheme: () => null,
};

export const ThemeProviderContext = createContext(themeInitialState);
