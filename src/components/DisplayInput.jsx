export default function DisplayInput({ digitValue, setDefaults }) {
    return <input className="w-16 sm:w-24 bg-transparent text-center" type="number" value={String(digitValue).slice(-2).padStart(2, '0')} onBlur={() => {
        if (digitValue > 59) {
            setDefaults(59);
        }
        if (digitValue < 0) {
            setDefaults(0);
        }

    }} onChange={e => setDefaults(String(e.target.value).slice(-2))} />;
}
