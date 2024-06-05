import React from "react";

const TimeButton = (props: {
    color: Array<string>; onClick: (arg0: any) => void; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
}) => {
    return (
        <button className={`${props.color[1]} text-white rounded-lg px-4 py-4 font-semibold ${props.color[3]}`} onClick={() => { props.onClick(props.name) }}>{props.name}</button>
    )
}

export default TimeButton;
