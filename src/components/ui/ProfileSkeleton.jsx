const CardSkeletonWHeader = () => {
    return (
        <section className="mt-8 space-y-4 flex-1">
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <div className="h-6 w-40 bg-foreground rounded-lg"></div>
                </div>
            </div>
            <div className="flex gap-1 justify-center md:justify-around px-4 md:px-16 py-8 bg-foreground rounded-lg">
            </div>
        </section >
    );
};

const ProfileSkeleton = () => {
    return (
        <div className='text-accent w-full px-2 mt-12 animate-pulse'>
            <div className="sm:flex justify-between gap-8">
                <section className="flex gap-6 items-center relative">
                    <div className="h-20 w-20 rounded-full bg-foreground"></div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between sm:gap-8">
                            <div className="h-6 w-40 bg-foreground rounded-lg"></div>
                        </div>
                        <div className="h-12 w-48 bg-foreground rounded-lg"></div>
                    </div>
                </section>
                <section className="mt-8 py-8 bg-foreground rounded-lg flex items-center flex-grow">
                </section>
            </div>
            <div className="md:flex gap-16">
                <CardSkeletonWHeader />
                <CardSkeletonWHeader />
            </div>
        </div >
    );
};

export default ProfileSkeleton;
