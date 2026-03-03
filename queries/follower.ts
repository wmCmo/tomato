import { supabase } from "@/lib/supabase";
import { ConnectionsType } from "@/types/Connections";

export default async function fetchFollowers(
    userId: string | undefined,
): Promise<ConnectionsType[]> {
    const { data, error } = await supabase
        .from("follows")
        .select(`
            follower:profiles!follows_follower_id_fkey (id, nickname, avatar_url, bio, handle)
            `)
        .eq("following_id", userId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data.flatMap((row) => row.follower);
}
