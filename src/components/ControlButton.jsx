/* eslint-disable react/prop-types */
const ControlButton = (props) => {
    return (
        <button onClick={props.btnFunc}>
            <img src={`./src/assets/${props.file}-icon.svg`} alt="props.file" />
        </button>
    )
}

export default ControlButton;
