import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1
}) => {
  const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, 'DOTS', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, 'DOTS', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, 'DOTS', ...middleRange, 'DOTS', lastPageIndex];
    }
  }, [totalPages, siblingCount, currentPage]);

  if (currentPage === 0 || totalPages < 2) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 p-2">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-border/20 text-foreground/40 hover:bg-border/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      {paginationRange?.map((pageNumber, idx) => {
        if (pageNumber === 'DOTS') {
          return (
            <div key={`dots-${idx}`} className="px-3 py-2 text-foreground/20">
              <MoreHorizontal size={16} />
            </div>
          );
        }

        const isCurrent = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(Number(pageNumber))}
            className={`
              min-w-[40px] h-[40px] rounded-xl text-[11px] font-black transition-all
              ${isCurrent 
                ? 'bg-[#E07A5F] text-white shadow-lg shadow-primary/20 scale-110' 
                : 'bg-white border border-border/10 text-foreground/60 hover:border-primary/40 hover:text-primary'}
            `}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-border/20 text-foreground/40 hover:bg-border/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
