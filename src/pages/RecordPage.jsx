import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Link, Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import ProfileSkeleton from "../components/ui/ProfileSkeleton";
import useProfile from "../hooks/useProfile";
import formatDateEnNoYear from "../utils/formatDateEnNoYear";
import { useMemo } from "react";
import RecordCard from "../components/RecordCard";
import useConfirm from "../hooks/useConfirm";
import { supabase } from "../lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import BackToHome from "../components/BackToHome";
import Error from "../components/Error";



const fluentRepo = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/";

const RecordPage = () => {
    const { user, loading: authLoading } = useAuth();
    const queryClient = useQueryClient();

    if (authLoading) {
        return <ProfileSkeleton />;
    }

    if (!user) return <Navigate to={'/login'} replace />;

    const { data: sessions, isLoading, error } = useProfile(user?.id, {
        select: p => p?.study_sessions ?? []
    });

    const mappedSessions = useMemo(() => {
        if (!sessions) return {};
        const map = new Map();
        for (const session of sessions) {
            const lastEdit = new Date(session.last_edited);
            const editedYear = String(lastEdit.getFullYear());
            const editedMonth = lastEdit.toLocaleString('default', { month: 'long' });
            if (!Object.keys(map).includes(editedYear)) {
                map[editedYear] = new Map();
            }
            if (!Object.keys(map[editedYear]).includes(editedMonth)) {
                map[editedYear][editedMonth] = [];
            }
            map[editedYear][editedMonth].push({ id: session.id, sessions: session.sessions, lastEdit: formatDateEnNoYear(lastEdit) });
        }
        return map;
    }, [sessions]);

    const { confirm, modal } = useConfirm();

    if (isLoading) return <ProfileSkeleton />;

    if (error) return <Error item={'Pomodoro sessions'} />;

    async function handleDelete(sessionId) {
        const ok = await confirm("Deleting a record, are you sure?");
        if (!ok) return;
        const { error } = await supabase.from('study_sessions').delete().eq("id", sessionId);
        if (error) throw error;

        queryClient.setQueryData(['profile', user.id], old => {
            if (!old) return old;
            return {
                ...old,
                study_sessions: old.study_sessions.filter(s => s.id !== sessionId)
            };
        });
    }

    return (
        <div className="relative text-accent w-full px-4">
            <section className="sticky top-20 pt-10 bg-background w-full">
                <div className="flex justify-between">
                    <div className="flex gap-1 items-center">
                        <img src={`${fluentRepo}Potted%20plant/Color/potted_plant_color.svg`} alt="Fluent Potted Plant emoji" />
                        <h1 className="font-bold text-xl">Your Record</h1>
                    </div>
                    <Link to={`/profile/${user.id}`} className="flex gap-2 items-center bg-foreground rounded px-2 py-1 icon">
                        <ArrowLeftIcon />
                        <span className="text-sm font-semibold">Back to Profile</span>
                    </Link>
                </div>
                <hr className="border-border my-8" />
            </section>
            {
                mappedSessions.size > 0 ?
                    (

                        Object.entries(mappedSessions).map(([year, months]) => {
                            return (
                                <section key={year} className="">
                                    <h2 className="font-bold text-2xl text-muted">{year}</h2>
                                    {Object.entries(months).map(([month, entries]) => {
                                        return <RecordCard key={month} month={month} entries={entries} handleDelete={handleDelete} />;
                                    })}
                                </section>
                            );
                        })
                    ) :
                    <div className="grid place-items-center space-y-4">
                        <h2 className="leading-7 text-center">You sessions are currently <strong>empty</strong>. Let's go back to homepage and lock in!~</h2>
                        <BackToHome />
                    </div>
            }
            {modal}
        </div>
    );
};

export default RecordPage;
