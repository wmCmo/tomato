import { useCallback, useRef, useState } from "react";
import { useOutletContext } from "react-router";

const buttonAnimation = 'hover:translate-y-1 active:translate-y-2 transition-all duration-100 ease-in';

function useConfirm() {
    const { dict } = useOutletContext();
    const [state, setState] = useState({ open: false, message: "" });

    const resolver = useRef();

    const confirm = useCallback(message => {
        setState({ open: true, message });
        return new Promise(res => {
            resolver.current = res;
        });
    }, []);

    const onClose = useCallback(choice => {
        setState({ open: false, message: "" });
        resolver.current?.(choice);
        resolver.current = undefined;
    }, []);

    const modal = state.open ? (
        <div onClick={() => onClose(false)} className="fixed inset-0 grid place-items-center bg-background/60 backdrop-blur-lg text-accent px-4">
            <div onClick={e => e.stopPropagation()} className="card py-8 text-center max-w-lg w-full space-y-6 px-4">
                <h3 className="text-lg font-bold">
                    {state.message}
                </h3>
                <p className="text-muted-foreground text-sm">{dict.ui.warnDelete[0]}<i>{dict.ui.warnDelete[1]}</i>{dict.ui.warnDelete[2]}</p>
                <div className="space-x-6 font-semibold">
                    <button className={`min-w-28 bg-muted px-4 py-2 rounded-lg text-accent ${buttonAnimation}`} onClick={() => onClose(false)}>{dict.ui.cancel}</button>
                    <button className={`min-w-28 bg-rose-500 px-8 py-2 rounded-lg text-white ${buttonAnimation}`} onMouseUp={() => onClose(true)}>{dict.ui.delete}</button>
                </div>
            </div>
        </div>
    ) : null;
    return { confirm, modal };
}

export default useConfirm;