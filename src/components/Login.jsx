import { useOutletContext } from "react-router";
import { useToast } from "../hooks/useToast";
import { signInWithGoogle } from "../lib/supabase";

const LoginComponent = () => {
    const { dict } = useOutletContext();
    const { toast } = useToast();
    return (
        <div className="flex justify-center">
            <div className='text-accent bg-extreme p-8 rounded-xl flex flex-col gap-8 max-w-96 border border-border'>
                <div className="flex flex-col items-center gap-2">
                    <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Tomato/Color/tomato_color.svg" alt="Tomato logo" className="h-16 w-auto" />
                    <h1 className='font-bold text-2xl text-center'>{dict.login.header}</h1>
                </div>
                <div className="flex justify-center">
                    <button onClick={() => signInWithGoogle(toast, dict.error.signIn)} className='bg-background rounded-md flex px-6 py-3 gap-4 items-center'>
                        <img className='w-6' src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg" alt="Google Logo" />
                        <p className='font-medium'>{dict.login.google}</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
