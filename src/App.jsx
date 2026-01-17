import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { IconContext, Sun, Moon, Desktop, Translate } from "@phosphor-icons/react";
import en from "./dictionary/en";
import ja from "./dictionary/ja";

const dictionary = {
  en, ja
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('system');

  const dict = dictionary[lang];

  useEffect(() => {
    const handleKeys = e => {
      const code = e.code;
      switch (code) {
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
      <Outlet context={{ dict }} />
    </div>
  );
}
