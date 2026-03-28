'use client';

import ChatRoom from "@/components/ChatRoom";
import Clock from "@/components/Clock";
import Error from "@/components/Error";
import SideClock from "@/components/SideClock";
import RoomSkeleton from "@/components/ui/RoomSkeleton";
import useAuth from "@/hooks/useAuth";
import useConfirm from "@/hooks/useConfirm";
import useDict from "@/hooks/useDict";
import useNavContext from "@/hooks/useNavContext";
import useProfile from "@/hooks/useProfile";
import useToast from "@/hooks/useToast";
import { supabase } from "@/lib/supabase";
import getMyRoom from "@/queries/myRoom";
import getRoomParticipants from "@/queries/roomParticipants";
import getRoomStatus from "@/queries/roomStatus";
import { StatusType } from "@/types/ClockState";
import { CheckSquareIcon, IconContext, ShareNetworkIcon, TrashIcon, XSquareIcon } from "@phosphor-icons/react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { skipToken, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function RoomPage() {
    const { user } = useAuth();
    const { userId } = useParams<{ userId: string; }>();
    const { isPixel, timerOn, isMarathon } = useNavContext();
    const { dict } = useDict();
    const { confirm, modal } = useConfirm();
    const { toast } = useToast();
    const router = useRouter();

    const [showCopied, setShowCopied] = useState(false);

    const queryClient = useQueryClient();

    const { data: profile, isLoading: profileIsLoading, error: profileError } = useProfile(userId);
    const joinersQueryKey = ["roomParticipants", profile?.id];
    const myRoomQueryKey = ["myRoom", user?.id];
    const roomStatusQueryKey = ["roomStatus", profile?.id];

    const { data: roomParticipants, isLoading: isLoadingParticipants, error: participantsError } = useQuery({
        queryKey: joinersQueryKey,
        queryFn: profile?.id ? () => getRoomParticipants(profile.id) : skipToken,
        staleTime: 1000 * 60 * 3 //3 mins
    });

    const { data: myRoom, isLoading: myRoomIsLoading, error: myRoomError } = useQuery({
        queryKey: myRoomQueryKey,
        queryFn: user?.id ? () => getMyRoom(user.id) : skipToken,
        staleTime: Infinity
    });

    const { data: roomStatus, isLoading: roomStatusLoading, error: roomStatusError } = useQuery({
        queryKey: roomStatusQueryKey,
        queryFn: profile?.id ? () => getRoomStatus(profile.id) : skipToken,
        staleTime: Infinity
    });

    const { data: personalRoom, isLoading: personalRoomLoading } = useQuery({
        queryKey: ["roomStatus", user?.id],
        queryFn: user?.id ? () => getRoomStatus(user.id) : skipToken,
        staleTime: Infinity
    });

    useEffect(() => {
        if (!profile?.id) return;
        const channel = supabase
            .channel(`room-participants:${profile.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "rooms",
                },
                (payload: RealtimePostgresChangesPayload<{ joined_room: string | null; joiner_id: string | null; }>) => {
                    const oldRoomId = 'joined_room' in payload.old ? payload.old.joined_room : null;
                    const newRoomId = 'joined_room' in payload.new ? payload.new.joined_room : null;
                    const isRelevant = newRoomId === profile.id || oldRoomId === profile.id;
                    const oldJoiner = 'joiner_id' in payload.old ? payload.old.joiner_id : null;
                    const newJoiner = 'joiner_id' in payload.new ? payload.new.joiner_id : null;
                    if (isRelevant) {
                        if (oldJoiner === user?.id || newJoiner === user?.id) {
                            queryClient.invalidateQueries({ queryKey: myRoomQueryKey });
                        }
                        queryClient.invalidateQueries({ queryKey: joinersQueryKey });
                    }
                }
            ).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };


    }, [profile?.id, queryClient]);

    useEffect(() => {
        if (!profile?.id) return;
        const channel = supabase
            .channel(`room_status:${profile.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "room_status"
                },
                (payload: RealtimePostgresChangesPayload<{ id: string; status: StatusType; isPlaying: boolean; }>) => {
                    const payLoadId = 'id' in payload.new ? payload.new.id : null;
                    if (payLoadId === profile.id) {
                        queryClient.invalidateQueries({ queryKey: roomStatusQueryKey });
                    }
                }
            ).subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [profile?.id, queryClient]);

    useEffect(() => {
        if (!showCopied) return;
        const copyTimer = setTimeout(() => {
            setShowCopied(false);
        }, 1000);
        return () => clearTimeout(copyTimer);
    }, [showCopied]);

    const isOwner = profile?.id === user?.id;

    const updateActiveRoom = useCallback(async (chatRoomId: string) => {
        if (!isOwner || roomStatus?.current_chat_room || !profile?.id) return;
        await supabase
            .from('room_status')
            .update({ current_chat_room: chatRoomId })
            .eq("id", profile.id);
        queryClient.invalidateQueries({ queryKey: ["roomStatus", profile.id] });
        console.log('where are here');
    }, [queryClient, profile?.id, roomStatus?.current_chat_room, isOwner]);

    const newChatRoom = useCallback(async (init: boolean) => {
        if (!isOwner || !profile?.id) return;

        if (init) {
            const { data: chatRoom, error } = await supabase
                .from('chats')
                .select(`id, updated_at`)
                .order("updated_at", { ascending: false })
                .eq("owner", profile.id)
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error(error.code, error.message);
                return;
            }
            if (chatRoom) {
                updateActiveRoom(chatRoom.id);
                return;
            }

        }
        const { data, error } = await supabase
            .from('chats')
            .insert({ owner: profile.id })
            .select()
            .single();

        if (error) {
            console.error(error.code, error.message);
            toast(undefined, "Could not create new chat room", "errorDb");
            return;
        }
        if (data) {
            updateActiveRoom(data.id);
            console.log("inserting new chat room");
        };
    }, [isOwner, profile?.id]);


    useEffect(() => {
        newChatRoom(true);
    }, [newChatRoom]);

    if (profileIsLoading || myRoomIsLoading || roomStatusLoading) return <RoomSkeleton />;

    if (profileError || !profile) return <Error item={dict.nav.rooms} />;

    async function handleJoin(roomId: string) {
        if (!user?.id) {
            router.push(`/${dict.langSubTag}/main/signin`);
            return;
        }
        const { error } = await supabase
            .from('rooms')
            .upsert(
                [{
                    joiner_id: user.id,
                    joined_room: roomId
                }],
                {
                    onConflict: "joiner_id"
                }
            );
        if (error) {
            toast(undefined, dict.error.joinRoom, 'errorDb');
            console.error(error.code, error.message);
            return;
        }

        queryClient.setQueryData(myRoomQueryKey, (old: typeof myRoom) => {
            if (!old) return old;
            return { ...old, joined_room: profile?.id };
        });
    }

    async function handleAccept(userId: string) {
        const { error } = await supabase
            .from('rooms')
            .update({ accepted: true })
            .eq("joiner_id", userId);
        if (error) {
            toast(undefined, dict.error.acceptJoiner, 'errorDb');
            console.error(error.code, error.message);
            return;
        }
        queryClient.invalidateQueries({ queryKey: joinersQueryKey });
    }

    async function handleReject(userId: string) {
        const ok = await confirm(dict.rooms.delete);
        if (!ok) return;
        const { error } = await supabase
            .from('rooms')
            .update({ accepted: false, joined_room: null })
            .eq("joiner_id", userId);
        if (error) {
            toast(undefined, dict.error.rejectJoiner, 'errorDb');
            console.error(error.code, error.message);
            return;
        }
        queryClient.setQueryData(myRoomQueryKey, (old: typeof myRoom) => {
            if (!old) return old;
            return { joined_room: null, accepted: false };
        });
    }

    function handleCopy() {
        setShowCopied(true);
        const identifier = profile?.handle ? `@${profile.handle}` : profile?.id;
        navigator.clipboard.writeText(`https://ztomato.vercel.app/${dict.langSubTag}/main/${identifier}/rooms`);
    }

    const accepted = roomParticipants?.filter(s => s.accepted);
    const waiting = roomParticipants?.filter(s => !s.accepted);

    return (
        <div className="py-12 px-4 lg:p-0 relative grow flex flex-col lg:flex-row justify-center gap-8 lg:justify-around items-center text-accent">
            <Clock myRoom={personalRoom} myRoomLoading={personalRoomLoading} isPixel={isPixel} owner={profile?.nickname} roomStatus={roomStatus} isHost={isOwner} isMarathon={isMarathon} />
            {timerOn && <SideClock />}
            <div className="space-y-12 flex flex-col items-center">
                <div className="bg-foreground card p-4 space-y-4">
                    <div className="flex items-center gap-4 justify-between">
                        <h2 className="text-2xl font-bold">{dict.rooms.roomMember}</h2>
                        {(!isOwner && myRoom?.joined_room !== profile.id) && <button onClick={() => handleJoin(profile.id)} type="button" className="bg-blue-400 text-white font-bold px-4 py-1 rounded-lg hover:translate-y-0.5 active:translate-y-1">{dict.rooms.enter}</button>}
                    </div>
                    <Link className="flex items-center gap-2" href={`/${dict.langSubTag}/main/${profile.id}`}>
                        <Image className="rounded-full w-5 h-5" src={profile.avatar_url} alt={`${profile.avatar_url}'s avatar picture`} width={20} height={20} />
                        <span className="font-bold">{profile.nickname}</span>
                        <span className="ml-2 text-sm bg-background text-muted-foreground font-bold px-2 py-1 rounded-lg">{dict.rooms.host}</span>
                    </Link>
                    <hr className="border border-muted" />
                    {
                        accepted && accepted.length > 0 ?
                            accepted.map(joiner => {
                                return (
                                    <div className="flex justify-between items-center gap-4" key={joiner.joiner_id}>
                                        <Link className="flex gap-2 items-center" href={`/${dict.langSubTag}/main/${joiner.joiner_id}`}>
                                            <Image className="rounded-full w-5 h-5" src={joiner.joiner.avatar_url} alt={`${joiner.joiner.nickname}'s avatar picture`} width={20} height={20} />
                                            <span className="font-bold">{joiner.joiner.nickname}</span>
                                        </Link>
                                        {
                                            (user?.id === joiner.joiner_id || isOwner) &&
                                            <button type="button" onClick={() => handleReject(joiner.joiner_id)}>
                                                <TrashIcon weight="fill" className="text-muted hover:text-red-400 ml-auto" />
                                            </button>
                                        }
                                    </div>
                                );
                            }) :
                            isOwner ? (
                                waiting && waiting.length > 0 ?
                                    <div>
                                        <p className="text-muted-foreground">{dict.rooms.guest}👀</p>
                                    </div> :
                                    <div className="space-y-2">
                                        <p>{dict.rooms.empty}</p>
                                        {
                                            isOwner &&
                                            <button onClick={handleCopy} type="button" className={`text-sm mx-auto ${showCopied ? "bg-muted" : 'bg-background'} transition-all duration-200 ease-out card flex gap-2 items-center  px-4 py-2 rounded-full font-bold hover:translate-y-0.5 active:translate-y-1`}>
                                                {!showCopied && <ShareNetworkIcon weight="fill" />}
                                                {showCopied ? dict.rooms.copied : dict.rooms.invite}
                                            </button>
                                        }
                                    </div>
                            ) :
                                myRoom?.joined_room !== profile.id && <p>{dict.rooms.joinNow}</p>
                    }
                    {
                        waiting && waiting.length > 0 &&
                        (
                            <div className="mt-4">
                                <h4 className="font-bold text-lg mt-6 mb-2">{dict.rooms.waiting}🍵</h4>
                                <div className="space-y-2 mt-2">
                                    {waiting.map(joiner => {
                                        return (
                                            <div key={joiner.joiner_id} className="flex items-center justify-between gap-4">
                                                <Link className="flex gap-2 items-center`" href={`/${dict.langSubTag}/main/${joiner.joiner_id}`}>
                                                    <Image className="rounded-full w-5 h-5" src={joiner.joiner.avatar_url} alt={`${joiner.joiner.nickname}'s avatar picture`} width={20} height={20} />
                                                    <span className="font-bold">{joiner.joiner.nickname}</span>
                                                </Link>

                                                {
                                                    isOwner ?
                                                        <div className="flex ml-auto gap-2   items-center">
                                                            <IconContext.Provider value={{ weight: "fill", size: 20 }}>
                                                                <button type="button" onClick={() => handleReject(joiner.joiner_id)}>
                                                                    <XSquareIcon className="icon hover:text-red-400" />
                                                                </button>
                                                                <button type="button" onClick={() => handleAccept(joiner.joiner_id)}>
                                                                    <CheckSquareIcon className="icon hover:text-blue-400" />
                                                                </button>
                                                            </IconContext.Provider>
                                                        </div> :
                                                        joiner.joiner_id === user?.id &&
                                                        <button type="button" onClick={() => handleReject(joiner.joiner_id)}>
                                                            <TrashIcon className="icon hover:text-red-400" weight="fill" />
                                                        </button>
                                                }
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    }
                </div>
                {roomStatus?.current_chat_room && <ChatRoom isHost={isOwner} profile={profile} user={user} currentChatRoom={roomStatus.current_chat_room} />}
            </div>
            {modal}
        </div >
    );
}
