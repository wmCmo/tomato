import ToggleLang from "@/components/ToggleLang";
import ToggleTheme from "@/components/ToggleTheme";
import en from "@/dictionary/en";
import ja from "@/dictionary/ja";
import { DictType } from "@/types/DictType";
import { LocaleType } from "@/types/Locale";
import { GithubLogoIcon, LinkedinLogoIcon, MediumLogoIcon, NotionLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ReactNode } from "react";

const fluentTomato = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Tomato/Color/tomato_color.svg";

function NewPageLink({ children, href }: { children: ReactNode; href: string; }) {
  return <Link href={href} target="_blank" rel="noopener noopener">{children}</Link>;
}



const dictionaries: Record<LocaleType, DictType> = { en, ja };

export default async function Home({ params }: { params: Promise<{ locale: string; }>; }) {
  const { locale: segment } = await params;
  const locale = segment === "ja" ? "ja" : "en";
  const dict = dictionaries[locale];

  function Call2Action() {
    return (
      <div className="sm:flex-row flex flex-col items-center gap-4">
        <Link href={`/${locale}/main`} className="bg-foreground px-8 py-2 rounded-xl text-xl text-absolute hover:translate-y-1 active:translate-y-2 border-border border">{dict.landing.start}</Link>
        <p className="">{dict.landing.gtd}</p>
      </div>
    );
  }
  return (
    <main className={`${locale === 'en' ? 'font-display' : 'font-jp'} text-accent flex flex-col bg-background min-h-screen`}>
      <nav className="flex items-center justify-between m-4">
        <div className="flex items-end gap-2">
          <img src={fluentTomato} alt="Fluent tomato emoji" />
          <h4 className="font-black">{dict.home.nav.header}</h4>
        </div>
        <div className="flex gap-4 items-center">
          <ToggleTheme />
          <ToggleLang locale={locale} pathName="/" />
        </div>
        {/* <ListIcon weight="bold" className="" size={32} /> */}
      </nav>
      <section className="font-bold flex flex-col sm:gap-8 sm:flex-row-reverse items-center justify-center px-4 h-dvh -mt-8">
        <div className="">
          <div className="flex justify-center sm:justify-start">
            <p className="font-mono bg-foreground font-bold px-4 py-1 rounded-full">v2.6.0</p>
          </div>
          <h1 className="text-6xl text-center font-black sm:text-left mt-4 text-rose-400">{dict.landing.title[0]}</h1>
          <h2 className="text-4xl text-center mt-2 sm:text-left">{dict.landing.title[1]}</h2>
          <div className="hidden sm:block mt-12">
            <Call2Action />
          </div>
        </div>
        <div className="mt-4 bg-rose-300 flex flex-col items-center py-8 max-w-sm w-full rounded-lg px-12">
          <h3 className="text-center text-white bg-rose-200 py-4 text-5xl sm:text-6xl rounded-lg w-full font-display">25 : 00</h3>
          <div className="flex mt-8 justify-between w-full gap-2">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className={"max-w-20 w-full h-8 bg-rose-200 rounded-lg"}></div>)}
          </div>
          <div className="flex mt-4 justify-between w-full">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className={"w-8 h-8 bg-rose-200 rounded-full"}></div>)}
          </div>
        </div>
        <div className="sm:hidden mt-12">
          <Call2Action />
        </div>
      </section>
      <footer className="bg-foreground w-full px-8 py-8 mt-16 flex gap-12 sm:gap-24 flex-col sm:flex-row">
        <div>
          <div className="flex items-end gap-2">
            <img src={fluentTomato} alt="Fluent tomato emoji" />
            <h4 className="font-bold text-lg text-absolute">{dict.home.nav.header}</h4>
          </div>
          <p className="mt-2 font-medium">{dict.home.choices[0]} {dict.stopwatch.select.timer}</p>
          <p className="mt-1 text-muted-foreground">{dict.landing.tagLine}</p>
          <div className="flex gap-4 mt-4">
            <NewPageLink href="https://github.com/wmcmo/tomato">
              <GithubLogoIcon weight="fill" size={20} />
            </NewPageLink>
            <NewPageLink href="https://exzachly.notion.site/">
              <NotionLogoIcon weight="fill" size={20} />
            </NewPageLink>
            <NewPageLink href="https://medium.com/@heisei15">
              <MediumLogoIcon weight="fill" size={20} />
            </NewPageLink>
            <NewPageLink href="https://www.linkedin.com/in/exzachly">
              <LinkedinLogoIcon weight="fill" size={20} />
            </NewPageLink>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-lg">{dict.landing.about}</h4>
          <Link href={`/${locale}/main/terms#policy`} className="text-sm">{dict.landing.terms}</Link>
          <Link href={`/${locale}/main/terms#terms`} className="text-sm">{dict.policy.header}</Link>
        </div>
      </footer>
    </main>
  );
}
