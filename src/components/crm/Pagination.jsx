'use client';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  totalItems,
  itemsPerPage,
  pageSizeOptions = [10, 20, 50, 100, 150, 200],
  className = ''
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border bg-background-secondary/50 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-foreground-muted">Show:</label>
          <select
            id="pageSize"
            value={itemsPerPage}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
            className="px-2 py-1.5 rounded-lg text-sm border border-border bg-surface text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-foreground-muted">
          {totalItems > 0 ? (
            <>Showing <span className="font-medium text-foreground">{startItem}-{endItem}</span> of <span className="font-medium text-foreground">{totalItems}</span></>
          ) : (
            <span>No results</span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalItems === 0}
          className="px-3 py-2 rounded-lg text-sm font-medium border border-border disabled:opacity-50 hover:bg-surface-hover"
        >
          Previous
        </button>
        {totalItems > 0 ? getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              page === currentPage
                ? 'bg-primary text-white'
                : page === '...'
                  ? 'cursor-default'
                  : 'hover:bg-surface-hover'
            }`}
          >
            {page}
          </button>
        )) : (
          <span className="px-3 py-2 text-sm text-foreground-muted">-</span>
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalItems === 0}
          className="px-3 py-2 rounded-lg text-sm font-medium border border-border disabled:opacity-50 hover:bg-surface-hover"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
