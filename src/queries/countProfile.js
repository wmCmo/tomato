import { supabase } from "../lib/supabase";

export default async function countProfile(userId) {
    const { data, error } = await supabase
        .rpc("get_follow_counts", { user_id: userId });
    if (error) {
        console.error("Error fetching counts:", error);
        throw error;
    }
    return data;
}
