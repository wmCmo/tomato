import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin,
            queryParams: {
                access_type: 'offline',
                prompt: 'select_account'
            }
        }
    });
    if (error) console.error('Error loggin in: ', error.message);
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
};
