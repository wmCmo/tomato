import { useToast } from "@/hooks/useToast";

const { toast } = useToast();
type ToastType = typeof toast;
export default ToastType;
