import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    const missing = [
        !supabaseUrl ? "VITE_SUPABASE_URL" : null,
        !supabaseKey
            ? "VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)"
            : null,
    ].filter(Boolean);

    console.error(
        `Supabase env missing: ${missing.join(", ")}. ` +
            `For Vite, these must be provided at build-time (and prefixed with VITE_).`,
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signInWithGoogle = async (toast, dict) => {
    const redirectTo = new URL(import.meta.env.BASE_URL, window.location.origin)
        .toString();

    const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo,
            queryParams: {
                access_type: "offline",
                prompt: "select_account",
            },
        },
    });
    if (error) {
        toast(undefined, dict, "errorAuth");
        console.error(
            "Failed to sign in with Google:",
            error.code,
            error.message,
        );
        return;
    }
};
