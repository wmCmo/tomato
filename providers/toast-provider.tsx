'use client';

import { AtIcon, CheckCircleIcon, CloudXIcon, FileXIcon, IconContext, ShieldWarningIcon, WarningDiamondIcon, XCircleIcon } from '@phosphor-icons/react';
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
    title: string | undefined; desc: string; variant: keyof typeof toastIcons; onDismiss?: () => void; id: number;
}

export type ToastOptions = Omit<ToastProps, 'id' | 'onDismiss'> & {
    duration?: number;
};

interface ToastContextType {
    toast: {
        (options: ToastOptions): void;
        (title: string | undefined, desc: string, variant: keyof typeof toastIcons, duration?: number): void;
    };
}

export const ToastProviderContext = createContext<ToastContextType | undefined>(undefined);

export const toastIcons = {
    errorDb: <CloudXIcon />,
    errorAuth: <ShieldWarningIcon />,
    errorFile: <FileXIcon />,
    errorDuplicatedKey: <AtIcon />,
    success: <CheckCircleIcon />,
};


const Toast = ({ title, desc, variant, onDismiss }: ToastProps) => (
    <div className='flex card items-center px-4 py-2 gap-4 backdrop-blur-3xl font-display text-accent max-w-xs'>
        <IconContext.Provider value={{
            weight: "fill",
            size: "1.5rem"
        }}>
            <div className={variant === 'success' ? 'text-blue-500' : variant == "errorDuplicatedKey" ? "text-yellow-400" : 'text-rose-400'}>
                {toastIcons[variant] ?? <WarningDiamondIcon />}
            </div>
        </IconContext.Provider >
        <div className='text-accent'>
            <h4 className='font-bold'>{title}</h4>
            <p className='text-xs'>{desc}</p>
        </div>
        <button type="button" className='pointer-events-auto ml-auto' onClick={onDismiss}>
            <XCircleIcon weight='fill' className='icon' />
        </button>
    </div>
);

const ToastProvider = ({ children, ...props }: { children: React.ReactElement; }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const nextToastIdRef = useRef(0);
    const toastTimeoutsRef = useRef(new Map());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => {
            for (const timeoutId of toastTimeoutsRef.current.values()) {
                clearTimeout(timeoutId);
            }
            toastTimeoutsRef.current.clear();
        };
    }, []);

    const handleShiftToasts = useCallback((id: number) => {
        const timeoutId = toastTimeoutsRef.current.get(id);
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
            toastTimeoutsRef.current.delete(id);
        }
        setToasts(prev => prev.filter(item => item.id !== id));
    }, []);

    const toast = useCallback(((arg1: ToastOptions | string | undefined, arg2?: string, arg3?: keyof typeof toastIcons, arg4?: number) => {
        const options: ToastOptions =
            typeof arg1 === 'object' && arg1 !== null
                ? arg1
                : {
                    title: arg1,
                    desc: arg2 ?? '',
                    variant: arg3 ?? 'errorFile',
                    duration: arg4
                };

        const { title = 'New Toasts', desc, variant, duration = 3 } = options;
        const id = nextToastIdRef.current++;
        setToasts(prev => [...prev, { title: variant.startsWith('error') ? 'Error' : title, desc, variant, id }]);
        const timeoutId = setTimeout(() => {
            handleShiftToasts(id);
        }, duration * 1000);
        toastTimeoutsRef.current.set(id, timeoutId);
    }) as ToastContextType['toast'], [handleShiftToasts]);

    const value = useMemo(() => ({ toast }), [toast]);

    return (
        <ToastProviderContext.Provider value={value} {...props}>
            {children}
            {mounted && createPortal(
                <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none' aria-live='polite'>
                    {toasts.map(toast => (
                        <Toast key={toast.id} {...toast} onDismiss={() => handleShiftToasts(toast.id)} />
                    ))}
                </div>,
                document.body)}
        </ToastProviderContext.Provider>
    );
};

export default ToastProvider;
