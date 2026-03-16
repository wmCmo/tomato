import { supabase } from "@/lib/supabase";
import { ProfileType } from "@/types/Profile";

export default async function fetchProfile(
    userId: string | undefined | null,
): Promise<ProfileType | null> {
    if (!userId) throw new Error("User ID is required");
    const useHandle = userId?.startsWith('%40');
    const identifier = useHandle ? userId?.substring(3) : userId;
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            id,
            nickname,
            handle,
            avatar_url,
            bio,
            emoji,
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
