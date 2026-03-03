'use client';

import { useNavContext } from "@/app/[locale]/main/layout";
import Clock from "@/components/Clock";
import SideClock from "@/components/SideClock";

export default function ClockPage() {
  const { isPixel, timerOn } = useNavContext();
  return (
    <main className="flex flex-col gap-12 lg:flex-row lg:justify-around mt-14 justify-center items-center w-full">
      <Clock isPixel={isPixel} />
      {timerOn && <SideClock />}
    </main>
  );
}
