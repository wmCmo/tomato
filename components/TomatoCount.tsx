
const TomatoCount = ({ count, label }: { count: number; label?: string; }) => {
    return (
        <div className="bg-foreground font-bold flex items-center px-2 py-1 rounded-lg gap-1 max-w-32">
            <img className="h-4 w-4" src={`https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Tomato/Color/tomato_color.svg`} alt="Fluent tomato emoji" />
            <span>{count} {label}</span>
        </div>
    );
};

export default TomatoCount;
