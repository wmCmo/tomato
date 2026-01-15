import { useEffect, useRef, useState } from "react";
import { setInterval, clearInterval } from 'worker-timers';
import { IconContext, Sun, Moon, Desktop, Translate, WindowsLogo } from "@phosphor-icons/react";
import Navbar from "./components/Navbar";
import TimeButton from "./components/TimeButton";
import ControlButton from "./components/ControlButton";
import en from "./dictionary/en";
import ja from "./dictionary/ja";
let audio = new Audio();
audio.src = "ticks.ogg";

const dictionary = {
  en, ja
};

const colorVariants = [
  ['bg-pink-prim', 'bg-pink-sec', 'shadow-red-300/50', 'hover:bg-red-200'],
  ['bg-yellow-prim', 'bg-yellow-sec', 'shadow-amber-300/50', 'hover:bg-amber-200'],
  ['bg-blue-prim', 'bg-blue-sec', 'shadow-sky-300/50', 'hover:bg-sky-200'],
];

export default function App() {
  const [lang, setLang] = useState('en');
  const dict = dictionary[lang];
  const [status, setStatus] = useState(0);
  const [counting, setCounting] = useState(false);
  const [sec, setSec] = useState(1500);
  const [session, setSession] = useState(1);
  const [theme, setTheme] = useState('system');

  const work = useRef(null);

  useEffect(() => {
    if (counting) {
      work.current = setInterval(() => setSec(prev => prev - 1), 1000);
    }
    return () => {
      if (work.current) {
        clearInterval(work.current);
        work.current = null;
      }
    };
  }, [counting]);

  const setTime = newStatus => {
    setStatus(newStatus);
    setCounting(false);
    if (newStatus === 0) {
      setSec(1500);
    } else if (newStatus === 1) {
      setSec(300);
    } else {
      setSec(900);
    }
  };

  const message = !counting ? dict.messages.start : (counting && status === 0 ? dict.messages.work : dict.messages.rest);

  const resetClock = () => {
    setCounting(false);
    setStatus(0);
    setSec(1500);
    setSession(1);
  };

  const min = Math.floor(sec / 60);
  const secs = sec % 60;

  useEffect(() => {
    if (sec === 0) {
      audio.play();
      if ((status === 0) && (session % 2 === 0)) {
        setTime(2);
      } else if (status === 0) {
        setTime(1);
      } else {
        setTime(0);
        setSession(prevSession => prevSession + 1);
      }
      setCounting(true);
    }
  }, [sec]);

  useEffect(() => {
    const handleKeys = e => {
      const code = e.code;
      switch (code) {
        case 'Space':
          setCounting(prev => !prev);
          break;
        case 'KeyT':
          setTheme(prev => prev === 'light' ? 'dark' : 'light');
          break;
        case 'KeyL':
          setLang(prev => prev === 'en' ? 'ja' : 'en');
          break;
      }
    };
    window.addEventListener('keydown', handleKeys);

    return () => {
      window.removeEventListener('keydown', handleKeys);
    };
  }, []);

  const color = colorVariants[status];

  const selectTime = [0, 1, 2].map(choice => <TimeButton name={dict.choices[choice]} onClick={setTime} status={choice} key={choice} color={color} />);

  return (
    <div className={`relative h-screen flex justify-center items-center p-4 sm:p-8 ${lang === 'en' ? 'font-display' : 'font-zenMaru'} ${theme === 'light' ? 'bg-neutral-50' : theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50 dark:bg-neutral-900'}`}>
      <div className={`p-2 absolute cursor-pointer top-4 left-6 rounded-md ${theme === 'light' ? 'bg-neutral-200' : theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-00 dark:bg-neutral-800'}`}>
        <Translate onClick={() => setLang(prev => prev === 'en' ? 'ja' : 'en')} className={theme === 'light' ? 'fill-neutral-700' : theme === 'dark' ? 'fill-neutral-400' : 'fill-neutral-700 dark:fill-neutral-400'} weight={'bold'} />
      </div>
      <div className={`absolute top-4 right-6 rounded-full flex items-center gap-4 p-2 ${theme === 'light' ? 'bg-neutral-200' : theme === 'dark' ? 'bg-neutral-800' : theme === 'light' ? 'dark:bg-neutral-200 bg-neutral-800 ' : 'bg-neutral-200 dark:bg-neutral-800'} transition-colors duration-200 ease-in-out`}>
        <IconContext.Provider value={{
          size: 20,
          weight: 'fill'
        }}>
          <Sun className={`hover:cursor-pointer transition-all ease-in-out duration-200 ${theme === 'light' ? 'fill-neutral-700' : theme === 'dark' ? 'fill-neutral-700 hover:fill-neutral-600' : 'fill-neutral-400 dark:fill-neutral-700 hover:fill-neutral-500 dark:hover:fill-neutral-600'}`} onClick={() => { setTheme('light'); }} />
          <Moon className={`hover:cursor-pointer transition-all ease-in-out duration-200 ${theme === 'dark' ? 'fill-neutral-400' : theme === 'system' ? 'fill-neutral-400 dark:fill-neutral-700 hover:fill-neutral-500 dark:hover:fill-neutral-600' : 'fill-neutral-400 hover:fill-neutral-500'}`} onClick={() => { setTheme('dark'); }} />
          <Desktop className={`hover:cursor-pointer transition-all ease-in-out duration-200 ${theme === 'system' ? 'fill-neutral-700 dark:fill-neutral-400' : theme === 'light' ? 'fill-neutral-400 hover:fill-neutral-500' : 'fill-neutral-700 hover:fill-neutral-600'}`} onClick={() => { setTheme('system'); }} />
        </IconContext.Provider>
      </div>
      <div className="flex flex-col flex-grow max-w-lg w-6/12">
        <Navbar dict={dict} />
        <main className="mt-4 sm:mt-8">
          <div className={`${color?.[0]} p-8 shadow-md rounded-lg ${color?.[2]}`}>
            <div className={`${color?.[1]} rounded-lg`}>
              <h1 className={`text-5xl sm:text-6xl text-center py-5 sm:py-10 font-bold text-white font-display`}>{min < 10 ? "0" + min : min} : {secs < 10 ? "0" + secs : secs}</h1>
            </div>
            <div className="flex sm:block justify-between">
              <div className="flex flex-col flex-grow mr-6 sm:mr-0 sm:px-0 gap-4 mt-8 sm:flex-row sm:justify-between">
                {selectTime}
              </div>
              <div className="grid grid-cols-2 place-items-center gap-6 sm:flex justify-between sm:gap-0">
                <ControlButton file="reset" btnFunc={resetClock} color={color} />
                <ControlButton file="backward" btnFunc={() => setTime(status)} color={color} />
                <ControlButton file={counting ? "pause" : "play"} btnFunc={() => setCounting(prev => !prev)} color={color} />
                <ControlButton file="forward" btnFunc={() => setSec(0)} color={color} />
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-8 bg-neutral-300 px-8 py-4 rounded-lg text-neutral-700 drop-shadow-md">
            <b>{dict.session} {session}</b>: {message}
          </div>
        </main>
      </div>
    </div>
  );
}
