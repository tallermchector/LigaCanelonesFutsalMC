import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function BlogPagination({ currentPage, totalPages, basePath }: Props) {
  const prevPage = currentPage > 1 ? (currentPage === 2 ? basePath : `${basePath}/page/${currentPage - 1}`) : undefined;
  const nextPage = currentPage < totalPages ? `${basePath}/page/${currentPage + 1}` : undefined;

  const renderPageNumbers = () => {
    const pages = [];
    // Show first page, last page, current page, and pages around current page
    const pagesToShow = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);

    let lastPage = 0;
    for (let i = 1; i <= totalPages; i++) {
      if (pagesToShow.has(i)) {
        if (lastPage > 0 && i > lastPage + 1) {
          pages.push(<PaginationEllipsis key={`ellipsis-${lastPage}`} />);
        }
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink href={i === 1 ? basePath : `${basePath}/page/${i}`} isActive={i === currentPage}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
        lastPage = i;
      }
    }
    return pages;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
            <PaginationPrevious href={prevPage} />
        </PaginationItem>
        
        {renderPageNumbers()}
        
        <PaginationItem>
            <PaginationNext href={nextPage} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
