const TimeButton = (props) => {
    return (
        <button className={`${props.color?.[1]} text-white rounded-lg px-4 py-2 sm:py-4 font-semibold ${props.color?.[3]}`} onClick={() => { props.onClick(props.name); }}>{props.name}</button>
    );
};

export default TimeButton;
