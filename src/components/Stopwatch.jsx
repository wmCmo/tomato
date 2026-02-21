import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import { clearInterval, setInterval } from "worker-timers";
import secToTime from "../utils/secToTime";

export default function Stopwatch() {
    const [laps, setLaps] = useState([]);
    const [sec, setSec] = useState(0);
    const [counting, setCounting] = useState(false);
    const worker = useRef(null);

    const { h, m, s } = secToTime(sec);
    const { dict } = useOutletContext();

    useEffect(() => {
        if (counting) {
            if (worker.current) {
                clearInterval(worker.current);
                worker.current = null;
            }
            worker.current = setInterval(() => {
                setSec(prev => prev + 1);
            }, 1000);
        } else {
            if (worker.current) {
                clearInterval(worker.current);
                worker.current = null;
            }
        }

        return () => {
            if (worker.current) {
                clearInterval(worker.current);
                worker.current = null;
            }
        };

    }, [counting]);

    function handleLaps() {
        setLaps(prev => {
            const lastTotal = prev.length > 0 ? prev[0].total : 0;
            return [{ id: Date.now(), lap: sec - lastTotal, total: sec }, ...prev];
        });
    }

    function handleReset() {
        setCounting(false);
        setLaps([]);
        setSec(0);
    }

    const minMaxIndex = useMemo(() => {
        if (laps.length < 2) return { minIndex: -1, maxIndex: -1 };

        const lapsList = laps.map(lap => lap.lap);
        const minIndex = lapsList.indexOf(Math.min(...lapsList));
        const maxIndex = lapsList.indexOf(Math.max(...lapsList));
        return { minIndex, maxIndex };
    }, [laps]);


    return (
        <div className="select-none text-accent mt-8 sm:min-w-[424px] flex flex-col flex-grow min-w-80 max-w-md justify-center transition-all duration-400 ease-in-out w-full py-8 px-6 bg-foreground shadow-md rounded-xl gap-8">
            <div className={`rounded-lg bg-background px-8 sm:px-4`}>
                <h1 className={`font-display text-4xl sm:text-6xl py-5 sm:py-10 font-bold flex gap-1 justify-center text-center`}>
                    {h} : {m} : {s}
                </h1>
            </div>
            <div className="select-none flex flex-grow gap-4 justify-center">
                <button type="button" onClick={counting ? handleLaps : handleReset} disabled={sec === 0} className={`bg-background px-4 py-2 rounded-full min-w-24 ${sec === 0 ? 'opacity-50' : 'active:scale-90 active:opacity-80'}`}>{counting ? dict.stopwatch.lap : dict.stopwatch.reset}</button>
                <button type="button" onClick={() => setCounting(prev => !prev)} className={`bg-background px-4 py-2 rounded-full min-w-24 active:scale-90 active:opacity-80 ${counting ? 'bg-rose-400' : 'bg-blue-500'} text-white`}>{counting ? dict.stopwatch.pause : sec === 0 ? dict.stopwatch.start : dict.stopwatch.resume}</button>
            </div>
            {
                laps.length > 0 &&
                <div className="space-y-4 max-h-48 overflow-y-scroll scrollbar-muted">
                    <div className="sticky top-0 bg-foreground space-y-4">
                        <div className="text-sm grid grid-cols-3 text-center gap-4 text-muted-foreground">
                            <span>{dict.stopwatch?.table?.lapNo ?? "Lap"}</span><span>{dict.stopwatch?.table?.lapTime ?? "Lap Time"}</span><span>{dict.stopwatch?.table?.split ?? "Split"}</span>
                        </div>
                        <hr className="border-border" />
                    </div>
                    {laps.map((lap, index) => {
                        const lapTime = secToTime(lap.lap);
                        const totalTime = secToTime(lap.total);
                        return (
                            <div key={lap.id} className="grid grid-cols-3 gap-4">
                                <span className="text-center">{String(laps.length - index).padStart(2, '0')}</span><span className={`text-center ${index === minMaxIndex.minIndex ? 'text-rose-500' : index === minMaxIndex.maxIndex ? 'text-blue-500' : ''}`}>{lapTime.h}:{lapTime.m}:{lapTime.s}</span><span className="text-center">{totalTime.h}:{totalTime.m}:{totalTime.s}</span>
                            </div>
                        );
                    })}
                </div>
            }
        </div>
    );
}
