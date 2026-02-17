import { Link } from "react-router";
import BackToHome from "../components/BackToHome";

export default function NotFoundPage() {
    return (
        <div className="text-accent px-8 space-y-4">
            <h1 className="text-5xl text-center">404</h1>
            <p className="text-center">👀 Maybe I'm not what you're looking for?</p>
            <div className="flex items-center justify-center gap-4">
                <p className="text-xs text-center">Try navigating back to</p>
                <BackToHome />
            </div>
        </div>
    );
}
