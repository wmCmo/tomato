'use client';

import { ArrowArcLeftIcon, ArrowArcRightIcon, ArrowCounterClockwiseIcon, IconContext, PauseIcon, PlayIcon } from "@phosphor-icons/react";

const ControlButton = ({ file, btnFunc, color }: { file: string; btnFunc: () => void; color: string[]; }) => {
    let render;
    if (file === 'reset') {
        render = <ArrowCounterClockwiseIcon />;
    } else if (file === 'backward') {
        render = <ArrowArcLeftIcon />;
    } else if (file === 'pause') {
        render = <PauseIcon />;
    } else if (file === 'play') {
        render = <PlayIcon />;
    } else if (file === 'forward') {
        render = <ArrowArcRightIcon />;
    }
    return (
        <button type="button" onClick={btnFunc} className={`rounded-full ${color?.[1]} p-4 mt-6 ${color?.[3]}`}>
            <IconContext.Provider value={{
                color: 'white',
                size: 25,
                weight: 'fill'
            }}>
                {render}
            </IconContext.Provider>
        </button>
    );
};

export default ControlButton;
