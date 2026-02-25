import { supabase } from "../lib/supabase";

export default async function fetchFollowing(userId) {
    const { data, error } = await supabase
        .from("follows")
        .select(`
            following:profiles!follows_following_id_fkey (id, nickname, avatar_url, bio, handle)
            `)
        .eq("follower_id", userId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((row) => row.following);
}
