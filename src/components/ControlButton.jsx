/* eslint-disable react/prop-types */
const ControlButton = (props) => {
    let func;
    if (props.file === "play" || props.file === "pause") {
        func = props.toggle
    } else if (props.file === "backward") {
        func = props.rewind
    } else if (props.file === "reset") {
        func = props.reset
    } else if (props.file === "forward") {
        func = props.forward
    }
    return (
        <button onClick={func}>
            <img src={`./src/assets/${props.file}-icon.svg`} alt="props.file" />
        </button>
    )
}

export default ControlButton;
