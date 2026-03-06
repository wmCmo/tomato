function OneRecord() {
    return (
        <div className="flex justify-between">
            <div className="w-20 h-4 bg-muted rounded-lg"></div>
            <div className="flex gap-4">
                <div className="h-4 w-4 rounded-full bg-muted"></div>
                <div className="w-12 h-4 rounded-lg bg-muted"></div>
            </div>
        </div>
    );
}

function OneMonth() {
    return (
        <div className="animate-pulse w-full flex flex-col items-center">
            <div className="max-w-lg w-full">
                <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-muted rounded-full"></div>
                    <div className="w-24 h-6 bg-muted rounded-lg"></div>
                </div>
                <div className="card mt-4 px-8 py-8 space-y-6">
                    {Array.from({ length: 4 }).map((_, i) => <OneRecord key={i} />)}
                </div>
            </div>
        </div>
    );
}

function RecordsSkeleton() {
    return (
        <div className="w-full space-y-8 pt-24">
            <OneMonth />
            <OneMonth />
        </div>
    );
};

export default RecordsSkeleton;
