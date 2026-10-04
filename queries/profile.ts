import { supabase } from "@/lib/supabase";
import ProfileType from "@/types/Profile";

export default async function fetchProfile(
    userId: string | undefined | null,
): Promise<ProfileType | null> {
    if (!userId || typeof userId !== 'string') throw new Error("User ID is required");
    const useHandle = userId.startsWith('%40') || userId.startsWith("@");
    let identifier = userId;
    if (userId.startsWith("%40")) {
        identifier = userId.substring(3);
    } else if (userId.startsWith("@")) {
        identifier = userId.substring(1);
    }
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            id,
            nickname,
            handle,
            avatar_url,
            bio,
            emoji,
            created_at,
            study_sessions(id, created_at, sessions, last_edited)
        `)
        .eq(useHandle ? "handle" : "id", identifier)
        .order("last_edited", {
            referencedTable: "study_sessions",
            ascending: false,
        })
        .maybeSingle();
    if (error) {
        console.error("Supabase Error:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
        if (error.code === '22P02') return null;
        throw error;
    }
    return data;
}
