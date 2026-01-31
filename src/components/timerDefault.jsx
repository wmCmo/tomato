
export default function TimerDefault({ sec, min, hour, isActive, setActiveClock, }) {
    return (
        <button onClick={setActiveClock} className={`bg-foreground transition-all ease-in-out duration-200 border-solid border-muted sm:min-w-28 ${isActive ? 'text-accent border' : 'text-muted hover:text-muted-foreground'} text-center font-bold rounded-lg py-2 px-4`}>{String(hour).padStart(2, '0')}:{String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}</button>
    );
}
