import { supabase } from "@/lib/supabase";
import { ProfileType } from "@/types/Profile";

export default async function fetchProfile(
    userId: string | undefined,
): Promise<ProfileType> {
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
        .eq("id", userId)
        .order("last_edited", {
            referencedTable: "study_sessions",
            ascending: false,
        })
        .single();
    if (error) {
        console.error(error);
        throw error;
    }
    return data;
}
