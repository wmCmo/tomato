import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext({ session: null, user: null, loading: true });

const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isMaybeLoggedIn, setIsMaybeLoggedIn] = useState(
        () => localStorage.getItem(import.meta.env.VITE_STORAGE_KEY) !== null
    );

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsMaybeLoggedIn(!!session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsMaybeLoggedIn(!!session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, isMaybeLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

