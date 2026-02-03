import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { IconContext, SunIcon, MoonIcon, DesktopIcon, TranslateIcon, HouseIcon, TimerIcon, UserCircleIcon, SquaresFourIcon, InfoIcon } from "@phosphor-icons/react";
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
  const [showInfo, setShowInfo] = useState(false);

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

  const navAnimate = 'transition-all ease-in-out duration-200 cursor-pointer';
  return (
    <div className={`relative min-h-screen flex justify-center items-center p-4 sm:p-8 ${lang === 'en' ? (isPixel ? 'font-pixel' : 'font-display') : 'font-zenMaru'} bg-background ${navAnimate} cursor-default`}>
      <div className="fixed top-6 w-full px-4 sm:px-8 items-center grid grid-cols-[1fr_auto_1fr]">
        <div className={`flex gap-4 justify-self-start items-center cursor-pointer text-accent`}>
          <div className="p-2 rounded-md bg-foreground">
            <TranslateIcon onClick={() => setLang(prev => prev === 'en' ? 'ja' : 'en')} weight={'bold'} />
          </div>
          <div className="p-2 rounded-md bg-foreground">
            <SquaresFourIcon onClick={() => setIsPixel(prev => !prev)} weight="fill" />
          </div>
        </div>
        <nav className={`py-2 px-6 flex items-center justify-center gap-4 rounded-lg bg-foreground`}>
          <IconContext.Provider value={{
            size: 28,
            weight: "fill",
          }}>
            <NavLink to={'/'} className={({ isActive }) => navFunc(isActive)}>
              <HouseIcon className={navAnimate} />
            </NavLink>
            <TimerIcon className={`cursor-pointer ${timerOn ? 'text-accent' : 'text-muted hover:text-muted-foreground'} ${navAnimate}`} onClick={() => setTimerOn(prev => !prev)} />
            <NavLink to={'/signin'} className={({ isActive }) => navFunc(isActive)}>
              <UserCircleIcon className={navAnimate} />
            </NavLink>
          </IconContext.Provider>
        </nav>
        <div className={`justify-self-end rounded-full flex items-center gap-4 p-2 bg-foreground`}>
          <IconContext.Provider value={{
            size: 20,
            weight: 'fill'
          }}>
            <SunIcon className={`${navAnimate} ${theme === 'light' ? 'fill-neutral-700' : theme === 'dark' ? 'fill-neutral-700 hover:fill-neutral-600' : 'fill-neutral-400 dark:fill-neutral-700 hover:fill-neutral-500 dark:hover:fill-neutral-600'}`} onClick={() => { setTheme('light'); }} />
            <MoonIcon className={`${navAnimate} ${theme === 'dark' ? 'fill-neutral-400' : theme === 'system' ? 'fill-neutral-400 dark:fill-neutral-700 hover:fill-neutral-500 dark:hover:fill-neutral-600' : 'fill-neutral-400 hover:fill-neutral-500'}`} onClick={() => { setTheme('dark'); }} />
            <DesktopIcon className={`hidden sm:block ${navAnimate} ${theme === 'system' ? 'fill-neutral-700 dark:fill-neutral-400' : theme === 'light' ? 'fill-neutral-400 hover:fill-neutral-500' : 'fill-neutral-700 hover:fill-neutral-600'}`} onClick={() => { setTheme('system'); }} />
          </IconContext.Provider>
        </div>
      </div>
      <Outlet context={{ dict, timerOn, isPixel }} />
      <a className={`select-none fixed bottom-16 right-4 ${showInfo ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-10'} ${navAnimate}`} href="https://www.producthunt.com/products/zach-s-tomato?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-zach-s-tomato" target="_blank" rel="noopener noreferrer"><img alt="Zach's Tomato - Minimal + Responsive Pomodoro Timer | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1071002&amp;theme=neutral&amp;t=1770089203158" /></a>
      <InfoIcon weight="fill" className={`bg-white rounded-full fixed text-muted hover:text-accent bottom-4 right-4 ${navAnimate} ${showInfo ? 'rotate-180' : 'rotate-0'}`} size={30} onClick={() => setShowInfo(prev => !prev)} />
    </div>
  );
}
