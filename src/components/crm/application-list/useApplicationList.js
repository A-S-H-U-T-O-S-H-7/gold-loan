'use client';

import { useEffect, useState } from 'react';

export default function useApplicationList(loadApplications) {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, total_pages: 0 });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState('');
  const [dates, setDates] = useState({ start: '', end: '' });
  const [branchId, setBranchId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadApplications({
      page,
      per_page: perPage,
      ...(search ? searchField && searchField !== 'all'
        ? { search_by: searchField, search_value: search }
        : { search } : {}),
      date_from: dates.start,
      date_to: dates.end,
      ...(branchId ? { branch_id: branchId } : {}),
    }).then((result) => {
      if (!active) return;
      setApplications(result.data || []);
      setPagination(result.pagination || { total: 0, total_pages: 0 });
      setError('');
    }).catch((requestError) => {
      if (!active) return;
      setApplications([]);
      setPagination({ total: 0, total_pages: 0 });
      setError(requestError.response?.data?.message || requestError.message || 'Could not load applications');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [loadApplications, page, perPage, search, searchField, dates.start, dates.end, branchId, refreshKey]);

  return {
    applications, pagination, page, perPage, search, dates, branchId, loading, error,
    setPage,
    setPerPage: (size) => { setPage(1); setPerPage(size); },
    setSearch: (value, field = '') => { setPage(1); setSearch(value); setSearchField(field); },
    setDates: (value) => { setPage(1); setDates(value); },
    setBranchId: (value) => { setPage(1); setBranchId(value); },
    refresh: () => setRefreshKey((key) => key + 1),
  };
}
