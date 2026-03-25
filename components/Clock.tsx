'use client';

import RoomSkeleton from "@/components/ui/RoomSkeleton";
import useAuth from "@/hooks/useAuth";
import useDict from "@/hooks/useDict";
import useToast from "@/hooks/useToast";
import { supabase } from "@/lib/supabase";
import ClockState, { StatusType } from "@/types/ClockState";
import RoomStatusType from "@/types/RoomStatus";
import getEndsAt from "@/utils/getEndsAt";
import roomStatusToClockState from "@/utils/roomStatusToClockState";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { clearInterval, setInterval } from "worker-timers";
import colorVariants from "../utils/colorVariants";
import secToTime from "../utils/secToTime";
import ControlButton from "./ControlButton";
import TimeButton from "./TimeButton";

let audio: HTMLAudioElement | null = null;

function getAudio() {
    if (!audio && typeof window !== 'undefined') {
        audio = new Audio('/ticks.ogg');
        audio.preload = 'auto';
    }
    return audio;
}

export const fluentTomato = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Tomato/Color/tomato_color.svg";

export const statusToSec = [1500, 300, 900];

export const defaultClockState: ClockState = {
    sec: statusToSec[0],
    status: 0,
    session: 1,
    counting: false,
    current_session: null
};

const Clock = ({
    isPixel = true,
    owner = "Zach",
    isHost = true,
    roomStatus,
    isMarathon,
    myRoom,
    myRoomLoading,
}: {
    isPixel?: boolean;
    owner?: string;
    roomStatus?: RoomStatusType | null | undefined;
    myRoom?: RoomStatusType | null | undefined;
    myRoomLoading: boolean;
    isHost?: boolean;
    isMarathon: boolean;
}) => {
    const { dict } = useDict();
    const { toast } = useToast();

    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [clockState, setClockState] = useState(() => roomStatusToClockState(myRoom, roomStatus, isHost));

    const workerRef = useRef<number | null>(null);
    const clockStateRef = useRef(clockState);

    useEffect(() => {
        getAudio();
    }, []);

    useEffect(() => {
        clockStateRef.current = clockState;
    }, [clockState]);

    const broadcastStatus = useCallback(async (endsAt: string, status: StatusType, counting: boolean) => {
        if (!user?.id || !isHost) return;
        console.log('Start broadcasting');
        const lastEdited = new Date();
        const { error } = await supabase
            .from('room_status')
            .upsert([{
                id: user.id,
                isPlaying: counting,
                status,
                ends_at: endsAt,
                last_edited: lastEdited
            }], {
                onConflict: 'id'
            });

        if (error) {
            toast(undefined, dict.error.updateDb, "errorDb");
            console.error(error.code, error.message);
            return;
        }

        queryClient.setQueryData(["roomStatus", user.id], (old: RoomStatusType) => {
            if (!old) return old;
            return { ...old, isPlaying: counting, status, ends_at: endsAt, last_edited: lastEdited };
        });

    }, [user?.id, isHost, queryClient, toast, dict.error.updateDb]);

    const handleSetStatus = useCallback(async (newStatus: StatusType, updateSession = false, continueTimer = false, clearSec = true) => {
        const newSec = clearSec ? statusToSec[newStatus] : clockStateRef.current.sec;
        const newClockState: ClockState = {
            ...clockStateRef.current,
            session: updateSession ? clockState.session + 1 : clockState.session,
            sec: newSec,
            counting: continueTimer,
            status: newStatus
        };
        if (user?.id) {
            if (updateSession) {
                if (myRoom?.current_session) {
                    const { error } = await supabase
                        .from('study_sessions')
                        .update({ sessions: newClockState.session })
                        .eq('id', myRoom.current_session);
                    if (error) {
                        console.error(error.code, error.message);
                        throw error;
                    }
                } else {
                    let data, err;
                    ({ data, error: err } = await supabase
                        .from('study_sessions')
                        .insert([{
                            user_id: user.id,
                            sessions: newClockState.session
                        }])
                        .select()
                        .single());
                    console.log('Created new record');
                    if (data) {
                        setClockState(prev => ({
                            ...prev,
                            current_session: data.id
                        }));
                        (
                            { error: err } = await supabase
                                .from("room_status")
                                .update({ current_session: data.id })
                                .eq("id", user.id)
                        );
                        queryClient.setQueryData(["roomStatus", user.id], (old: RoomStatusType) => {
                            if (!old) return old;
                            return { ...old, current_session: data.id };
                        });
                    }
                    if (err) {
                        console.error(err);
                        throw err;
                    }
                }
            }

            queryClient.setQueryData(["roomStatus", user.id], (old: RoomStatusType) => {
                if (!old) return old;
                return { ...old, status: newStatus, session: { sessions: newClockState.session }, isPlaying: continueTimer };
            });
            queryClient.invalidateQueries({ queryKey: ["profile", user.id] });

            broadcastStatus(getEndsAt(newSec), newStatus, continueTimer);
        } else {
            setClockState(newClockState);
        }
    }, [clockState.session, user?.id, myRoom?.current_session, queryClient]);

    useEffect(() => {
        if (!isMarathon) return;
        handleSetStatus(0, false, clockStateRef.current.counting, false);
    }, [isMarathon, handleSetStatus]);

    useEffect(() => {
        if (isHost) return;

        const channel = supabase
            .channel(`study_sessions:${roomStatus?.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "study_sessions",
                    filter: `user_id=eq.${roomStatus?.id}`
                },
                (payLoad) => {
                    console.log('syncing with host', payLoad);
                    handleSetStatus(clockState.status, true, clockState.counting);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "study_sessions",
                    filter: `user_id=eq.${roomStatus?.id}`
                },
                (payload) => {
                    console.log('syncing with host', payload);
                    handleSetStatus(clockState.status, true, clockState.counting);
                }
            )
            .subscribe();

        return () => {
            void supabase.removeChannel(channel);
        };
    }, [isHost, roomStatus?.id, clockState.status, clockState.counting, handleSetStatus]);

    useEffect(() => {
        const newState = roomStatusToClockState(myRoom, roomStatus, isHost);
        if (clockStateRef.current === newState) return;
        clockStateRef.current = newState;
        setClockState(newState);
    }, [roomStatus, myRoom, isHost]);

    useEffect(() => {
        return () => {
            try {
                broadcastStatus(getEndsAt(clockStateRef.current.sec), clockStateRef.current.status, clockStateRef.current.counting);
            } catch (error) {
                console.error("Failed to save session:", error);
            }
        };
    }, [broadcastStatus]);

    useEffect(() => {
        if (clockState.sec !== 0) return;
        getAudio()?.play();
        setClockState(prev => ({
            ...prev,
            counting: true
        }));
        if (!isHost) return;
        const syncPromise = isMarathon ?
            handleSetStatus(0, true, true) :
            clockState.status === 0
                ? handleSetStatus(clockState.session % 2 === 0 ? 2 : 1, false, true)
                : handleSetStatus(0, true, true);

        syncPromise.catch(error => {
            console.error("Background sync failed, but timer is still ticking:", error);
            toast(undefined, dict.error.updateDb, 'errorDb');
        });
    }, [clockState.sec, clockState.status, clockState.session, handleSetStatus, dict.error.updateDb, toast]);

    useEffect(() => {
        if (clockState.counting) {
            workerRef.current = setInterval(() => {
                setClockState(prev => ({
                    ...prev,
                    sec: Math.max(0, prev.sec - 1)
                }));
            }, 1000);
        } else {
            if (workerRef.current) {
                clearInterval(workerRef.current);
                workerRef.current = null;
            }
        }

        return () => {
            if (workerRef.current) {
                clearInterval(workerRef.current);
                workerRef.current = null;
            }
        };
    }, [clockState.counting]);

    async function resetClock() {
        setClockState(defaultClockState);
        if (!user?.id) return;
        const payLoad = {
            current_session: null,
            ends_at: getEndsAt(statusToSec[0]),
            status: 0,
            last_edited: new Date(),
            isPlaying: false,
        };
        const { error } = await supabase
            .from("room_status")
            .update(payLoad)
            .eq("id", user.id);
        if (error) {
            toast(undefined, dict.error.updateDb, "errorDb");
            console.error(error);
            return;
        }
        queryClient.setQueryData(["roomStatus", user?.id], (old: RoomStatusType) => {
            if (!old) return old;
            return { ...old, ...payLoad, session: { sessions: 1 } };
        });
    };

    if (!isHost && myRoomLoading) return <RoomSkeleton />;

    const color = colorVariants[clockState.status];

    const { s, m } = secToTime(clockState.sec);

    const selectTime = [0, 1, 2].map(choice => <TimeButton name={dict.home.choices[choice]} setClockState={setClockState} onClick={handleSetStatus} status={choice as ClockState['status']} key={choice} color={color} />);

    const message = clockState.counting ? clockState.status === 0 ? dict.home.messages.work : dict.home.messages.rest : dict.home.messages.start;

    return (
        <div className={`select-none flex flex-col justify-center items-center`}>
            <section className="bg-red-300 rounded-xl p-6 w-full">
                <a href="https://exzachly.notion.site" target="_blank" rel="noopener noreferrer">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-bold text-white text-center flex items-center gap-1">{owner}{dict.home.nav.header}<Image src={isPixel ? `/tomato.webp` : fluentTomato} alt="Fluent tomato emoji" height={32} width={32} /></h1>
                        <p className="text-center text-red-400 bg-red-200 px-4 py-1 mt-2 rounded-lg font-medium">{dict.home.nav.desc}</p>
                    </div>
                </a>
            </section>
            <main className="mt-4 sm:mt-8 max-w-lg w-full">
                <div className={`${color[0]} p-8 shadow-md rounded-xl ${color[2]}`}>
                    <div className={`${color[1]} rounded-lg`}>
                        <h1 className={`text-5xl sm:text-6xl text-center py-5 sm:py-10 font-bold text-white font-display`}>{m.padStart(2, "0")} : {s.padStart(2, "0")}</h1>
                    </div>
                    {isHost &&
                        <div className={`${!isMarathon && 'flex'} sm:block justify-between`}>
                            {!isMarathon && <div className="flex flex-col grow mr-6 sm:mr-0 sm:px-0 gap-4 mt-8 sm:flex-row sm:justify-between">
                                {selectTime}
                            </div>}
                            <div className="grid grid-cols-2 place-items-center gap-6 sm:flex justify-between sm:gap-0">
                                <ControlButton file="reset" btnFunc={resetClock} color={color} />
                                <ControlButton file="backward" btnFunc={() => { handleSetStatus(clockState.status); setClockState(prev => ({ ...prev, counting: false })); }} color={color} />
                                <ControlButton file={clockState.counting ? "pause" : "play"} btnFunc={() => {
                                    const newCounting = !clockStateRef.current.counting;
                                    const newClockState = {
                                        ...clockStateRef.current,
                                        counting: newCounting,
                                    };
                                    setClockState(newClockState);
                                    broadcastStatus(getEndsAt(clockStateRef.current.sec), newClockState.status, newClockState.counting);
                                }} color={color} />
                                <ControlButton file="forward" btnFunc={() => setClockState(prev => ({ ...prev, sec: 0 }))} color={color} />
                            </div>
                        </div>
                    }
                </div>
                <div className="mt-4 sm:mt-6 bg-neutral-300 px-8 py-4 rounded-lg text-[#33270d] drop-shadow-md">
                    <b>{dict.home.session} {clockState.session}</b>: {message}
                </div>
            </main>
        </div>
    );
};

export default Clock;
