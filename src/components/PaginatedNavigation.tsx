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
  // Optional key whose change can shrink/grow pages immediately (e.g. active filter)
  filterKey?: string;
};

export const PaginatedNavigation = ({
  currentPage,
  totalPages,
  onPageChange,
  filterKey,
}: PaginationControlsProps) => {
  const { chainId } = useUserStore();

  const lastValidTotalPagesRef = useRef(1);
  const lastChainIdRef = useRef<number | null>(null);
  const chainChangeFrameRef = useRef(0);

  const lastFilterKeyRef = useRef<string | undefined>(undefined);
  const filterChangeFrameRef = useRef(0);

  const chainHasChanged = chainId !== lastChainIdRef.current;
  const filterHasChanged = filterKey !== lastFilterKeyRef.current;

  if (chainHasChanged) {
    lastChainIdRef.current = chainId ?? null;
    chainChangeFrameRef.current = 0;
  } else {
    chainChangeFrameRef.current++;
  }

  if (filterHasChanged) {
    lastFilterKeyRef.current = filterKey;
    filterChangeFrameRef.current = 0;
  } else {
    filterChangeFrameRef.current++;
  }

  let stableTotalPages = lastValidTotalPagesRef.current;

  const isRecentChainChange = chainChangeFrameRef.current <= 5;
  const isRecentFilterChange = filterChangeFrameRef.current <= 5;

  if (
    chainHasChanged ||
    filterHasChanged ||
    isRecentChainChange ||
    isRecentFilterChange
  ) {
    stableTotalPages = Math.max(totalPages, 1);
  } else if (totalPages > 0 && totalPages >= lastValidTotalPagesRef.current) {
    stableTotalPages = totalPages;
  }
  // Reset page if it no longer exists after filter change
  if (filterHasChanged && currentPage > stableTotalPages) {
    onPageChange(1);
  }

  lastValidTotalPagesRef.current = stableTotalPages;

  if (!stableTotalPages || stableTotalPages <= 0 || currentPage <= 0) {
    return null;
  }

  const generatePages = () => {
    const pages: (number | 'ellipsis')[] = [];

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxVisiblePages = isMobile ? 3 : 7;

    if (stableTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= stableTotalPages; i++) {
        pages.push(i);
      }
    } else if (isMobile) {
      if (currentPage === 1) {
        pages.push(1, 2, 'ellipsis', stableTotalPages);
      } else if (currentPage === stableTotalPages) {
        pages.push(1, 'ellipsis', stableTotalPages - 1, stableTotalPages);
      } else {
        pages.push(1, 'ellipsis', currentPage, 'ellipsis', stableTotalPages);
      }
    } else {
      // Desktop: full pagination logic
      pages.push(1);

      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(stableTotalPages);
      } else if (currentPage >= stableTotalPages - 2) {
        pages.push('ellipsis');
        for (let i = stableTotalPages - 3; i <= stableTotalPages; i++) {
          pages.push(i);
        }
      } else {
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
