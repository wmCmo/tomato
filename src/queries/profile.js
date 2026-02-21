import { supabase } from "../lib/supabase";

export default async function fetchProfile(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            nickname,
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
