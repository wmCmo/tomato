import { Link, useOutletContext } from "react-router";
import BackToHome from "../components/BackToHome";

export default function NotFoundPage() {
    const { dict } = useOutletContext();
    return (
        <div className="text-accent px-8 space-y-4">
            <h1 className="text-5xl text-center">404</h1>
            <p className="text-center">👀 {dict.notFound.desc}</p>
            <div className="flex items-center justify-center gap-4">
                <p className="text-xs text-center">{dict.notFound.suggest}</p>
                <BackToHome />
            </div>
        </div>
    );
}
