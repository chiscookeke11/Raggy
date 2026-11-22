export default function DocumentListSkeleton() {
    return (
        <div className="w-full flex flex-col gap-4 animate-pulse">
            {[1, 2, 3, 4].map((item) => (
                <div
                    key={item}
                    className="w-full py-4 px-2 border-t border-black/10 flex flex-col gap-3"
                >
                    {/* Filename */}
                    <div className="h-5 w-3/4 rounded bg-gray-200" />

                    {/* Document metadata */}
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                </div>
            ))}
        </div>
    );
}