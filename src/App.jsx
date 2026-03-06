import { DesktopIcon, IconContext, MoonIcon, SunIcon, TranslateIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { useTheme } from "./hooks/use-theme";

const dict = {
  en: {
    thanks: "Thank you for using Zach's Tomato",
    move: ["To improve your experience, we decided to move our website to ", ""],
    bookmark: "Don't forget to bookmark with the new URL"
  },
  ja: {
    thanks: "Zach's Tomatoをご利用いただきありがとうございます！",
    move: ["より良い体験のため、ウェブサイトを", "に移転しました。"],
    bookmark: "新しいURLをブックマークすることを忘れなく。"
  }
};

export default function App() {
  const [lang, setLang] = useState(localStorage.getItem('locale') || 'en');
  const { theme, setTheme, toggleTheme } = useTheme();
  const [isPixel, setIsPixel] = useState(JSON.parse(localStorage.getItem('isPixel') || 'false'));

  const changeLocale = useCallback(() => {
    setLang(prev => {
      const newLocale = prev === 'en' ? 'ja' : 'en';
      localStorage.setItem('locale', newLocale);
      return newLocale;
    });
  }, []);

  useEffect(() => {
    const handleKeys = e => {
      if (!e.altKey) return;
      const code = e.code;
      switch (code) {
        case 'KeyT':
          toggleTheme();
          break;
        case 'KeyL':
          changeLocale();
          break;
        case 'KeyP':
          setIsPixel(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeys);

    return () => {
      window.removeEventListener('keydown', handleKeys);
    };
  }, [changeLocale, toggleTheme]);

  const locale = dict[lang];

  return (
    <div className={`pt-12 h-svh p-4 sm:p-8 ${lang === 'en' ? (isPixel ? 'font-pixel' : 'font-display') : 'font-zenMaru'} bg-background text-accent`}>
      <div className="flex justify-between items-center">
        <div className="p-2 rounded-md bg-foreground">
          <TranslateIcon className="" onClick={changeLocale} weight={'bold'} />
        </div>
        <div className={`justify-self-end rounded-full flex items-center gap-4 p-2 bg-foreground cursor-pointer`}>
          <IconContext.Provider value={{
            size: 20,
            weight: 'fill'
          }}>
            <SunIcon className={`icon ${theme === 'light' ? 'fill-neutral-700' : theme === 'dark' ? 'fill-neutral-700 hover:fill-neutral-600' : 'fill-neutral-400 dark:fill-neutral-700 hover:fill-neutral-500 dark:hover:fill-neutral-600'}`} onClick={() => { setTheme('light'); }} />
            <MoonIcon className={`icon ${theme === 'dark' ? 'fill-neutral-400' : theme === 'system' ? 'fill-neutral-400 dark:fill-neutral-700 hover:fill-neutral-500 dark:hover:fill-neutral-600' : 'fill-neutral-400 hover:fill-neutral-500'}`} onClick={() => { setTheme('dark'); }} />
            <DesktopIcon className={`hidden sm:block icon ${theme === 'system' ? 'fill-neutral-700 dark:fill-neutral-400' : theme === 'light' ? 'fill-neutral-400 hover:fill-neutral-500' : 'fill-neutral-700 hover:fill-neutral-600'}`} onClick={() => { setTheme('system'); }} />
          </IconContext.Provider>
        </div>
      </div>
      <div className="h-full flex justify-center items-center flex-col gap-4">
        <div className="gap-4 -mt-4 flex items-center sm:items-end flex-col sm:flex-row">
          <img className="h-16 w-16" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Tomato/Color/tomato_color.svg" alt="Fluent tomato emoji" />
          <h1 className="font-black text-3xl sm:text-4xl leading-10 text-center">{locale.thanks}</h1>
        </div>
        <p className="text-center sm:text-left mt-4">{locale.move[0]}<Link className="underline underline-offset-8 font-bold hover:text-muted-foreground" to={`http://ztomato.vercel.app/${lang}/main`} target="_blank" rel="noopener noreferrer">ztomato.vercel.app</Link>{locale.move[1]}</p>
        <p className="text-center sm:text-left">{locale.bookmark}😉</p>
      </div>
    </div>
  );

}
