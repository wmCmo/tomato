import { useOutletContext } from "react-router";
import Clock from "../components/Clock.jsx";
import Timer from "../components/Timer.jsx";

export default function ClockPage() {
  const { dict, timerOn } = useOutletContext();
  return (
    <main className="flex flex-col lg:flex-row lg:gap-20 mt-14 justify-center items-center w-full">
      <Clock dict={dict} />
      {timerOn && <Timer />}
    </main>
  );
}
