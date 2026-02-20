import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, Navigate, useOutletContext } from "react-router";
import BackToHome from "../components/BackToHome";
import Error from "../components/Error";
import RecordCard from "../components/RecordCard";
import ProfileSkeleton from "../components/ui/ProfileSkeleton";
import useAuth from "../hooks/useAuth";
import useConfirm from "../hooks/useConfirm";
import useProfile from "../hooks/useProfile";
import { useToast } from "../hooks/useToast";
import { supabase } from "../lib/supabase";

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

    const { dict } = useOutletContext();

    const mappedSessions = useMemo(() => {
        if (!sessions) return {};
        const map = new Map();
        for (const session of sessions) {
            const lastEdit = new Date(session.last_edited);
            const editedYear = String(lastEdit.getFullYear());
            const editedMonth = lastEdit.getMonth();
            if (!map.has(editedYear)) {
                map.set(editedYear, new Map());
            }
            const years = map.get(editedYear);
            if (!years.has(editedMonth)) {
                years.set(editedMonth, []);
            }
            years.get(editedMonth).push({ id: session.id, sessions: session.sessions, lastEdit: dict.record.formatDate(lastEdit) });
        }
        return map;
    }, [sessions, dict]);

    const { confirm, modal } = useConfirm();
    const { toast } = useToast();

    if (isLoading) return <ProfileSkeleton />;

    if (error) return <Error item={'Pomodoro sessions'} />;

    async function handleDelete(sessionId) {
        const ok = await confirm(dict.record.warning);
        if (!ok) return;
        const { error } = await supabase.from('study_sessions').delete().eq("id", sessionId);
        if (error) {
            toast(undefined, 'There was a problem deleting your record', 'errorDb');
            console.error(error.code, error.message);
            return;
        }

        const localSessionId = Number(localStorage.getItem('active_session_id'));
        if (localSessionId === sessionId) {
            localStorage.removeItem('active_session_id');
        }
        queryClient.setQueryData(['profile', user.id], old => {
            if (!old) return old;
            return {
                ...old,
                study_sessions: old.study_sessions.filter(s => s.id !== sessionId)
            };
        });

        return;
    }

    return (
        <div className="relative text-accent w-full px-4">
            <section className="sticky top-20 pt-10 bg-background w-full">
                <div className="flex justify-between">
                    <div className="flex gap-1 items-center">
                        <img src={`${fluentRepo}Potted%20plant/Color/potted_plant_color.svg`} alt="Fluent Potted Plant emoji" />
                        <h1 className="font-bold text-xl">{dict.record.header}</h1>
                    </div>
                    <Link to={`/profile/${user.id}`} className="flex gap-2 items-center bg-foreground rounded px-2 py-1 icon">
                        <ArrowLeftIcon />
                        <span className="text-sm font-semibold">{dict.record.return}</span>
                    </Link>
                </div>
                <hr className="border-border my-8" />
            </section>
            {
                mappedSessions.size > 0 ?
                    (
                        [...mappedSessions.entries()].map(([year, months]) => {
                            return (
                                <section key={year} className="">
                                    <h2 className="font-bold text-2xl text-muted">{year}</h2>
                                    {[...months.entries()].map(([month, entries]) => {
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
