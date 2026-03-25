import { useState, useCallback } from 'react';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const usePagination = (initialLimit = 12) => {
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: initialLimit,
    totalPages: 1
  });

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleResponse = useCallback((responseMeta: PaginationMeta) => {
    setMeta(responseMeta);
    if (responseMeta.page !== page) {
      setPage(responseMeta.page);
    }
  }, [page]);

  return {
    page,
    setPage,
    meta,
    setMeta,
    onPageChange,
    handleResponse
  };
};
