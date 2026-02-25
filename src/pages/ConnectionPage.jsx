import { useState } from "react";
import { useSearchParams } from "react-router";

export default function ConnectionPage() {
    const [searchParams] = useSearchParams();
    const [view, setView] = useState(searchParams.get('view'));

    return (
        <div className="text-accent relative">
            <nav className="bg-background sticky top-24 w-full">
                <div className="text-xl flex bg-foreground rounded-full p-2">
                    <button className="px-6 py-2 bg-muted rounded-full font-bold">フォロー中</button>
                    <button className="px-6 py-2 text-muted-foreground">フォロワー</button>
                </div>
            </nav>
        </div>
    );
}
