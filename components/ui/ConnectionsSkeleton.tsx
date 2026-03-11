function OnePerson() {
    return (
        <div className="mt-4 animate-pulse w-full max-w-lg px-4">
            <div className="flex items-center gap-4 justify-between">
                <div className="flex gap-2 grow">
                    <div className="h-8 w-8 rounded-full bg-foreground shrink-0"></div>
                    <div className="h-8 w-full max-w-40 bg-foreground rounded-lg"></div>
                </div>
                <div className="h-8 w-20 bg-foreground rounded-full"></div>
            </div>
            <hr className="mt-4 border-border border" />
        </div>
    );
}

function ConnectionsSkeleton() {
    return (
        <div className="grow flex flex-col justify-center px-4 items-center">
            {Array.from({ length: 5 }).map((_, i) => <OnePerson key={i} />)}
        </div>
    );
}

export default ConnectionsSkeleton;
