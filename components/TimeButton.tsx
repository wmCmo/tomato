'use client';

import ClockState from "@/types/ClockState";
import { Dispatch, SetStateAction } from "react";

const TimeButton = ({ color, onClick, status, name, setClockState }: { color: string[]; onClick: (newStatus: 0 | 1 | 2, updateSession?: boolean) => Promise<void>; status: 0 | 1 | 2; name: string; setClockState: Dispatch<SetStateAction<ClockState>>; }) => {
    return (
        <button type="button" className={`${color?.[1]} text-white rounded-lg px-4 py-2 sm:py-4 font-semibold ${color?.[3]}`} onClick={() => { onClick(status); setClockState(prev => ({ ...prev, counting: false })); }}>{name}</button>
    );
};

export default TimeButton;
