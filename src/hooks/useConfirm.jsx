import { useCallback, useRef, useState } from "react";

const buttonAnimation = 'hover:translate-y-1 active:translate-y-2 transition-all duration-100 ease-in';

function useConfirm() {
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
            <div onClick={e => e.stopPropagation()} className="card py-8 text-center max-w-lg w-full space-y-6">
                <h3 className="text-lg font-bold">
                    {state.message}
                </h3>
                <p className="text-muted-foreground text-sm">This action <i>cannot</i> be undone.</p>
                <div className="space-x-8 font-semibold">
                    <button className={`bg-muted px-8 py-2 rounded-lg text-accent ${buttonAnimation}`} onClick={() => onClose(false)}>Cancel</button>
                    <button className={`bg-rose-500 px-8 py-2 rounded-lg text-white ${buttonAnimation}`} onMouseUp={() => onClose(true)}>Delete</button>
                </div>
            </div>
        </div>
    ) : null;
    return { confirm, modal };
}

export default useConfirm;