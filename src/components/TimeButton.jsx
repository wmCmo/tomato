/* eslint-disable react/prop-types */
const TimeButton = (props) => {
    return (
        <button onClick={() => {props.onClick(props.name)}}>{props.name}</button>
    )
}

export default TimeButton;
