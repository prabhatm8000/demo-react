const Pagination = ({
    onPageChange,
    currentPage,
    totalPages,
}: {
    onPageChange: (page: number) => void;
    currentPage: number;
    totalPages: number;
}) => {
    const maxVisiblePages = 5;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const startPage = Math.max(
        1,
        Math.min(
            currentPage - Math.floor(maxVisiblePages / 2),
            totalPages - maxVisiblePages + 1
        )
    );

    const visiblePages = pages.slice(
        startPage - 1,
        startPage - 1 + maxVisiblePages
    );

    return (
        <div className="flex items-center justify-center gap-4 text-gray-500 my-8">
            {totalPages > maxVisiblePages && (
                <div className="text-sm font-semibold">
                    Pages {currentPage} of {totalPages}
                </div>
            )}

            <button
                className="px-2 py-1 text-sm font-semibold"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {startPage > 1 && (
                <>
                    <button
                        className="px-2 py-1 text-sm font-semibold"
                        onClick={() => onPageChange(1)}
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="px-2">...</span>}
                </>
            )}

            {visiblePages.map((page) => (
                <button
                    key={page}
                    className={`px-2 py-1 text-sm font-semibold ${
                        page === currentPage ? "text-blue-500" : ""
                    }`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            {startPage + maxVisiblePages - 1 < totalPages && (
                <>
                    {startPage + maxVisiblePages < totalPages && (
                        <span className="px-2">...</span>
                    )}
                    <button
                        className="px-2 py-1 text-sm font-semibold"
                        onClick={() => onPageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                className="px-2 py-1 text-sm font-semibold"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
