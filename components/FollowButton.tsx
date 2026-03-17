'use client';

import useAuth from "@/hooks/useAuth";
import useDict from "@/hooks/useDict";
import useProfile from "@/hooks/useProfile";
import useToast from "@/hooks/useToast";
import { supabase } from "@/lib/supabase";
import { skipToken, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import checkIsFollowing from "../queries/checkIsFollowing";

export default function FollowButton({ userId, style }: { userId: string | undefined; style?: React.CSSProperties; }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const { dict } = useDict();

    const queryClient = useQueryClient();

    const [hoverFollowButton, setHoverFollowButton] = useState(false);

    const { data: profile, isLoading, error } = useProfile(userId);

    const { data: isFollowing, isLoading: isFollowingLoading } = useQuery({
        queryKey: ["isFollowing", user?.id, profile?.id],
        queryFn: (user?.id && profile?.id) ? () => checkIsFollowing(user.id, profile.id) : skipToken,
        staleTime: Infinity
    });

    async function handleFollow() {
        if (!user) {
            router.push(`/${dict.langSubTag}/main/signin`);
            return;
        }
        if (!profile?.id) {
            toast(undefined, dict.error.getUrl, 'errorDb');
            return;
        }
        const { error } = await supabase
            .from('follows')
            .insert({ follower_id: user.id, following_id: profile.id });
        if (error) {
            console.error("Failed to follow a user:", error);
            toast(undefined, dict.error.updateProfile, 'errorDb');
            return;
        }
        queryClient.setQueryData(['isFollowing', user.id, profile.id], true);
        queryClient.invalidateQueries({ queryKey: ['profileCount', profile.id] });
    }

    async function handleUnfollow() {
        if (!profile?.id) {
            toast(undefined, dict.error.getUrl, 'errorDb');
            return;
        }
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', user?.id)
            .eq('following_id', profile.id);
        if (error) {
            console.error("Failed to unfollow a user:", error);
            toast(undefined, dict.error.updateProfile, 'errorDb');
            return;
        }
        queryClient.setQueryData(['isFollowing', user?.id, profile.id], false);
        queryClient.invalidateQueries({ queryKey: ['profileCount', profile.id] });
    }

    return (
        <button type="button" style={style} onClick={isFollowing ? handleUnfollow : handleFollow} onMouseEnter={() => setHoverFollowButton(true)} onMouseLeave={() => setHoverFollowButton(false)} className={`${isFollowing ? hoverFollowButton ? "text-rose-500 bg-rose-400/20 border border-rose-400" : 'bg-foreground border border-muted opacity-60' : 'bg-foreground'} text-nowrap px-6 py-2 text-xs rounded-full font-bold text-accent max-w-sm inline-block transition-all duration-100 ease-out`}>{isFollowingLoading || isLoading ? dict.ui.loading : isFollowing ? hoverFollowButton ? dict.ui.unfollow : dict.profile.following : dict.ui.follow}</button>
    );
}
