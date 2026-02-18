import { FloppyDiskIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useOutletContext } from "react-router";

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

const RecordCard = ({ month, entries, handleDelete }) => {
    const { dict } = useOutletContext();
    const [isEditing, setIsEditing] = useState(false);
    if (!entries) return <></>;
    const fuuButsuShi = fluentMonth[month];
    return (
        <div className="mt-4">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <img className="w-6 h-auto" src={`${fluentRepo}${encodeURIComponent(fuuButsuShi)}/Color/${fuuButsuShi.toLowerCase().replace(' ', '_')}_color.svg`} alt={`Fluent ${fuuButsuShi} emoji`} />
                    <h3 className="font-semibold text-muted-foreground">{dict.record.months[month]}</h3>
                </div>
                <button onClick={() => setIsEditing(prev => !prev)} className="text-muted icon">
                    {
                        isEditing ? <FloppyDiskIcon weight="fill" /> : <PencilSimpleIcon weight="fill" />
                    }
                </button>
            </div>
            <div className="card px-8 py-6 mt-2 space-y-4 text-sm">
                {entries.map(entry => {
                    return (
                        <div key={entry.id} className="flex justify-between items-center">
                            <span>{entry.lastEdit}</span>
                            <div className={`flex ${isEditing ? 'w-16' : 'w-12'} justify-between items-center`}>
                                <img className="w-4 h-auto" src={`${fluentRepo}Tomato/Color/tomato_color.svg`} alt="Fluent tomato emoji" />
                                <span className="">x{entry.sessions}</span>
                                {isEditing && <button onClick={() => handleDelete(entry.id)} className="icon hover:text-rose-400"><TrashIcon /></button>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

    );
};

export default RecordCard;
