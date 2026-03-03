import { DictType } from "@/types/DictType";
import ToastType from "@/types/Toast";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    const missing = [
        !supabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL" : null,
        !supabaseKey ? "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" : null,
    ].filter(Boolean);

    throw new Error(
        `Supabase env missing: ${missing.join(", ")}. ` +
            `In Next.js, client-side env vars must be prefixed with NEXT_PUBLIC_.`,
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signInWithGoogle = async (
    toast: ToastType,
    dict: DictType,
) => {
    const redirectTo = `/${dict.langSubTag}/main/`;

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
        toast(undefined, dict.error.signIn, "errorAuth");
        console.error(
            "Failed to sign in with Google:",
            error.code,
            error.message,
        );
        return;
    }
};
