'use client'

import { supabase } from "@/lib/supabase";
import AuthContextType from "@/types/AuthContext";
import type { Session } from "@supabase/supabase-js";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType>({ session: null, user: null, loading: true });

const AuthProvider = ({ children }: { children: React.ReactNode; }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session, user: session?.user ?? null, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

