import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import Error from "../components/Error";
import FollowButton from "../components/FollowButton";
import ProfileSkeleton from "../components/ui/ProfileSkeleton";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";
import fetchFollowers from "../queries/follower";
import fetchFollowing from "../queries/following";

export default function ConnectionPage() {
    const [searchParams] = useSearchParams();
    const [view, setView] = useState(searchParams.get('view'));
    const { userId } = useParams();
    const { user } = useAuth();

    const { data: profile, isLoading, error } = useProfile(userId);


    const { data: following, isLoading: followingLoading, error: followingError } = useQuery({
        queryKey: ['following', userId],
        queryFn: () => fetchFollowing(userId)
    });

    const { data: followers, isLoading: followersLoading, error: followersError } = useQuery({
        queryKey: ['followers', userId],
        queryFn: () => fetchFollowers(userId)
    });

    if (isLoading) return <ProfileSkeleton />;

    if (error) return <Error item={"User's connection"} />;

    if (view === 'following') {
        if (followingLoading) return <ProfileSkeleton />;
    }

    if (view === 'followers') {
        if (followersLoading) return <ProfileSkeleton />;
    }

    return (
        <div className="text-accent relative">
            <nav className="bg-background sticky top-24 w-full flex flex-col items-center">
                <div className="text-sm flex bg-foreground rounded-full p-2 relative gap-4 max-w-72">
                    <div style={{ "--anim-offset": "8px" }} className={`absolute bg-muted h-9 rounded-full ${view === 'following' ? 'animate-stretch-left' : 'animate-stretch-right'}`}></div>
                    <button onClick={() => setView('following')} className={`z-10 px-6 py-2 rounded-full ${view === 'followers' ? 'text-muted-foreground' : 'font-bold'}`}>フォロー中</button>
                    <button onClick={() => setView('followers')} className={`z-10 px-6 py-2 rounded-full ${view === 'following' ? 'text-muted-foreground' : 'font-bold'}`}>フォロワー</button>
                </div>
            </nav>
            <section className="mt-8">
                {
                    (view === 'following' ? following : followers).length > 0 ?
                        (view === 'following' ? following : followers).map((item, index) => (
                            <div key={index} className="mt-4">
                                <Link className="flex items-center gap-4" to={`https://wmcmo.github.io/tomato/profile/${item.id}`}>
                                    <img className="h-8 w-8 rounded-full" src={item.avatar_url} alt={`${item.nickname}'s avartar`} />
                                    <span className="font-bold">{item.nickname}</span>
                                    {item.id !== user.id && <FollowButton style={{ 'marginLeft': 'auto' }} userId={item.id} />}
                                </Link>
                                <hr className="mt-4 border-border" />
                            </div>
                        ))
                        :
                        <div className="text-center">{profile.nickname}は{view === 'following' ? '誰もフォローをしてないみたいです' : '（まだ）誰にもフォローされてません'}。</div>
                }
            </section>
        </div>
    );
}
