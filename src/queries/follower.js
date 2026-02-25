import { supabase } from "../lib/supabase";

export default async function fetchFollowers(userId) {
    const { data, error } = await supabase
        .from("follows")
        .select(`
            follower:profiles!follows_follower_id_fkey (id, nickname, avatar_url, bio, handle)
            `)
        .eq("following_id", userId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((row) => row.follower);
}
