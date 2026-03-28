import { supabase } from "@/lib/supabase";
import MessageType from "@/types/Message";

export default async function getChatMessages(chatRoomId: string): Promise<MessageType[] | null> {
    if (!chatRoomId) throw new Error("Chat Room ID is required");

    const { data, error } = await supabase
        .from('messages')
        .select("*")
        .eq("chat_room", chatRoomId)
        .order("created_at", { ascending: true });
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