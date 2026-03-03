'use client';

const TimeButton = ({ color, onClick, status, name }: { color: string[]; onClick: (newStatus: 0 | 1 | 2, updateSession?: boolean) => Promise<void>; status: 0 | 1 | 2; name: string; }) => {
    return (
        <button type="button" className={`${color?.[1]} text-white rounded-lg px-4 py-2 sm:py-4 font-semibold ${color?.[3]}`} onClick={() => { onClick(status); }}>{name}</button>
    );
};

export default TimeButton;
