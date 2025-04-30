import { cn } from '@/lib/utils.ts';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination.tsx';

interface PaginatedNavigationProps {
  className?: string;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationItemLink = ({
  page,
  isActive,
  onClick,
}: {
  page: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <PaginationItem key={page}>
    <PaginationLink
      className="rounded-lg"
      isActive={isActive}
      onClick={onClick}
    >
      {page + 1}
    </PaginationLink>
  </PaginationItem>
);

const generatePaginationItems = (
  totalPages: number,
  currentPage: number,
  onPageChange: (page: number) => void
) => {
  const items: JSX.Element[] = [];

  const maxVisiblePages = 3;
  const boundaryThreshold = 1;
  const minimumPagesForEllipsis = 3;

  const firstPage = 0;
  const lastPage = totalPages - 1;

  const showStartEllipsis = currentPage > boundaryThreshold;
  const showEndEllipsis = currentPage < totalPages - boundaryThreshold - 1;

  if (!showStartEllipsis) {
    const isFirstPage = currentPage === firstPage;
    let endPage = Math.min(maxVisiblePages, totalPages);
    if (isFirstPage) {
      endPage++;
    }
    for (let i = 0; i < endPage; i++) {
      items.push(
        <PaginationItemLink
          key={i}
          page={i}
          isActive={currentPage === i}
          onClick={() => onPageChange(i)}
        />
      );
    }

    if (totalPages > maxVisiblePages) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
      items.push(
        <PaginationItemLink
          key={lastPage}
          page={lastPage}
          isActive={false}
          onClick={() => onPageChange(lastPage)}
        />
      );
    }
  } else if (!showEndEllipsis) {
    if (totalPages >= minimumPagesForEllipsis && currentPage !== 2) {
      items.push(
        <PaginationItemLink
          key={firstPage}
          page={firstPage}
          isActive={false}
          onClick={() => onPageChange(firstPage)}
        />
      );
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    for (let i = totalPages - maxVisiblePages; i < totalPages; i++) {
      items.push(
        <PaginationItemLink
          key={i}
          page={i}
          isActive={currentPage === i}
          onClick={() => onPageChange(i)}
        />
      );
    }
  } else {
    const middlePages = [currentPage - 1, currentPage, currentPage + 1].filter(
      (p) => p >= 0 && p < totalPages
    );

    items.push(
      <PaginationItemLink
        key={firstPage}
        page={firstPage}
        isActive={false}
        onClick={() => onPageChange(firstPage)}
      />
    );
    items.push(
      <PaginationItem key="ellipsis-start">
        <PaginationEllipsis />
      </PaginationItem>
    );

    middlePages.forEach((page) => {
      items.push(
        <PaginationItemLink
          key={page}
          page={page}
          isActive={currentPage === page}
          onClick={() => onPageChange(page)}
        />
      );
    });

    items.push(
      <PaginationItem key="ellipsis-end">
        <PaginationEllipsis />
      </PaginationItem>
    );
    items.push(
      <PaginationItemLink
        key={lastPage}
        page={lastPage}
        isActive={false}
        onClick={() => onPageChange(lastPage)}
      />
    );
  }

  return items;
};

export function PaginatedNavigation({
  className,
  totalPages,
  currentPage,
  onPageChange,
}: PaginatedNavigationProps) {
  return (
    <Pagination className={cn(className, 'py-4')}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="rounded-lg"
            disabled={currentPage <= 0}
            onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
          />
        </PaginationItem>
        {generatePaginationItems(totalPages, currentPage, onPageChange)}
        <PaginationItem>
          <PaginationNext
            className="rounded-lg"
            disabled={currentPage >= totalPages - 1}
            onClick={() =>
              currentPage < totalPages - 1 && onPageChange(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
