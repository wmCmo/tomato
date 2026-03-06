'use client';

import BackToHome from "@/components/BackToHome";
import Error from "@/components/Error";
import RecordCard from "@/components/RecordCard";
import RecordsSkeleton from "@/components/ui/RecordsSkeleton";
import useAuth from "@/hooks/useAuth";
import useConfirm from "@/hooks/useConfirm";
import { useDict } from "@/hooks/useDict";
import useProfile from "@/hooks/useProfile";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/lib/supabase";
import { ProfileType } from "@/types/Profile";
import { StudySessionType } from "@/types/StudySession";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo } from "react";

const fluentRepo = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/";

const RecordPage = ({ params }: { params: Promise<{ userId: string; }>; }) => {
    const { user, loading: authLoading } = useAuth();
    const { userId } = use(params);
    const queryClient = useQueryClient();
    const router = useRouter();
    const { dict } = useDict();

    if (authLoading) return <RecordsSkeleton />;

    useEffect(() => {
        if (!user) router.push(`/${dict.langSubTag}/main/signin`);
    }, [user, router]);


    const { data: sessions, isLoading, error } = useProfile<StudySessionType[]>(userId, {
        select: (p: ProfileType): StudySessionType[] => p?.study_sessions ?? []
    });

    const mappedSessions = useMemo(() => {
        if (!sessions) return new Map();
        const map = new Map<number, Map<number, Omit<StudySessionType, "created_at">[]>>();
        for (const session of sessions) {
            const lastEdit = new Date(session.last_edited);
            const editedYear = lastEdit.getFullYear();
            const editedMonth = lastEdit.getMonth();
            if (!map.has(editedYear)) {
                map.set(editedYear, new Map());
            }
            const years = map.get(editedYear)!;
            if (!years.has(editedMonth)) {
                years.set(editedMonth, []);
            }
            years.get(editedMonth)!.push({ id: session.id, sessions: session.sessions, last_edited: dict.record.formatDate(lastEdit) });
        }
        return map;
    }, [sessions, dict]);

    const { confirm, modal } = useConfirm();
    const { toast } = useToast();

    if (isLoading) return <RecordsSkeleton />;

    if (error) return <Error item={'Pomodoro sessions'} />;

    async function handleDelete(sessionId: number) {
        const ok = await confirm(dict.record.warning);
        if (!ok) return;
        const { error } = await supabase.from('study_sessions').delete().eq("id", sessionId);
        if (error) {
            toast(undefined, dict.error.delete, 'errorDb');
            console.error(error.code, error.message);
            return;
        }

        const localSessionId = Number(localStorage.getItem('active_session_id'));
        if (localSessionId === sessionId) {
            if (typeof window !== "undefined") localStorage.removeItem('active_session_id');
        }
        queryClient.setQueryData(['profile', user?.id], (old: ProfileType) => {
            if (!old) return old;
            return {
                ...old,
                study_sessions: old.study_sessions.filter(s => s.id !== sessionId)
            };
        });

        return;
    }

    return (
        <div className="relative text-accent w-full px-4 max-w-lg">
            <section className="sticky top-20 pt-10 bg-background w-full">
                <div className="flex justify-between flex-col sm:flex-row gap-4">
                    <div className="flex gap-1 items-center">
                        <img src={`${fluentRepo}Potted%20plant/Color/potted_plant_color.svg`} alt="Fluent Potted Plant emoji" />
                        <h1 className="font-bold text-xl">{dict.record.header}</h1>
                    </div>
                    <Link href={`/${dict.langSubTag}/main/profile/${userId}`} className="flex gap-2 items-center bg-foreground rounded px-2 py-1 icon max-w-xs">
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
                                <section key={year} className="pt-10">
                                    <div className="flex items-center gap-4 text-accent">
                                        <h2 className="font-bold text-2xl">{year}</h2>
                                        <div className="text-base px-2 py-1 bg-foreground rounded-lg font-bold flex items-center gap-1"><img className="w-4 h-4" src={`${fluentRepo}Tomato/Color/tomato_color.svg`} alt="Fluent tomato emoji" /><span>{[...months.values()].flat().reduce((sum, entry) => sum + entry.sessions, 0)} {dict.record.thisYear}</span></div>
                                    </div>
                                    {[...months.entries()].map(([month, entries]) => {
                                        return <RecordCard key={month} user={user} userId={userId} month={month} entries={entries} handleDelete={handleDelete} />;
                                    })}
                                </section>
                            );
                        })
                    ) :
                    <div className="grid place-items-center space-y-4">
                        <h2 className="leading-7 text-center">{dict.record.empty[0]}<strong>{dict.record.empty[1]}</strong>{dict.record.empty[2]}</h2>
                        <BackToHome />
                    </div>
            }
            {modal}
        </div>
    );
};

export default RecordPage;
