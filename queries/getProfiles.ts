import { supabase } from "@/lib/supabase";

export interface MinimalProfile {
    id: string; nickname: string; avatar_url: string;
}

export default async function getProfiles(idList: string[]): Promise<MinimalProfile[] | null> {
    if (!idList) throw new Error("User IDs are required");
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            id,
            nickname,
            avatar_url
        `)
        .in('id', idList);
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
