'use client';

import useAuth from "@/hooks/useAuth";
import { useDict } from "@/hooks/useDict";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
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

const fluentTomato = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Tomato/Color/tomato_color.svg";
const clockStateKey = 'clock_state_v1';
const syncedSessionIDKey = 'active_session_id';

interface ClockState {
    sec: number;
    status: 0 | 1 | 2;
    session: number;
}

function readClockState(): ClockState | null {
    try {
        const raw = localStorage.getItem(clockStateKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) return null;
        const { sec, status, session } = parsed;
        if (typeof sec !== 'number' || !Number.isFinite(sec) || sec < 0) return null;
        if (![0, 1, 2].includes(status)) return null;
        if (typeof session !== 'number' || !Number.isFinite(session) || session < 1) return null;
        return { sec, status, session };
    } catch {
        return null;
    }
}

const statusToSec = [1500, 300, 900];

const defaultClockState: ClockState = {
    sec: statusToSec[0],
    status: 0,
    session: 1
};

const Clock = ({ isPixel }: { isPixel: boolean; }) => {
    const { dict } = useDict();

    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const [clockState, setClockState] = useState(defaultClockState);
    const [counting, setCounting] = useState(false);

    const workerRef = useRef<number | null>(null);
    const clockStateRef = useRef(clockState);

    useEffect(() => {
        clockStateRef.current = clockState;
    }, [clockState]);

    useEffect(() => {
        getAudio();
        const newClockState = readClockState();
        if (newClockState) setClockState(newClockState);
        return () => {
            try {
                localStorage.setItem(clockStateKey, JSON.stringify(clockStateRef.current));
            } catch (error) {
                console.error("Failed to save session:", error);
            }
        };
    }, []);

    const handleSetStatus = useCallback(async (newStatus: 0 | 1 | 2, updateSession = false) => {
        const newSession = updateSession ? clockState.session + 1 : clockState.session;
        setClockState(prev => {
            return {
                ...prev,
                sec: statusToSec[newStatus],
                status: newStatus,
                session: newSession
            };
        });
        if (updateSession && user) {
            if (typeof window === "undefined") return;
            const syncedSessionId = localStorage.getItem(syncedSessionIDKey);
            if (syncedSessionId) {
                const { error } = await supabase
                    .from('study_sessions')
                    .update({ sessions: newSession })
                    .eq('id', syncedSessionId);
                if (!error) {
                    await queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
                    return;
                }
                console.error(error.code, error.message);
                throw error;
            } else {
                const { data, error } = await supabase
                    .from('study_sessions')
                    .insert([{
                        user_id: user.id,
                        sessions: newSession
                    }])
                    .select()
                    .single();
                console.log('Created new record');
                if (data) {
                    if (typeof window !== "undefined") {
                        localStorage.setItem(syncedSessionIDKey, data.id);
                    }
                    await queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
                    return;
                }
                console.error(error);
                throw error;
            }
        }
    }, [user, supabase, clockState.session]);

    useEffect(() => {
        if (clockState.sec !== 0) return;
        getAudio()?.play();
        setCounting(true);
        const syncPromise = clockState.status === 0
            ? handleSetStatus(clockState.session % 2 === 0 ? 2 : 1)
            : handleSetStatus(0, true);

        syncPromise.catch(error => {
            console.error("Background sync failed, but timer is still ticking:", error);
            toast(undefined, dict.error.updateDb, 'errorDb');
        });
    }, [clockState.sec, clockState.status, clockState.session, handleSetStatus]);

    useEffect(() => {
        if (counting) {
            workerRef.current = setInterval(() => {
                setClockState(prev => ({
                    ...prev,
                    sec: Math.max(0, prev.sec - 1)
                }));
            }, 1000);
        }

        return () => {
            if (workerRef.current) {
                clearInterval(workerRef.current);
                workerRef.current = null;
            }
        };
    }, [counting]);

    function resetClock() {
        setCounting(false);
        setClockState(defaultClockState);

        try {
            if (typeof window === "undefined") return;
            localStorage.removeItem(clockStateKey);
            localStorage.removeItem(syncedSessionIDKey);
        } catch {
            //ignore storage errors
        }
    };

    const color = colorVariants[clockState?.status || 0];

    const { s, m } = secToTime(clockState.sec);

    const selectTime = [0, 1, 2].map(choice => <TimeButton name={dict.home.choices[choice]} onClick={handleSetStatus} status={choice as ClockState['status']} key={choice} color={color} />);

    const message = counting ? clockState.status === 0 ? dict.home.messages.work : dict.home.messages.rest : dict.home.messages.start;

    return (
        <div className={`select-none flex flex-col justify-center`}>
            <section className="bg-red-300 rounded-xl p-6">
                <a href="https://exzachly.notion.site" target="_blank" rel="noopener noreferrer">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-bold text-white text-center flex items-center gap-1">{dict.home.nav.header}<img src={isPixel ? `/tomato.webp` : fluentTomato} className="w-8 h-auto" /></h1>
                        <p className="text-center text-red-400 bg-red-200 px-4 py-1 mt-2 rounded-lg font-medium">{dict.home.nav.desc}</p>
                    </div>
                </a>
            </section>
            <main className="mt-4 sm:mt-8">
                <div className={`${color?.[0]} p-8 shadow-md rounded-xl ${color?.[2]}`}>
                    <div className={`${color?.[1]} rounded-lg`}>
                        <h1 className={`text-5xl sm:text-6xl text-center py-5 sm:py-10 font-bold text-white font-display`}>{m.padStart(2, "0")} : {s.padStart(2, "0")}</h1>
                    </div>
                    <div className="flex sm:block justify-between">
                        <div className="flex flex-col grow mr-6 sm:mr-0 sm:px-0 gap-4 mt-8 sm:flex-row sm:justify-between">
                            {selectTime}
                        </div>
                        <div className="grid grid-cols-2 place-items-center gap-6 sm:flex justify-between sm:gap-0">
                            <ControlButton file="reset" btnFunc={resetClock} color={color} />
                            <ControlButton file="backward" btnFunc={() => { handleSetStatus(clockState.status); setCounting(false); }} color={color} />
                            <ControlButton file={counting ? "pause" : "play"} btnFunc={() => setCounting(prev => !prev)} color={color} />
                            <ControlButton file="forward" btnFunc={() => setClockState(prev => ({ ...prev, sec: 0 }))} color={color} />
                        </div>
                    </div>
                </div>
                <div className="mt-4 sm:mt-6 bg-neutral-300 px-8 py-4 rounded-lg text-[#33270d] drop-shadow-md">
                    <b>{dict.home.session} {clockState.session}</b>: {message}
                </div>
            </main>
        </div>
    );
};

export default Clock;
