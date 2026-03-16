import { supabase } from "@/lib/supabase";

export default async function getRoomStatus(roomId: string) {
    if (!roomId) throw new Error("Room ID is required");
    const { data, error } = await supabase
        .from("room_status")
        .select(`
            status,
            isPlaying
        `)
        .eq("id", roomId)
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