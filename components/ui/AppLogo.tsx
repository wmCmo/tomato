import { DictType } from '@/types/DictType';

export const fluentTomato = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Tomato/Color/tomato_color.svg";

export default function AppLogo({ dict, ratio = 1 }: Readonly<{ dict: DictType; ratio?: number; }>) {
    return (
        <div style={{ display: "flex", alignItems: 'center', gap: `${0.58 * ratio}rem` }}>
            <img style={{ height: `${1.5 * ratio}rem`, width: `${1.5 * ratio}rem` }} src={fluentTomato} alt="Fluent tomato emoji" />
            <h4 className="font-black" style={{ fontSize: `${ratio}rem` }}>{dict.appName}</h4>
        </div>
    );
}
