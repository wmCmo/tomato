import { GearIcon, IconContext, LogIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";
import { useToast } from "../hooks/useToast";
import { supabase } from "../lib/supabase";
import Error from "./Error";
import ProfileSkeleton from "./ui/ProfileSkeleton";

const medals = ['1st', '2nd', '3rd'];
const fluentRepo = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets";

const Profile = () => {
    const { user } = useAuth();
    const { userId } = useParams();
    const { toast } = useToast();

    const queryClient = useQueryClient();

    const { data: profile, isLoading, error } = useProfile(userId);

    const [bio, setBio] = useState('');
    const [showCopied, setShowCopied] = useState(false);

    useEffect(() => {
        setBio(profile?.bio ?? '');
    }, [profile?.bio]);

    useEffect(() => {
        if (!showCopied) return;
        setTimeout(() => {
            setShowCopied(false);
        }, 1200);
    }, [showCopied]);

    const oneWeekSession = useMemo(() => {
        const studySessions = profile?.study_sessions ?? [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDay = new Date(today);
        startDay.setDate(today.getDate() - 6);

        const totalsByDay = new Map();

        for (const session of studySessions) {
            const edited = new Date(session.last_edited);
            edited.setHours(0, 0, 0, 0);
            if (edited < startDay) break;
            if (edited > today) continue;

            const key = edited.toLocaleDateString();
            const prev = totalsByDay.get(key) ?? 0;
            totalsByDay.set(key, prev + (session.sessions ?? 0));
        }

        const result = [];
        for (let offset = 6; offset >= 0; offset--) {
            const day = new Date(today);
            day.setDate(today.getDate() - offset);
            const key = day.toLocaleDateString();
            result.push(totalsByDay.get(key) ?? 0);
        }

        return result;
    }, [profile?.study_sessions]);

    const { dict } = useOutletContext();
    const weekDays = dict.profile.days;

    if (isLoading) return <ProfileSkeleton />;
    if (error) return <Error item={'profile'} />;

    const todayIndex = weekDays.indexOf(new Date().toLocaleString(dict.langTag, { weekday: "short" })) + 1;
    const sortedWeekDay = weekDays.slice(todayIndex).concat(weekDays.slice(0, todayIndex));
    const weekMaxTomato = Math.max(1, ...oneWeekSession);

    const handleSaveBio = async () => {
        const nextBio = bio;
        const { error } = await supabase
            .from('profiles')
            .update({ bio: nextBio })
            .eq('id', userId);

        if (error) {
            toast(undefined, 'There was a problem updating your profile.', 'errorDb');
            console.error(error);
            return;
        }

        queryClient.setQueryData(['profile', userId], (old) => {
            if (!old) return old;
            return { ...old, bio: nextBio };
        });
        return;
    };

    const isOwner = user.id === userId;


    return (
        <div className='text-accent w-full px-2 mt-12'>
            <div className="sm:flex justify-between gap-8">
                <section className="flex gap-6 items-center relative">
                    <img src={`${profile.avatar_url}`} alt="User's Google or custom avatar" className="h-20 w-auto rounded-full" />
                    <div className="w-full">
                        {isOwner && <div className="flex items-center justify-between sm:gap-8">
                            <h1>{dict.profile.welcome}</h1>
                            <div className="flex items-center gap-4">
                                <IconContext.Provider value={{
                                    weight: 'fill',
                                    size: '1.5rem',
                                }}>
                                    <ShareNetworkIcon onClick={() => { navigator.clipboard.writeText(`https://wmcmo.github.io/tomato/profile/${userId}`); setShowCopied(true); }} className="icon" />
                                    <Link to={'/setting'}>
                                        <GearIcon className="icon" />
                                    </Link>
                                </IconContext.Provider>
                            </div>
                        </div>}
                        <h2 className="text-3xl font-bold mt-1">{profile.nickname ?? user.user_metadata.full_name}</h2>
                    </div>
                    <div className={`text-sm absolute right-0 bottom-0 transition-all duration-200 ease-in-out bg-foreground px-4 py-2 rounded-lg text-accent font-bold ${showCopied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>{dict.profile.copied}</div>
                </section>
                <section className="mt-8 px-4 py-4 card border-none flex items-center flex-grow">
                    {
                        isOwner ?
                            (<>
                                🗨️ <input onChange={(e) => { setBio(e.target.value); }} value={bio} type="text" name="bio" id="bio" placeholder={dict.profile.status} className="bg-transparent w-5/6 ml-1 outline-none truncate" />{profile.bio !== bio && <img onClick={handleSaveBio} src={`${fluentRepo}/Floppy%20disk/Color/floppy_disk_color.svg`} className="h-6 w-auto ml-auto cursor-pointer animate-pulse" alt="Fluent floppy disk emoji for saving bio" />}
                            </>)
                            :
                            <p>🗨️ {bio}</p>
                    }
                </section>
            </div>
            <div className="md:flex gap-16">
                <section className="space-y-2 mt-8 rounded-lg flex-1">
                    <div className="flex gap-2">
                        <img src={`${fluentRepo}/Trophy/Color/trophy_color.svg`} alt="Fluent Trophy emoji" className="w-6 h-auto" />
                        <h3 className="font-semibold">{dict.profile.highScore}</h3>
                    </div>
                    <div className="card space-y-4 px-10 py-8">
                        {profile.study_sessions.length > 0 ? [...profile.study_sessions].sort((a, b) => b.sessions - a.sessions).slice(0, 3).map((session, index) => {
                            return (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex gap-2 items-center">
                                        <img className="w-4 h-auto" src={`${fluentRepo}/${medals[index]}%20place%20medal/Color/${medals[index]}_place_medal_color.svg`} alt={`Medal for ${medals[index]} place of session record`} />
                                        <p className="">{dict.profile.formatDate(new Date(session.last_edited))}</p>
                                    </div>
                                    <div className="flex-grow px-4">
                                        <div className="border-b border-border"></div>
                                    </div>
                                    <div className="flex items-end w-12 justify-between">
                                        <img className="w-5 h-auto" src={`${fluentRepo}/Tomato/Color/tomato_color.svg`} alt="Fluent tomato emoji" />
                                        <p className="leading-none font-bold">x{session.sessions}</p>
                                    </div>
                                </div>
                            );
                        })
                            :
                            <span className="text-muted flex gap-2 text-sm"><img className="w-5 h-auto" src={`${fluentRepo}/Sleeping%20face/Color/sleeping_face_color.svg`} alt="Fluent sleeping face emoji signaling empty session" />{dict.profile.emptySession}</span>
                        }
                    </div>
                </section>
                <section className="mt-8 space-y-2 flex-1">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <img src={`${fluentRepo}/Potted%20plant/Color/potted_plant_color.svg`} alt="Fluent Potted Plant emoji" className="w-6 h-auto" />
                            <h3 className="font-semibold">{dict.profile.thisWeek}</h3>
                        </div>
                        {isOwner && <Link to={'/record'}>
                            <div className="flex gap-2 items-center cursor-pointer text-muted hover:underline underline-offset-4 hover:text-muted-foreground transition-all duration-100">
                                <span className="text-sm">{dict.profile.viewMore}</span>
                                <LogIcon />
                            </div>
                        </Link>}
                    </div>
                    <div className="flex gap-1 justify-center md:justify-around px-4 md:px-16 py-8 card">
                        {sortedWeekDay.map((day, index) => {
                            const amount = oneWeekSession.at(index) ?? 0;
                            const sizePercent = amount / weekMaxTomato;
                            let src;
                            if (sizePercent > 0.8) src = '100';
                            else if (sizePercent > 0.6) src = '80';
                            else if (sizePercent > 0.4) src = '60';
                            else if (sizePercent > 0.2) src = '40';
                            else if (sizePercent > 0) src = '20';
                            return (
                                <div key={index} className="flex flex-col gap-1 items-center justify-between min-w-9 relative">
                                    <p className={`text-center text-sm ${index === 6 && 'font-bold'}`}>{day}</p>
                                    {oneWeekSession.at(index) ? <img src={`${import.meta.env.BASE_URL}tomato-phases/${src}.svg`} alt="Fluent tomato emoji for scoring" className="w-8 h-auto" /> : <div className="w-8 h-8 flex items-center justify-center"><div className="bg-border rounded-full w-3 h-3"></div></div>}
                                    <div className="absolute bg-background min-w-8 py-1 rounded-full font-bold bottom-0 opacity-0 hover:opacity-100 text-center transition-all duration-200 ease-out">{amount}</div>
                                </div>
                            );
                        })}
                    </div>
                </section >
            </div>
        </div >
    );
};

export default Profile;
