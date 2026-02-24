import { useOutletContext } from "react-router";
import SideClock from "../components/SideClock.jsx";
import Clock from "../components/Clock";

export default function ClockPage() {
  const { timerOn } = useOutletContext();
  return (
    <main className="flex flex-col gap-12 lg:flex-row lg:justify-around mt-14 justify-center items-center w-full">
      <Clock />
      {timerOn && <SideClock />}
    </main>
  );
}
