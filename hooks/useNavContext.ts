import { NavContext } from "@/providers/nav-context";
import { useContext } from "react";

export function useNavContext() {
    const context = useContext(NavContext);
    if (!context) throw new Error('useNavContext must be used within NavProvider');
    return context;
};