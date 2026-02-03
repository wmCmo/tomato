import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeProviderContext } from "../providers/theme-providers";
import TimerDefault from "./timerDefault";
import DisplayInput from "./DisplayInput";
import { IconContext, ArrowCounterClockwise, Pause, Play, TrashSimple } from "@phosphor-icons/react";
import { clearInterval, setInterval } from "worker-timers";
const ticksUrl = new URL(`${import.meta.env.BASE_URL}beat.mp3`, window.location.origin).toString();
const audio = new Audio(ticksUrl);
audio.preload = 'auto';

export default function Timer() {
    const defaultKey = 'defaults';
    const DEFAULTS = [
        [0, 30, 0],
        [1, 0, 0],
        [0, 45, 0],
    ];
    const { theme } = useContext(ThemeProviderContext);
    const [activeClock, setActiveClock] = useState(0);
    const [defaults, setDefaults] = useState(() => {
        const raw = localStorage.getItem(defaultKey);
        return raw ? JSON.parse(raw) : DEFAULTS;
    });
    const [playing, setPlaying] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const worker = useRef(null);

    useEffect(() => {
        audio.load();
    }, []);

    const currentTime = defaults[activeClock];

    const toSeconds = ([h, m, s]) => (Number(h) * 60 * 60) + (Number(m) * 60) + Number(s);
    const toFormat = s => [Math.floor(Number(s) / 60 / 60), Math.floor(Number(s) / 60) % 60, Number(s) % 60];

    const [secs, setSecs] = useState(() => toSeconds(currentTime));

    const clear = () => {
        setPlaying(false);
        if (worker.current) clearInterval(worker.current);
        worker.current = null;
    };

    useEffect(() => {
        localStorage.setItem(defaultKey, JSON.stringify(defaults));
        setSecs(toSeconds(currentTime));
        clear();
    }, [defaults]);

    useEffect(() => {
        setSecs(toSeconds(currentTime));
        clear();
    }, [currentTime]);

    useEffect(() => {
        if (!playing) return;
        if (secs < 1 && playing) {
            if (worker.current) clearInterval(worker.current);
            worker.current = null;
            audio.play();
            setPlaying(false);
        }
        if (!worker.current) {
            setStartTime(new Date());
            worker.current = setInterval(() => {
                setSecs(prev => prev - 1);
            }, 1000);
        } else {
            clearInterval(worker.current);
            worker.current = null;
        }

        return () => {
            if (worker.current) {
                clearInterval(worker.current);
                worker.current = null;
            }
        };
    }, [playing]);

    useEffect(() => {
        if (secs < 1) {
            clearInterval(worker.current);
            worker.current = null;
            if (playing) audio.play();
            setPlaying(false);
        }
    }, [secs]);

    const ControlButtons = ({ icon, handleClick }) => {
        return <button onClick={handleClick} className="bg-foreground p-4 rounded-full cursor-pointer hover:text-accent transition-colors ease-in-out duration-200">{icon}</button>;
    };
    const progressBarWidth = secs / toSeconds(currentTime) * 100;
    return (
        <div className="font-display mt-12 flex flex-col flex-grow min-w-80 max-w-md justify-center transition-all duration-400 ease-in-out w-full">
            <div className={`py-8 px-6 shadow-md rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-neutral-950'}`}>
                <div className="w-full bg-foreground h-2 mb-8 rounded-full flex items-center">
                    <div style={{ width: `${progressBarWidth}%` }} className="h-4 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-400 ease-in-out"></div>
                </div>
                <div className={`rounded-lg bg-foreground px-3`}>
                    <h1 className={`text-4xl sm:text-6xl py-5 sm:py-10 font-bold text-accent flex gap-1 justify-center`}>
                        {(toFormat(secs)).map((value, index) => (
                            <React.Fragment key={index}>
                                <DisplayInput digitValue={value} setDefaults={(param) => setDefaults(prev => {
                                    const newDefault = [...prev];
                                    newDefault[activeClock][index] = param;
                                    return newDefault;
                                })} />
                                {index < currentTime.length - 1 && <span>:</span>}
                            </React.Fragment>
                        ))}
                    </h1>
                </div>
                <div className="flex sm:flex-col justify-between mt-6 gap-8">
                    <div className="select-none flex flex-col flex-grow sm:px-0 gap-4 sm:flex-row sm:justify-between font-display">
                        {defaults.map((def, index) => {
                            return <TimerDefault hour={def[0]} min={def[1]} sec={def[2]} key={index} isActive={index === activeClock} setActiveClock={() => setActiveClock(index)} />;
                        })}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="gap-6 flex items-center text-muted-foreground">
                            <IconContext.Provider value={{
                                size: 25,
                                weight: "fill"
                            }}>
                                <ControlButtons icon={playing ? <TrashSimple /> : <ArrowCounterClockwise />} handleClick={() => {
                                    setSecs(() => toSeconds(currentTime));
                                    clear();
                                }} />
                                <ControlButtons icon={playing ? <Pause /> : <Play />} handleClick={() => setPlaying(prev => !prev)} />
                            </IconContext.Provider>
                        </div>
                        {playing && <div className={`bg-rose-400/40 px-2 py-2 rounded-lg border-4 border-rose-400 border-solid ${theme === 'light' ? 'text-rose-500' : 'text-white'} font-bold`}>🔔 {(new Date(new Date(startTime).getTime() + (toSeconds(currentTime) * 1000))).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false })}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
