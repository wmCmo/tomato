import { setInterval, clearInterval } from 'worker-timers';
import { useEffect, useRef, useState } from 'react';
import TimeButton from "./TimeButton";
import ControlButton from "./ControlButton";
import colorVariants from "../utils/colorVariants";
import useAuth from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
const ticksUrl = new URL(`${import.meta.env.BASE_URL}ticks.ogg`, window.location.origin).toString();
const audio = new Audio(ticksUrl);
audio.preload = 'auto';

const fluentTomato = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Tomato/Color/tomato_color.svg";
const activeSessionIdKey = 'active_session_id';

export default function Clock({ dict, isPixel }) {
    const [status, setStatus] = useState(0);
    const [counting, setCounting] = useState(false);
    const [sec, setSec] = useState(1500);
    const [session, setSession] = useState(JSON.parse(localStorage.getItem('session')) || 1);

    const work = useRef(null);

    const { user } = useAuth();

    useEffect(() => {
        if (window !== undefined) {
            localStorage.setItem('session', session);
        }
    }, [session]);

    useEffect(() => {
        audio.load();
    }, []);

    useEffect(() => {
        if (!user) return;

        const syncSession = async () => {
            const storedDbId = localStorage.getItem(activeSessionIdKey);

            if (!storedDbId) {
                const { data } = await supabase
                    .from('study_sessions')
                    .insert([{
                        user_id: user.id,
                        sessions: session === 1 ? 0 : session
                    }])
                    .select()
                    .single();

                if (data) {
                    localStorage.setItem(activeSessionIdKey, data.id);
                }
            }
        };
        syncSession();
    }, [user]);

    useEffect(() => {
        if (counting) {
            work.current = setInterval(() => setSec(prev => Math.max(0, prev - 1)), 1000);
        }
        return () => {
            if (work.current) {
                clearInterval(work.current);
                work.current = null;
            }
        };
    }, [counting]);

    const setTime = newStatus => {
        setStatus(newStatus);
        setCounting(false);
        if (newStatus === 0) {
            setSec(1500);
        } else if (newStatus === 1) {
            setSec(300);
        } else {
            setSec(900);
        }
    };

    useEffect(() => {
        if (sec === 0) {
            audio.play();
            if ((status === 0) && (session % 2 === 0)) {
                setTime(2);
            } else if (status === 0) {
                setTime(1);
            } else {
                setTime(0);
                setSession(prevSession => prevSession + 1);
            }
            setCounting(true);
        }
    }, [sec, session, status]);

    useEffect(() => {
        const handleKeys = e => {
            if (e.code === 'Space') {
                e.preventDefault();
                setCounting(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeys);

        return () => {
            window.removeEventListener('keydown', handleKeys);
        };
    }, []);

    useEffect(() => {
        if (session === 1 || !user) return;
        const currentId = localStorage.getItem(activeSessionIdKey);
        if (!currentId) return;

        const updateSession = async () => {
            await supabase
                .from('study_sessions')
                .update({ sessions: session - 1 })
                .eq('id', currentId);
        };

        updateSession();
    }, [session]);

    const resetClock = async () => {
        setCounting(false);
        setStatus(0);
        setSec(1500);
        setSession(1);

        if (user) {
            const { data } = await supabase
                .from('study_sessions')
                .insert([{
                    user_id: user.id,
                    sessions: 0
                }])
                .select()
                .single();

            if (data) {
                localStorage.setItem(activeSessionIdKey, data.id);
            }
        }
    };

    const message = !counting ? dict.messages.start : (counting && status === 0 ? dict.messages.work : dict.messages.rest);

    const min = Math.floor(sec / 60);
    const secs = sec % 60;

    const color = colorVariants[status];

    const selectTime = [0, 1, 2].map(choice => <TimeButton name={dict.choices[choice]} onClick={setTime} status={choice} key={choice} color={color} />);
    return (
        <div className={`select-none flex flex-col flex-grow max-w-lg`}>
            <section className="bg-red-300 rounded-xl p-6">
                <a href="https://exzachly.notion.site" target="_blank" rel="noreferrer">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-bold text-white text-center flex items-center gap-1">{dict.nav.header}<img src={isPixel ? `${import.meta.env.BASE_URL}tomato.webp` : fluentTomato} className="w-8 h-auto" /></h1>
                        <p className="text-center text-red-400 bg-red-200 px-4 py-1 mt-2 rounded-lg font-medium">{dict.nav.desc}</p>
                    </div>
                </a>
            </section>
            <main className="mt-4 sm:mt-8">
                <div className={`${color?.[0]} p-8 shadow-md rounded-xl ${color?.[2]}`}>
                    <div className={`${color?.[1]} rounded-lg`}>
                        <h1 className={`text-5xl sm:text-6xl text-center py-5 sm:py-10 font-bold text-white font-display`}>{min < 10 ? "0" + min : min} : {secs < 10 ? "0" + secs : secs}</h1>
                    </div>
                    <div className="flex sm:block justify-between">
                        <div className="flex flex-col flex-grow mr-6 sm:mr-0 sm:px-0 gap-4 mt-8 sm:flex-row sm:justify-between">
                            {selectTime}
                        </div>
                        <div className="grid grid-cols-2 place-items-center gap-6 sm:flex justify-between sm:gap-0">
                            <ControlButton file="reset" btnFunc={resetClock} color={color} />
                            <ControlButton file="backward" btnFunc={() => setTime(status)} color={color} />
                            <ControlButton file={counting ? "pause" : "play"} btnFunc={() => setCounting(prev => !prev)} color={color} />
                            <ControlButton file="forward" btnFunc={() => setSec(0)} color={color} />
                        </div>
                    </div>
                </div>
                <div className="mt-4 sm:mt-6 bg-neutral-300 px-8 py-4 rounded-lg text-[#33270d] drop-shadow-md">
                    <b>{dict.session} {session}</b>: {message}
                </div>
            </main>
        </div>
    );
}
