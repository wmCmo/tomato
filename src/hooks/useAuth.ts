import { useContext } from "react";
import { AuthContext } from "../providers/auth-provider";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
}

export default function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context as AuthContextType;
} 
