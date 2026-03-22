'use client';

import Error from "@/components/Error";
import FollowButton from "@/components/FollowButton";
import ConnectionsSkeleton from "@/components/ui/ConnectionsSkeleton";
import useAuth from "@/hooks/useAuth";
import useDict from "@/hooks/useDict";
import useProfile from "@/hooks/useProfile";
import fetchFollowers from "@/queries/follower";
import fetchFollowing from "@/queries/following";
import { skipToken, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const views = ['following', 'followers'];

export default function ConnectionPage() {
    const searchParams = useSearchParams();
    const [view, setView] = useState(searchParams.get('view') ?? 'following');
    const { userId } = useParams<{ userId: string; }>();
    const { user } = useAuth();
    const { dict } = useDict();

    useEffect(() => {
        if (!views.includes(view))
            setView('following');
    }, [view]);

    const { data: profile, isLoading, error } = useProfile(userId);

    const { data: following, isLoading: followingLoading, error: followingError } = useQuery({
        queryKey: ['following', profile?.id],
        queryFn: profile?.id ? () => fetchFollowing(profile.id) : skipToken
    });

    const { data: followers, isLoading: followersLoading, error: followersError } = useQuery({
        queryKey: ['followers', profile?.id],
        queryFn: profile?.id ? () => fetchFollowers(profile.id) : skipToken
    });

    if (isLoading) return <ConnectionsSkeleton />;

    if (!profile || error) return <Error item={"User's connection"} />;

    if (view === 'following') {
        if (followingLoading) return <ConnectionsSkeleton />;
        if (!following || followingError) return <Error item={"Following"} />;
    }

    if (view === 'followers') {
        if (followersLoading) return <ConnectionsSkeleton />;
        if (!followers || followersError) return <Error item={"Followers"} />;
    }

    const displayList = view === 'following' ? following : followers;

    return (
        <div className="text-accent relative grow flex flex-col justify-center items-center px-4">
            <nav className="bg-background sticky top-24 w-full flex flex-col items-center max-w-lg">
                <div className="text-sm flex bg-foreground rounded-full p-2 relative gap-4 max-w-72">
                    <div style={{ "--anim-offset": "8px" } as React.CSSProperties} className={`absolute bg-muted h-9 rounded-full ${view === 'following' ? 'animate-stretch-left' : 'animate-stretch-right'}`}></div>
                    <button type="button" onClick={() => setView('following')} className={`z-10 px-6 py-2 rounded-full font-bold ${view === 'followers' ? 'text-muted-foreground' : ''}`}>{dict.profile.following}</button>
                    <button type="button" onClick={() => setView('followers')} className={`z-10 px-6 py-2 rounded-full font-bold ${view === 'following' ? 'text-muted-foreground' : 'font-bold'}`}>{dict.profile.followers}</button>
                </div>
            </nav>
            <section className="mt-8 max-w-lg w-full">
                {
                    displayList && displayList.length > 0 ?
                        displayList.map((item, _) => (
                            <div key={item.id} className="mt-4">
                                <Link className="flex items-center gap-4" href={`/${dict.langSubTag}/main/${item.handle ? `@${item.handle}` : item.id}`}>
                                    <img className="h-8 w-8 rounded-full" src={item?.avatar_url} alt={`${item.nickname}'s avatar`} />
                                    <div className="font-bold flex gap-1.5 sm:gap-4 justify-center items-start sm:items-center flex-col sm:flex-row">
                                        <p className="">{item.nickname}</p>
                                        {item.handle && <p className="text-xs text-muted-foreground bg-foreground px-2 py-1 rounded-lg">@ {item.handle}</p>}
                                    </div>
                                    {item.id !== user?.id && <FollowButton style={{ 'marginLeft': 'auto' }} userId={item.id} />}
                                </Link>
                                <hr className="mt-4 border-border" />
                            </div>
                        ))
                        :
                        <div className="text-center">{profile.nickname}{view === 'following' ? dict.connections.noFollowing : dict.connections.noFollowers}</div>
                }
            </section>
        </div>
    );
}
