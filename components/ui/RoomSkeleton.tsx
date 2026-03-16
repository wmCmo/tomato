export default function RoomSkeleton() {
    return (
        <div className="grow flex g-6 flex-col lg:flex-row items-center justify-around animate-pulse">

            <div className="mt-4 bg-foreground flex flex-col items-center py-8 max-w-sm w-full rounded-lg px-12">
                <h3 className="text-center text-white bg-muted py-4 text-5xl md:text-6xl rounded-lg w-full font-display h-20"></h3>
                <div className="flex mt-8 justify-between w-full gap-2">
                    {Array.from({ length: 3 }).map((_, i) => <div key={i} className={"max-w-20 w-full h-8 bg-muted rounded-lg"}></div>)}
                </div>
                <div className="flex mt-4 justify-between w-full">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className={"w-8 h-8 bg-muted rounded-full"}></div>)}
                </div>
            </div>
        </div>
    );
}
