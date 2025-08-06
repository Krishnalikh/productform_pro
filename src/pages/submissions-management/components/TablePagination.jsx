import React from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 25,
  onPageChange = () => {},
  onItemsPerPageChange = () => {}
}) => {
  const itemsPerPageOptions = [
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' }
  ];

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range?.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots?.push(1, '...');
    } else {
      rangeWithDots?.push(1);
    }

    rangeWithDots?.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots?.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots?.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalItems === 0) return null;

  return (
    <div className="bg-card border-t border-border px-4 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Items per page selector */}
        <div className="flex items-center space-x-3">
          <Select
            options={itemsPerPageOptions}
            value={itemsPerPage}
            onChange={onItemsPerPageChange}
            className="w-36"
          />
          <span className="text-sm text-muted-foreground">
            Showing {startItem?.toLocaleString()} to {endItem?.toLocaleString()} of {totalItems?.toLocaleString()} results
          </span>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center space-x-2">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            iconName="ChevronLeft"
            iconSize={16}
            className="w-9 h-9 p-0"
          />

          {/* Page numbers - Desktop */}
          <div className="hidden sm:flex items-center space-x-1">
            {getVisiblePages()?.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-sm text-muted-foreground">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-9 h-9 p-0"
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Page info - Mobile */}
          <div className="flex sm:hidden items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            iconName="ChevronRight"
            iconSize={16}
            className="w-9 h-9 p-0"
          />
        </div>
      </div>
      {/* Quick jump - Desktop only */}
      <div className="hidden lg:flex items-center justify-center mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">Jump to page:</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="text-xs"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, currentPage - 10))}
              disabled={currentPage <= 10}
              className="text-xs"
            >
              -10
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 10))}
              disabled={currentPage > totalPages - 10}
              className="text-xs"
            >
              +10
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="text-xs"
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;