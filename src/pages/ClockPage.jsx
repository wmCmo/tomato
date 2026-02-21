import { useOutletContext } from "react-router";
import Clock from "../components/Clock.jsx";
import SideClock from "../components/SideClock.jsx";

export default function ClockPage() {
  const { timerOn } = useOutletContext();
  return (
    <main className="flex flex-col gap-12 lg:flex-row lg:justify-around mt-14 justify-center items-center w-full">
      <Clock />
      {timerOn && <SideClock />}
    </main>
  );
}
