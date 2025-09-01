import { useState, useEffect, useCallback } from 'react';

export const usePagination = (fetchFunction, initialPageSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async (page = currentPage, size = pageSize) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        page_size: size,
        search: searchTerm,
        ...filters,
      };

      const response = await fetchFunction(params);
      
      setData(response.data.results || []);
      setTotalItems(response.data.count || 0);
      setTotalPages(Math.ceil((response.data.count || 0) / size));
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, currentPage, pageSize, searchTerm, filters]);

  useEffect(() => {
    fetchData(1, pageSize);
  }, [searchTerm, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page, pageSize);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    fetchData(1, newSize);
  };

  const refresh = () => {
    fetchData(currentPage, pageSize);
  };

  return {
    data,
    loading,
    error,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    filters,
    searchTerm,
    setFilters,
    setSearchTerm,
    handlePageChange,
    handlePageSizeChange,
    refresh,
  };
};
