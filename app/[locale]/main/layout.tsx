'use client';

import ToggleLang from "@/components/ToggleLang";
import ToggleTheme from "@/components/ToggleTheme";
import useAuth from "@/hooks/useAuth";
import useDict from "@/hooks/useDict";
import useProfile from "@/hooks/useProfile";
import useToast from "@/hooks/useToast";
import { signInWithGoogle } from "@/lib/supabase";
import { NavContext } from "@/providers/nav-context";
import { GearIcon, GoogleLogoIcon, HouseIcon, IconContext, ListIcon, LogIcon, ScreencastIcon, SquaresFourIcon, TimerIcon, UserCircleIcon, UsersIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";


export default function App({ children }: { children: ReactNode; }) {
  const [timerOn, setTimerOn] = useState(false);
  const [isPixel, setIsPixel] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();
  const pathName = usePathname();
  const { dict, locale } = useDict();
  const { toast } = useToast();

  function NavItem({ destination, title, icon, className, isAvatar = false }: { destination: string; title: string; icon: ReactNode; className?: string; isAvatar?: boolean; }) {
    const currentPath = pathName.replace(`/${locale}/main`, '');
    const noTrailingDestination = destination.endsWith('/') ? destination.slice(0, -1) : destination;
    const isActive = currentPath === noTrailingDestination;
    return (
      <Link href={`/${locale}/main${destination}`} className={`hover:underline underline-offset-4 flex gap-2 items-center ${isActive ? 'text-absolute' : 'text-muted-foreground hover:text-accent'} ${className}`}>
        <span className={` ${isAvatar ? 'md:static' : 'md:hidden'}`}>
          {icon}
        </span>
        <span className={`${isActive ? 'font-semibold' : 'font-base'} text-xl md:text-base ${isAvatar && 'md:hidden'}`}>{title}</span>
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

  useEffect(() => {
    localStorage.setItem('isPixel', JSON.stringify(isPixel));
  }, [isPixel]);

  const { data: profile } = useProfile(user?.id, {
    select: (p: { avatar_url: string; handle: string; nickname: string; id: string; }) => ({ avatar_url: p.avatar_url, handle: p.handle, nickname: p.nickname, id: p.id })
  });

  const navContextValue = useMemo(() => ({ isPixel, timerOn }), [isPixel, timerOn]);

  const identifier = profile?.handle ? `@${profile.handle}` : profile?.id;

  return (
    <div className={`flex flex-col relative min-h-screen ${locale === 'en' ? (isPixel ? 'font-pixel' : 'font-display') : 'font-jp'} bg-background`}>
      <button onClick={() => setShowMenu(prev => !prev)} type="button" className="bg-foreground p-2 absolute top-6 right-4 z-30 rounded-lg md:hidden">
        <ListIcon weight="bold" size={28} className="text-muted hover:text-muted-foreground" />
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
                <ListIcon weight="bold" className="text-muted hover:text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-3 md:flex items-center gap-2 w-full">
              <ToggleLang locale={locale} pathName={pathName} />
              <button type="button" className="p-2 rounded-md bg-foreground flex justify-center hover:translate-y-0.5 transition-all duration-200 ease-out">
                <SquaresFourIcon className={`icon ${isPixel && 'text-accent'}`} onClick={() => setIsPixel(prev => !prev)} weight="fill" />
              </button>
              <button type="button" onClick={() => setTimerOn(prev => !prev)} className="p-2 rounded-md bg-foreground flex justify-center hover:translate-y-0.5 transition-all duration-200 ease-out">
                <TimerIcon className={`cursor-pointer ${timerOn ? 'text-accent' : 'text-muted hover:text-muted-foreground'} icon`} />
              </button>
            </div>
          </div>
          <div className="flex justify-around items-center h-full">
            <div className="px-4 flex gap-12 md:gap-4 flex-col md:flex-row">
              <NavItem destination={`/`} icon={<HouseIcon className="" />} title={dict.home.title} />
              {identifier ?
                <>
                  <NavItem destination={`/profile/${identifier}/rooms`} icon={<ScreencastIcon className="md:size-10" />} title={dict.nav.rooms} />
                  <NavItem destination={`/profile/${identifier}/records`} title={dict.nav.records} icon={<LogIcon className="md:size-10" />} />
                  <NavItem destination={`/profile/${identifier}/connections`} icon={<UsersIcon className="md:size-10" />} title={dict.nav.connections} />
                  <NavItem destination={`/settings`} icon={<GearIcon className="md:size-10" />} title={dict.setting.title} />
                  <NavItem isAvatar destination={identifier ? `/profile/${identifier}` : `/signin`} icon={user ? <img src={profile?.avatar_url ?? user?.user_metadata?.avatar_url} alt="user avatar" className="h-6 min-w-6 rounded-full" /> : <UserCircleIcon className='icon' />} title={profile?.nickname || "Profile"} />
                </> :
                <button onClick={() => signInWithGoogle(toast, dict)} type="button" className="flex gap-2 card px-4 py-1 text-muted items-center hover:translate-y-0.5 transition-all duration-200 ease-out">
                  <GoogleLogoIcon className="" weight="bold" size={16} />
                  <span className="font-semibold">{dict.login.title}</span>
                </button>
              }
            </div>
          </div>
        </IconContext.Provider>
      </nav>
      <NavContext.Provider value={navContextValue}>
        {children}
      </NavContext.Provider>
    </div>
  );

}
