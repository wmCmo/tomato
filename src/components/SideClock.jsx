import { useState } from "react";
import Timer from "./Timer";
import Stopwatch from "./Stopwatch";
import { useOutletContext } from "react-router";

export default function SideClock() {
    const { dict, lang } = useOutletContext();
    const [isStopWatch, setIsStopWatch] = useState(true);

    return (
        <div className="flex flex-col items-center font-bold">
            <div className="flex relative bg-foreground items-center justify-between px-3 py-2.5 text-sm rounded-full">
                <div
                    className={`absolute top-2.5 bottom-2.5 bg-background shadow-sm rounded-full ${isStopWatch ? 'animate-stretch-left' : 'animate-stretch-right'}`}
                />
                <button className="z-10" onClick={() => setIsStopWatch(true)}>
                    <div className={`${lang === 'en' ? 'px-8' : 'px-5'} py-2 z-10 min-w-28 text-center ${isStopWatch ? 'text-accent' : 'text-muted-foreground'} transition-all duration-200 ease-out`}>{dict.stopwatch.select.stopwatch}</div>
                </button>
                <button className="z-10" onClick={() => setIsStopWatch(false)}>
                    <div className={`px-5 py-2 z-10 min-w-28 text-center ${isStopWatch ? 'text-muted-foreground' : 'text-accent'} transition-all duration-200 ease-out`}>{dict.stopwatch.select.timer}</div>
                </button>
            </div>
            {isStopWatch ? <Stopwatch /> : <Timer />}
        </div>
    );
}
