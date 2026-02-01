import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { IconContext, Sun, Moon, Desktop, Translate, House, Timer, UserCircle, SquaresFour } from "@phosphor-icons/react";
import en from "./dictionary/en";
import ja from "./dictionary/ja";
import { useTheme } from "./hooks/use-theme";

const dictionary = {
  en, ja
};

export default function App() {
  const [lang, setLang] = useState('en');
  const { theme, setTheme, toggleTheme } = useTheme();
  const [timerOn, setTimerOn] = useState(false);
  const [isPixel, setIsPixel] = useState(JSON.parse(localStorage.getItem('isPixel') || 'false'));

  const dict = dictionary[lang];

  useEffect(() => {
    const handleKeys = e => {
      const code = e.code;
      switch (code) {
        case 'KeyT':
          toggleTheme();
          break;
        case 'KeyL':
          setLang(prev => prev === 'en' ? 'ja' : 'en');
          break;
        case 'KeyP':
          setIsPixel(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeys);

    return () => {
      window.removeEventListener('keydown', handleKeys);
    };
  }, []);

  const navFunc = isActive => {
    return `${isActive ? 'text-accent' : 'text-muted hover:text-muted-foreground'} transition-`;
  };

  useEffect(() => {
    localStorage.setItem('isPixel', JSON.stringify(isPixel));
  }, [isPixel]);

  const navAnimate = 'transition-all ease-in-out duration-200';
  return (
    <div className={`relative min-h-screen flex justify-center items-center p-4 sm:p-8 ${lang === 'en' ? (isPixel ? 'font-pixel' : 'font-display') : 'font-zenMaru'} bg-background ${navAnimate}`}>
      <div className="fixed top-6 w-full px-4 sm:px-8 items-center grid grid-cols-[1fr_auto_1fr]">
        <div className={`flex gap-4 justify-self-start items-center cursor-pointer text-accent`}>
          <div className="p-2 rounded-md bg-foreground">
            <Translate onClick={() => setLang(prev => prev === 'en' ? 'ja' : 'en')} weight={'bold'} />
          </div>
          <div className="p-2 rounded-md bg-foreground">
            <SquaresFour onClick={() => setIsPixel(prev => !prev)} weight="fill" />
          </div>
        </div>
        <nav className={`py-2 px-6 flex items-center justify-center gap-4 rounded-lg bg-foreground`}>
          <IconContext.Provider value={{
            size: 28,
            weight: "fill",
          }}>
            <NavLink to={'/'} className={({ isActive }) => navFunc(isActive)}>
              <House className={navAnimate} />
            </NavLink>
            <Timer className={`${timerOn ? 'text-accent' : 'text-muted hover:text-muted-foreground'} ${navAnimate}`} onClick={() => setTimerOn(prev => !prev)} />
            <NavLink to={'/signin'} className={({ isActive }) => navFunc(isActive)}>
              <UserCircle className={navAnimate} />
            </NavLink>
          </IconContext.Provider>
        </nav>
        <div className={`hidden justify-self-end rounded-full sm:flex items-center gap-4 p-2 bg-foreground transition-colors duration-200 ease-in-out`}>
          <IconContext.Provider value={{
            size: 20,
            weight: 'fill'
          }}>
            <Sun className={`hover:cursor-pointer transition-all ease-in-out duration-200 ${theme === 'light' ? 'fill-neutral-700' : theme === 'dark' ? 'fill-neutral-700 hover:fill-neutral-600' : 'fill-neutral-400 dark:fill-neutral-700 hover:fill-neutral-500 dark:hover:fill-neutral-600'}`} onClick={() => { setTheme('light'); }} />
            <Moon className={`hover:cursor-pointer transition-all ease-in-out duration-200 ${theme === 'dark' ? 'fill-neutral-400' : theme === 'system' ? 'fill-neutral-400 dark:fill-neutral-700 hover:fill-neutral-500 dark:hover:fill-neutral-600' : 'fill-neutral-400 hover:fill-neutral-500'}`} onClick={() => { setTheme('dark'); }} />
            <Desktop className={`hover:cursor-pointer transition-all ease-in-out duration-200 ${theme === 'system' ? 'fill-neutral-700 dark:fill-neutral-400' : theme === 'light' ? 'fill-neutral-400 hover:fill-neutral-500' : 'fill-neutral-700 hover:fill-neutral-600'}`} onClick={() => { setTheme('system'); }} />
          </IconContext.Provider>
        </div>
      </div>
      <Outlet context={{ dict, timerOn, isPixel }} />
    </div>
  );
}
