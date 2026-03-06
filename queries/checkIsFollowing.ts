import { supabase } from "../lib/supabase";

export default async function checkIsFollowing(
    userId: string | undefined,
    profileUserId: string,
) {
    if (!userId || !profileUserId) return false;

    const { data, error } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", userId)
        .eq("following_id", profileUserId)
        .maybeSingle();

    if (error) {
        console.error("Failed to check following boolean:", error);
        throw error;
    }

    return !!data;
}
