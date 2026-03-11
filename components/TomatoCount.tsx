import { LocaleType } from "@/types/Locale";

const TomatoCount = ({ count, label, locale = 'en' }: { count: number; label?: string; locale: LocaleType; }) => {
    return (
        <div className={`bg-foreground font-bold flex ${locale === 'ja' && 'flex-row-reverse'} items-center px-2 py-1 rounded-lg gap-1 w-fit h-fit`}>
            <img className="h-4 w-4" src={`https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Tomato/Color/tomato_color.svg`} alt="Fluent tomato emoji" />
            <p className="">{count}</p>
            <span className="w-fit text-nowrap">{label}</span>
        </div>
    );
};

export default TomatoCount;
