import { supabase } from "@/lib/supabase";

export default async function getMyRoom(userId: string) {
    if (!userId) throw new Error("User ID is required");
    const { data, error } = await supabase
        .from("rooms")
        .select(`
            joined_room,
            accepted
        `)
        .eq("joiner_id", userId)
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