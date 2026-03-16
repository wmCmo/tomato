import { ToastProviderContext } from "@/providers/toast-provider";
import { useContext } from "react";

export default function useToast() {
    const context = useContext(ToastProviderContext);

    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider.");
    }

    return context;
};
