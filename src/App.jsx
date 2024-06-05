import { useEffect, useState } from "react";
import { setInterval, clearInterval } from 'worker-timers'
import { IconContext, Sun, Moon, Desktop } from "@phosphor-icons/react"
import Navbar from "./components/Navbar";
import TimeButton from "./components/TimeButton";
import ControlButton from "./components/ControlButton";
let audio = new Audio();
audio.src = "ticks.ogg";

const choices = ['Pomodoro', 'Short Break', 'Long Break'];

const colorVariants = [
  ['bg-pink-prim', 'bg-pink-sec', 'shadow-red-300/50', 'hover:bg-red-200'],
  ['bg-yellow-prim', 'bg-yellow-sec', 'shadow-amber-300/50', 'hover:bg-amber-200'],
  ['bg-blue-prim', 'bg-blue-sec', 'shadow-sky-300/50', 'hover:bg-sky-200'],
]

export default function App() {
  const [status, setStatus] = useState(choices[0]);
  const [counting, setCounting] = useState(false);
  const [sec, setSec] = useState(1500)
  const [session, setSession] = useState(1)
  const [theme, setTheme] = useState('system')
  let message;

  useEffect(() => {
    let work;
    if (counting) {
      work = setInterval(() => {
        countdown();
      }, 1000);
    } else if (work !== undefined) {
      clearInterval(work);
    }
    return () => {
      if (work !== undefined) {
        clearInterval(work);
      }
    }
  }, [counting])

  const setTime = newStatus => {
    setStatus(newStatus)
    setCounting(false)
    if (newStatus === choices[0]) {
      setSec(1500);
    } else if (newStatus === choices[1]) {
      setSec(300);
    } else {
      setSec(900);
    }
  }

  const makeMessage = () => {
    if (!counting) {
      message = "Click Start and let's get things done!";
    } else if (counting && status === choices[0]) {
      message = "Time to Work!";
    } else {
      message = "Time to Rest!"
    }
    return message
  }

  const resetClock = () => {
    setCounting(false);
    setStatus(choices[0]);
    setSec(1500);
    setSession(1);
  }

  const countdown = () => {
    setSec(prevSec => prevSec - 1);
  }

  const rewind = () => {
    setTime(status);
  }

  const toggleCountdown = () => {
    setCounting(prevCounting => !prevCounting)
  }

  const skipClock = () => {
    setSec(0);
  }

  const min = Math.floor(sec / 60);
  const secs = sec % 60;

  if (sec === 0) {
    audio.play();
    if ((status === choices[0]) && (session % 2 === 0)) {
      setTime(choices[2]);
    } else if (status === choices[0]) {
      setTime(choices[1]);
    } else {
      setTime(choices[0]);
      setSession(prevSession => prevSession + 1);
    }
    setCounting(true)
  }

  const color = colorVariants[choices.indexOf(status)];

  const selectTime = choices.map(choice => {
    return (
      <TimeButton name={choice} onClick={setTime} key={choice} color={color} />
    )
  })

  const changeTheme = (value) => {
    setTheme(() => value);
  }

  return (
    <div className={`relative h-screen flex justify-center items-center p-4 sm:p-8 font-display ${theme === 'light' ? 'bg-neutral-50' : theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50 dark:bg-neutral-900'}`}>
      <div className={`hidden absolute top-4 right-6 rounded-full sm:flex gap-4 p-2 ${theme === 'light' ? 'bg-neutral-200' : theme === 'dark' ? 'bg-neutral-800' : theme === 'light' ? 'dark:bg-neutral-200 bg-neutral-800 ' : 'bg-neutral-200 dark:bg-neutral-800'} transition-colors duration-200 ease-in-out`}>
        <IconContext.Provider value={{
          size: 20,
          weight: 'fill'
        }}>
          <Sun className={`hover:cursor-pointer transition-all ease-in-out duration-200 ${theme === 'light' ? 'fill-neutral-700' : theme === 'dark' ? 'fill-neutral-700 hover:fill-neutral-600' : 'fill-neutral-400 dark:fill-neutral-700 hover:fill-neutral-500 dark:hover:fill-neutral-600'}`} onClick={() => { changeTheme('light') }} />
          <Moon className={`hover:cursor-pointer transition-all ease-in-out duration-200 ${theme === 'dark' ? 'fill-neutral-400' : theme === 'system' ? 'fill-neutral-400 dark:fill-neutral-700 hover:fill-neutral-500 dark:hover:fill-neutral-600' : 'fill-neutral-400 hover:fill-neutral-500'}`} onClick={() => { changeTheme('dark') }} />
          <Desktop className={`hover:cursor-pointer transition-all ease-in-out duration-200 ${theme === 'system' ? 'fill-neutral-700 dark:fill-neutral-400' : theme === 'light' ? 'fill-neutral-400 hover:fill-neutral-500' : 'fill-neutral-700 hover:fill-neutral-600'}`} onClick={() => { changeTheme('system') }} />
        </IconContext.Provider>
      </div>
      <div className="flex flex-col flex-grow max-w-lg w-6/12">
        <Navbar />
        <main className="mt-4 sm:mt-8">
          <div className={`${color[0]} p-8 shadow-md sm:shadow-lg rounded-lg ${color[2]}`}>
            <div className={`${color[1]} rounded-lg`}>
              <h1 className={`text-5xl sm:text-6xl text-center py-5 sm:py-10 font-bold text-white`}>{min < 10 ? "0" + min : min} : {secs < 10 ? "0" + secs : secs}</h1>
            </div>
            <div className="flex sm:block justify-between">
              <div className="flex flex-col flex-grow mr-6 sm:mr-0 sm:px-0 gap-4 mt-8 sm:flex-row sm:justify-between">
                {selectTime}
              </div>
              <div className="grid grid-cols-2 place-items-center gap-6 sm:flex justify-between sm:gap-0">
                <ControlButton file="reset" btnFunc={resetClock} color={color} />
                <ControlButton file="backward" btnFunc={rewind} color={color} />
                <ControlButton file={counting ? "pause" : "play"} btnFunc={toggleCountdown} color={color} />
                <ControlButton file="forward" btnFunc={skipClock} color={color} />
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-8 bg-neutral-300 px-8 py-4 rounded-lg text-neutral-700 drop-shadow-md">
            <b>Session {session}</b>: {makeMessage()}
          </div>
        </main>
      </div>
    </div>
  )
}
