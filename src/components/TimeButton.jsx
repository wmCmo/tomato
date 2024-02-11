import React from "react";

const TimeButton = (props) => {
    return (
        <button onClick={() => {props.onClick(props.name)}}>{props.name}</button>
    )
}

export default TimeButton;
