/* eslint-disable react/prop-types */
import { IconContext, ArrowCounterClockwise, ArrowArcLeft, ArrowArcRight, Pause, Play } from "@phosphor-icons/react";

const ControlButton = (props) => {
    let render;
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
        <button onClick={props.btnFunc}>
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
