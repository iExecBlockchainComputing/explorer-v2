import { useRef } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import useUserStore from '@/stores/useUser.store';

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const PaginatedNavigation = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  const { chainId } = useUserStore();

  const lastValidTotalPagesRef = useRef(1);
  const lastChainIdRef = useRef<number | null>(null);
  const chainChangeFrameRef = useRef(0);

  const chainHasChanged = chainId !== lastChainIdRef.current;

  if (chainHasChanged) {
    lastChainIdRef.current = chainId ?? null;
    chainChangeFrameRef.current = 0;
  } else {
    chainChangeFrameRef.current++;
  }

  let stableTotalPages = lastValidTotalPagesRef.current;

  const isRecentChainChange = chainChangeFrameRef.current <= 5;

  if (chainHasChanged || isRecentChainChange) {
    stableTotalPages = Math.max(totalPages, 1);
  } else if (totalPages > 0 && totalPages >= lastValidTotalPagesRef.current) {
    stableTotalPages = totalPages;
  }

  lastValidTotalPagesRef.current = stableTotalPages;

  // Don't render pagination if no pages or invalid state
  if (!stableTotalPages || stableTotalPages <= 0 || currentPage <= 0) {
    return null;
  }

  const generatePages = () => {
    const pages: (number | 'ellipsis')[] = [];

    // Mobile-first approach: show fewer pages on small screens
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxVisiblePages = isMobile ? 3 : 7;

    if (stableTotalPages <= maxVisiblePages) {
      // Show all pages if within limit
      for (let i = 1; i <= stableTotalPages; i++) {
        pages.push(i);
      }
    } else if (isMobile) {
      // Mobile: simplified pagination - only show current and neighbors
      if (currentPage === 1) {
        // At start: 1 2 ... last
        pages.push(1, 2, 'ellipsis', stableTotalPages);
      } else if (currentPage === stableTotalPages) {
        // At end: 1 ... (last-1) last
        pages.push(1, 'ellipsis', stableTotalPages - 1, stableTotalPages);
      } else {
        // Middle: 1 ... current ... last
        pages.push(1, 'ellipsis', currentPage, 'ellipsis', stableTotalPages);
      }
    } else {
      // Desktop: full pagination logic
      pages.push(1);

      if (currentPage <= 3) {
        // Near beginning: 1 2 3 4 ... last
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(stableTotalPages);
      } else if (currentPage >= stableTotalPages - 2) {
        // Near end: 1 ... (last-3) (last-2) (last-1) last
        pages.push('ellipsis');
        for (let i = stableTotalPages - 3; i <= stableTotalPages; i++) {
          pages.push(i);
        }
      } else {
        // In middle: 1 ... (current-1) current (current+1) ... last
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(stableTotalPages);
      }
    }

    return pages;
  };

  const pages = generatePages();

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < stableTotalPages) onPageChange(currentPage + 1);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={
              currentPage === 1 ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>

        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={
              currentPage === stableTotalPages
                ? 'pointer-events-none opacity-50'
                : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
