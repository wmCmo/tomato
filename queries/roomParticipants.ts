import { supabase } from "@/lib/supabase";

export default async function getRoomParticipants(roomId: string): Promise<RoomParticipantsType[] | null> {
    if (!roomId) throw new Error("Room ID is required");
    const { data, error } = await supabase
        .from("rooms")
        .select(`
            joiner_id,
            joined_room,
            accepted,
            joiner:profiles!rooms_joiner_id_fkey (
            id,nickname,handle,avatar_url
            )
        `)
        .eq("joined_room", roomId)
        .order("last_edited", { ascending: false });
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
    return data?.map(participant => ({
        ...participant,
        joiner: Array.isArray(participant.joiner)
            ? participant.joiner[0]
            : participant.joiner
    }));
}