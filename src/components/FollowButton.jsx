import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import checkIsFollowing from "../queries/checkIsFollowing";
import { useToast } from "../hooks/useToast";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function FollowButton({ userId, style }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const [hoverFollowButton, setHoverFollowButton] = useState(false);

    const { data: isFollowing, isLoading: isFollowingLoading } = useQuery({
        queryKey: ["isFollowing", user?.id, userId],
        queryFn: () => checkIsFollowing(user?.id, userId),
        enabled: !!user?.id && !!userId,
        staleTime: Infinity
    });

    async function handleFollow() {
        if (!user) {
            navigate('/login');
            return;
        }
        const { error } = await supabase
            .from('follows')
            .insert({ follower_id: user?.id, following_id: userId });
        if (error) {
            console.error("Failed to follow a user:", error);
            toast(undefined, dict.error.updateProfile, 'errorDb');
            return;
        }
        queryClient.setQueryData(['isFollowing', user?.id, userId], true);
        queryClient.invalidateQueries({ queryKey: ['profileCount', userId] });
    }

    async function handleUnfollow() {
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', user?.id)
            .eq('following_id', userId);
        if (error) {
            console.error("Failed to unfollow a user:", error);
            toast(undefined, dict.error.updateProfile, 'errorDb');
            return;
        }
        queryClient.setQueryData(['isFollowing', user?.id, userId], false);
        queryClient.invalidateQueries({ queryKey: ['profileCount', userId] });
    }

    return (
        <button style={style} onClick={isFollowing ? handleUnfollow : handleFollow} onMouseEnter={() => setHoverFollowButton(true)} onMouseLeave={() => setHoverFollowButton(false)} className={`${isFollowing ? hoverFollowButton ? "text-rose-500 bg-rose-400/20 border border-rose-400" : 'bg-foreground border border-muted opacity-60' : 'bg-foreground'} px-6 py-2 text-xs rounded-full font-bold text-accent max-w-sm inline-block transition-all duration-100 ease-out`}>{isFollowing ? hoverFollowButton ? "フォロー解除" : "フォロー中" : "フォロー"}</button>
    );
}
