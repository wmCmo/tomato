function OnePerson() {
    return (
        <div className="mt-4 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-foreground"></div>
                <div className="h-8 w-40 bg-foreground rounded-lg"></div>
                <div className="h-8 w-20 bg-foreground rounded-full"></div>
            </div>
            <hr className="mt-4 border-border" />
        </div>
    );
}

function ConnectionsSkeleton() {
    return (
        <div>
            {Array.from({ length: 5 }).map((_, i) => <OnePerson key={i} />)}
        </div>
    );
}

export default ConnectionsSkeleton;
