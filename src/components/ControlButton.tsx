import { IconContext, ArrowCounterClockwise, ArrowArcLeft, ArrowArcRight, Pause, Play } from "@phosphor-icons/react";
import React from "react";

const ControlButton = (props: {
    color: Array<string>; file: string; btnFunc: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
    let render: string | number | boolean | Iterable<React.ReactNode> | React.JSX.Element | null | undefined;
    if (props.file === 'reset') {
        render = <ArrowCounterClockwise />;
    } else if (props.file === 'backward') {
        render = <ArrowArcLeft />;
    } else if (props.file === 'pause') {
        render = <Pause />;
    } else if (props.file === 'play') {
        render = <Play />;
    } else if (props.file === 'forward') {
        render = <ArrowArcRight />;
    }
    return (
        <button onClick={props.btnFunc} className={`rounded-full ${props.color[1]} p-4 mt-4 ${props.color[3]}`}>
            <IconContext.Provider value={{
                color: 'white',
                size: 25,
                weight: 'fill'
            }}>
                {render}
            </IconContext.Provider>
        </button>
    )
}

export default ControlButton;
