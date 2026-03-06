'use client';

import ToggleLang from "@/components/ToggleLang";
import ToggleTheme from "@/components/ToggleTheme";
import useAuth from "@/hooks/useAuth";
import { useDict } from "@/hooks/useDict";
import useProfile from "@/hooks/useProfile";
import { HouseIcon, IconContext, InfoIcon, SquaresFourIcon, TimerIcon, UserCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

const NavContext = createContext<{ timerOn: boolean; isPixel: boolean; } | undefined>(undefined);

export function useNavContext() {
  const context = useContext(NavContext);
  if (!context) throw new Error('useNavContext must be used within NavProvider');
  return context;
};

export default function App({ children }: { children: ReactNode; }) {
  const [timerOn, setTimerOn] = useState(false);
  const [isPixel, setIsPixel] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { user } = useAuth();
  const pathName = usePathname();
  const { dict, locale } = useDict();

  useEffect(() => {
    setIsPixel(JSON.parse(localStorage.getItem('isPixel') ?? 'false'));
  }, []);

  useEffect(() => {
    function handleKeys(e: KeyboardEvent) {
      if (!e.altKey) return;
      if (e.code === 'KeyP') setIsPixel(prev => !prev);
    }
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, []);

  const navFunc = (isActive: boolean) => {
    return `${isActive ? 'text-accent' : 'text-muted hover:text-muted-foreground'}`;
  };

  useEffect(() => {
    localStorage.setItem('isPixel', JSON.stringify(isPixel));
  }, [isPixel]);

  const { data: profile } = useProfile(user?.id, {
    select: (p: { avatar_url: string; }) => ({ avatar_url: p.avatar_url })
  });

  const navContextValue = useMemo(() => ({ isPixel, timerOn }), [isPixel, timerOn]);

  return (
    <div className={`relative pt-12 min-h-screen flex justify-center items-center p-4 sm:p-8 ${locale === 'en' ? (isPixel ? 'font-pixel' : 'font-display') : 'font-jp'} bg-background`}>
      <div className="fixed top-0 pt-6 pb-4 w-full px-4 sm:px-8 items-center grid grid-cols-[1fr_auto_1fr] bg-background z-20">
        <div className={`flex gap-4 justify-self-start items-center cursor-pointer text-accent`}>
          <ToggleLang locale={locale} pathName={pathName} />
          <div className="p-2 rounded-md bg-foreground">
            <SquaresFourIcon className={`icon ${isPixel && 'text-accent'}`} onClick={() => setIsPixel(prev => !prev)} weight="fill" />
          </div>
        </div>
        <nav className={`py-2 px-6 flex items-center justify-center gap-4 rounded-lg bg-foreground`}>
          <IconContext.Provider value={{
            size: 28,
            weight: "fill",
          }}>
            <Link href={`/${dict.langSubTag}/main`} className={navFunc(pathName.includes('/main/'))}>
              <HouseIcon className='icon' />
            </Link>
            <TimerIcon className={`cursor-pointer ${timerOn ? 'text-accent' : 'text-muted hover:text-muted-foreground'} icon`} onClick={() => setTimerOn(prev => !prev)} />
            <Link href={user?.id ? `/${dict.langSubTag}/main/profile/${user?.id || ''}` : `/${dict.langSubTag}/main/signin`} className={navFunc(pathName.includes('/profile/') || pathName.includes('/signin'))}>
              {user ? <img src={profile?.avatar_url ?? user?.user_metadata?.avatar_url} alt="user avatar" className="h-6 w-6 rounded-full" /> : <UserCircleIcon className='icon' />}
            </Link>
          </IconContext.Provider>
        </nav>
        <ToggleTheme />
      </div>
      <NavContext.Provider value={navContextValue}>
        {children}
      </NavContext.Provider>
      <div className={`flex flex-col gap-4 fixed bottom-16 right-4 select-none ${showInfo ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-10'} icon`}>
        <Link onClick={() => setShowInfo(false)} href={`/${dict.langSubTag}/main/terms`} className="inline-block px-4 py-2 text-accent text-sm ml-auto card">🔏 {dict.policy.header}</Link>
        <a className={``} href="https://www.producthunt.com/products/zach-s-tomato?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-zach-s-tomato" target="_blank" rel="noopener noreferrer"><img alt="Zach's Tomato - Minimal + Responsive Pomodoro Timer | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1071002&amp;theme=neutral&amp;t=1770089203158" /></a>
      </div>
      <InfoIcon weight="fill" className={`bg-background cursor-pointer rounded-full fixed text-muted hover:text-accent bottom-4 right-4 icon ${showInfo ? 'rotate-180' : 'rotate-0'}`} size={30} onClick={() => setShowInfo(prev => !prev)} />
    </div>
  );

}
