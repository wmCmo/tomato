import { supabase } from "@/lib/supabase";
import RoomStatusType from "@/types/RoomStatus";

export default async function getRoomStatus(roomId: string) {
    if (!roomId) throw new Error("Room ID is required");
    const { data, error } = await supabase
        .from("room_status")
        .select(`
            id,
            status,
            isPlaying,
            ends_at,
            last_edited,
            current_session,
            session:study_sessions!room_status_current_session_fkey (sessions)
        `)
        .eq("id", roomId)
        .maybeSingle()
        .overrideTypes<RoomStatusType, { merge: false; }>();
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
