'use client';

import ToggleLang from "@/components/ToggleLang";
import ToggleTheme from "@/components/ToggleTheme";
import useAuth from "@/hooks/useAuth";
import { useDict } from "@/hooks/useDict";
import useProfile from "@/hooks/useProfile";
import { NavContext } from "@/providers/nav-context";
import { GearIcon, HouseIcon, IconContext, InfoIcon, ListIcon, LogIcon, ScreencastIcon, SquaresFourIcon, TimerIcon, TranslateIcon, UserCircleIcon, UsersIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";


export default function App({ children }: { children: ReactNode; }) {
  const [timerOn, setTimerOn] = useState(false);
  const [isPixel, setIsPixel] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();
  const pathName = usePathname();
  const { dict, locale } = useDict();

  function NavItem({ destination, title, icon, className, isAvatar = false }: { destination: string; title: string; icon: ReactNode; className?: string; isAvatar?: boolean; }) {
    const path = pathName.endsWith('/') ? pathName.slice(0, -1) : pathName;
    const isActive = destination.endsWith(path);
    return (
      <Link href={destination} className={`flex gap-2 items-center ${isActive ? 'text-accent' : 'text-muted hover:text-muted-foreground'} ${className}`}>
        <span className={`${isAvatar ? 'md:static' : 'md:hidden'}`}>
          {icon}
        </span>
        <span className={`${'font-semibold'} text-xl md:text-base ${isAvatar && 'md:hidden'}`}>{title}</span>
      </Link>
    );
  }

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
    select: (p: { avatar_url: string; handle: string; nickname: string; }) => ({ avatar_url: p.avatar_url, handle: p.handle, nickname: p.nickname })
  });

  const navContextValue = useMemo(() => ({ isPixel, timerOn }), [isPixel, timerOn]);

  return (
    <div className={`flex flex-col relative min-h-screen ${locale === 'en' ? (isPixel ? 'font-pixel' : 'font-display') : 'font-jp'} bg-background`}>
      <button onClick={() => setShowMenu(prev => !prev)} type="button" className="bg-foreground p-2 absolute top-6 right-4 z-30 rounded-lg md:hidden">
        <ListIcon weight="bold" size={28} className="text-accent" />
      </button>
      <nav className={`bg-extreme items-center fixed md:static md:justify-between p-4 top-0 right-0 z-30 w-4/5 md:w-full h-screen md:h-auto ${showMenu ? 'flex flex-col md:flex-row ' : 'hidden md:flex'}`}>
        <IconContext.Provider value={{
          size: 20,
          weight: "fill",
        }}>
          <div className="bg-border md:bg-transparent w-full md:w-auto rounded-lg p-4 md:p-0 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
            <div className="flex w-full items-center">
              <ToggleTheme />
              <button onClick={() => setShowMenu(false)} className="p-2 rounded-md bg-background ml-auto md:hidden">
                <ListIcon weight="bold" className="text-accent" />
              </button>
            </div>
            <div className="grid grid-cols-3 md:flex items-center gap-2 w-full">
              <ToggleLang locale={locale} pathName={pathName} />
              <button type="button" className="p-2 rounded-md bg-background flex justify-center hover:translate-y-0.5 transition-all duration-200 ease-out">
                <SquaresFourIcon className={`icon ${isPixel && 'text-accent'}`} onClick={() => setIsPixel(prev => !prev)} weight="fill" />
              </button>
              <button type="button" onClick={() => setTimerOn(prev => !prev)} className="p-2 rounded-md bg-background flex justify-center hover:translate-y-0.5 transition-all duration-200 ease-out">
                <TimerIcon className={`cursor-pointer ${timerOn ? 'text-accent' : 'text-muted hover:text-muted-foreground'} icon`} />
              </button>
            </div>
          </div>
          <div className="flex justify-around items-center h-full">
            <div className="px-4 flex gap-12 md:gap-4 flex-col md:flex-row">
              <NavItem destination={`/${locale}/main`} icon={<HouseIcon className="" />} title="Home" />
              <NavItem destination={`/${locale}/main/profile/${user?.id}/rooms`} icon={<ScreencastIcon className="md:size-10" />} title="Rooms" />
              <NavItem destination={`/${locale}/main/profile/${user?.id}/records`} title="Records" icon={<LogIcon className="md:size-10" />} />
              <NavItem destination={`/${locale}/main/profile/${user?.id}/connections`} icon={<UsersIcon className="md:size-10" />} title="Connections" />
              <NavItem destination={`/${locale}/main/settings`} icon={<GearIcon className="md:size-10" />} title="Settings" />
              <NavItem isAvatar destination={user?.id ? `/${locale}/main/profile/${profile?.handle ? `@${profile.handle}` : user.id}` : `/${locale}/main/signin`} icon={user ? <img src={profile?.avatar_url ?? user?.user_metadata?.avatar_url} alt="user avatar" className="h-6 w-6 rounded-full" /> : <UserCircleIcon className='icon' />} title={profile?.nickname || "Profile"} />
            </div>
          </div>
        </IconContext.Provider>
      </nav>
      <div className="px-4 grow flex flex-col">
        <NavContext.Provider value={navContextValue}>
          {children}
        </NavContext.Provider>
      </div>
      <div className={`flex flex-col gap-4 fixed bottom-16 right-4 select-none ${showInfo ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-10'} icon`}>
        <Link onClick={() => setShowInfo(false)} href={`/${dict.langSubTag}/main/terms`} className="inline-block px-4 py-2 text-accent text-sm ml-auto card">🔏 {dict.policy.header}</Link>
        <a className={``} href="https://www.producthunt.com/products/zach-s-tomato?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-zach-s-tomato" target="_blank" rel="noopener noreferrer"><img alt="Zach's Tomato - Minimal + Responsive Pomodoro Timer | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1071002&amp;theme=neutral&amp;t=1770089203158" /></a>
      </div>
      <InfoIcon weight="fill" className={`bg-background cursor-pointer rounded-full fixed text-muted hover:text-accent bottom-4 right-4 icon ${showInfo ? 'rotate-180' : 'rotate-0'}`} size={30} onClick={() => setShowInfo(prev => !prev)} />
    </div>
  );

}
