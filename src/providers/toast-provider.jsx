import { CloudXIcon, FileXIcon, IconContext, ShieldWarningIcon, WarningDiamondIcon, XCircleIcon } from '@phosphor-icons/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ToastProviderContext } from './toast-context';

const Toast = ({ title, desc, variant, onDismiss }) => (
    < div className='flex card items-center px-4 py-2 gap-4 backdrop-blur-3xl font-display text-accent max-w-xs'>
        <IconContext.Provider value={{
            weight: "fill",
            size: "1.5rem"
        }}>
            <div className='text-rose-400'>
                {
                    variant === 'errorDb' ? <CloudXIcon /> :
                        variant === 'errorAuth' ? <ShieldWarningIcon /> :
                            variant === 'errorFile' ? <FileXIcon /> : <WarningDiamondIcon />
                }
            </div>
        </IconContext.Provider >
        <div className='text-accent'>
            <h4 className='font-bold'>{title}</h4>
            <p className='text-xs'>{desc}</p>
        </div>
        <button className='pointer-events-auto ml-auto' onClick={onDismiss}>
            <XCircleIcon weight='fill' className='icon' />
        </button>
    </div>
);

const ToastProvider = ({ children, ...props }) => {
    const [toasts, setToasts] = useState([]);
    const nextToastIdRef = useRef(0);

    const handleShiftToasts = useCallback((id) => {
        setToasts(prev => prev.filter(item => item.id !== id));
    }, []);

    const toast = useCallback((title = 'New Toasts', desc, variant, duration = 3) => {
        const id = nextToastIdRef.current++;
        setToasts(prev => [...prev, { title: variant.startsWith('error') ? 'Error' : title, desc, variant, id }]);
        setTimeout(() => {
            handleShiftToasts(id);
        }, duration * 1000);
    }, [handleShiftToasts]);

    const value = useMemo(() => ({ toast }), [toast]);

    return (
        <ToastProviderContext.Provider value={value} {...props}>
            {children}
            {typeof document !== 'undefined' && createPortal(
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
