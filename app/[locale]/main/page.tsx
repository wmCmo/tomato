'use client';

import Clock from "@/components/Clock";
import SideClock from "@/components/SideClock";
import { useNavContext } from "@/hooks/useNavContext";

export default function ClockPage() {
  const { isPixel, timerOn } = useNavContext();
  return (
    <main className={`grow flex flex-col gap-12 lg:gap-0 lg:flex-row lg:justify-around justify-center items-center px-4 ${timerOn && 'py-12 lg:py-0'}`}>
      <Clock isPixel={isPixel} />
      {timerOn && <SideClock />}
    </main>
  );
}
