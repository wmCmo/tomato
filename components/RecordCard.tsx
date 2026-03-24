'use client';

import useDict from "@/hooks/useDict";
import StudySessionType from "@/types/StudySession";
import getTomatoSize from "@/utils/getTomatoSize";
import { FloppyDiskIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import type { User } from "@supabase/supabase-js";
import { useState } from "react";

const fluentMonth = [
    'Pine decoration',
    'Ogre',
    'Cherry blossom',
    'Backpack',
    'Cap streamer',
    'Umbrella with rain drops',
    'Fireworks',
    'Red paper lantern',
    'Maple leaf',
    'Jack-o-lantern',
    'Fallen leaf',
    'Christmas tree',
];

const fluentRepo = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/";

const RecordCard = ({ month, entries, handleDelete, profile, userId, maxInMonth }: { month: number; entries: StudySessionType[]; handleDelete: (id: string) => void; profile: string | undefined; userId: string | undefined; maxInMonth: number; }) => {
    const { dict } = useDict();
    const [isEditing, setIsEditing] = useState(false);
    if (!entries) return <></>;
    const fuuButsuShi = fluentMonth[month];
    return (
        <div className="mt-6">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <img className="w-6 h-auto" src={`${fluentRepo}${encodeURIComponent(fuuButsuShi)}/Color/${fuuButsuShi.toLowerCase().replaceAll(' ', '_')}_color.svg`} alt={`Fluent ${fuuButsuShi} emoji`} />
                    <h3 className="font-semibold text-muted-foreground">{dict.record.months[month]}</h3>
                </div>
                {
                    profile === userId &&
                    <button type="button" onClick={() => setIsEditing(prev => !prev)} className="text-muted icon">
                        {
                            isEditing ? <FloppyDiskIcon weight="fill" /> : <PencilSimpleIcon weight="fill" />
                        }
                    </button>
                }
            </div>
            <div className="card px-8 py-6 mt-2 space-y-6 text-sm">
                {entries.map(entry => {
                    const src = getTomatoSize(maxInMonth, entry.sessions);
                    return (
                        <div key={entry.id} className="flex justify-between items-center">
                            <span>{entry.last_edited}</span>
                            <div className={`flex ${isEditing ? 'w-16' : 'w-12'} justify-between items-center`}>
                                <img className="w-6 h-6" src={`/tomato-phases/${src}.svg`} alt="Fluent tomato emoji" />
                                <span className=""><b>x{entry.sessions}</b></span>
                                {isEditing && <button type="button" onClick={() => handleDelete(entry.id)} className="icon hover:text-rose-400"><TrashIcon /></button>}
                            </div>
                        </div>
                    );
                })}
                <hr className="border-border border" />
                <div className="flex justify-between items-end">
                    <span className="font-bold">{dict.record.thisMonth}</span>
                    <div className="flex gap-2">
                        <img className="w-6 h-6" src={`${fluentRepo}Tomato/Color/tomato_color.svg`} alt="Fluent tomato emoji" />
                        <span className="font-bold text-lg text-absolute">x{entries.reduce((sum, entry) => sum + entry.sessions, 0)}</span>
                    </div>
                </div>
            </div>
        </div >

    );
};

export default RecordCard;
