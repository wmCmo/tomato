import { supabase } from "@/lib/supabase";
import ConnectionsType from "@/types/Connections";

export default async function fetchFollowing(
    userId: string | undefined,
): Promise<ConnectionsType[]> {
    const { data, error } = await supabase
        .from("follows")
        .select(`
            following:profiles!follows_following_id_fkey (id, nickname, avatar_url, bio, handle)
            `)
        .eq("follower_id", userId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data.flatMap((row) => row.following);
}
