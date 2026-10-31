'use client';

import useDict from "@/hooks/useDict";
import usePreferences, { LONG_BREAK_INTERVAL_RANGE } from "@/hooks/usePreferences";
import useSwitchLocale from "@/hooks/useSwitchLocale";
import useToast from "@/hooks/useToast";
import { LocaleArr } from "@/types/Locale";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";

const LANGUAGE_NAMES = { en: "English", ja: "日本語" } as const;

function StepButton({ icon, onClick, disabled }: { icon: React.ReactNode; onClick: () => void; disabled: boolean; }) {
    return <button type="button" onClick={onClick} disabled={disabled} className={`p-2 rounded-md bg-foreground ${disabled ? 'opacity-40' : 'hover:translate-y-0.5'} transition-all duration-200 ease-out`}>{icon}</button>;
}

export default function PreferencesSection() {
    const { dict } = useDict();
    const { toast } = useToast();
    const { locale, switchLocale } = useSwitchLocale();
    const { longBreakInterval, setLongBreakInterval } = usePreferences();

    const changeInterval = (next: number) => {
        setLongBreakInterval(next).catch(error => {
            console.error(error);
            toast(undefined, dict.error.updateDb, 'errorDb');
        });
    };

    return (
        <section className="w-full max-w-md space-y-6">
            <h2 className="text-xl font-semibold">{dict.setting.preferences}</h2>
            <div className="flex items-center justify-between gap-4">
                <span>{dict.setting.language}</span>
                <div className="flex gap-2">
                    {LocaleArr.map(l => (
                        <button key={l} type="button" onClick={() => switchLocale(l)} className={`px-3 py-1 rounded-lg font-bold ${l === locale ? 'bg-blue-600 text-white' : 'bg-foreground text-muted-foreground hover:text-accent'}`}>
                            {LANGUAGE_NAMES[l]}
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                    <span>{dict.setting.longBreak.label}</span>
                    <div className="flex items-center gap-3">
                        <StepButton icon={<MinusIcon weight="bold" />} onClick={() => changeInterval(longBreakInterval - 1)} disabled={longBreakInterval <= LONG_BREAK_INTERVAL_RANGE.min} />
                        <span className="font-bold tabular-nums w-6 text-center">{longBreakInterval}</span>
                        <StepButton icon={<PlusIcon weight="bold" />} onClick={() => changeInterval(longBreakInterval + 1)} disabled={longBreakInterval >= LONG_BREAK_INTERVAL_RANGE.max} />
                        <span className="text-muted-foreground">{dict.setting.longBreak.unit}</span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">{dict.setting.longBreak.hint}</p>
            </div>
        </section>
    );
}
