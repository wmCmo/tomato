import { useContext } from "react";
import { ThemeProviderContext } from "../providers/theme-providers";

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) throw new Error("useTheme ust be used within a ThemeProvider");

    return context;
};