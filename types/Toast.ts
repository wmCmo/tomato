import { toastIcons, ToastOptions } from "@/providers/toast-provider";

interface ToastType {
    (options: ToastOptions): void;
    (
        title: string | undefined,
        desc: string,
        variant: keyof typeof toastIcons,
        duration?: number
    ): void;
};

export default ToastType;
