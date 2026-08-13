'use client';

import { useMemo, useState } from 'react';

export function useCrmList(items, { searchKeys = ['id'], pageSize: initialSize = 10 } = {}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialSize);
  const [filters, setFilters] = useState({});

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (items || []).filter((item) => {
      const matchesSearch =
        !q ||
        searchKeys.some((key) => {
          const raw = key.split('.').reduce((acc, part) => acc?.[part], item);
          return String(raw || '').toLowerCase().includes(q);
        });

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        const raw = key.split('.').reduce((acc, part) => acc?.[part], item);
        return String(raw) === String(value);
      });

      return matchesSearch && matchesFilters;
    });
  }, [items, search, filters, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return {
    search,
    setSearch: (value) => {
      setSearch(value);
      setPage(1);
    },
    page: safePage,
    setPage,
    pageSize,
    setPageSize: (size) => {
      setPageSize(size);
      setPage(1);
    },
    filters,
    setFilter,
    filtered,
    paged,
    totalPages,
    totalItems: filtered.length,
  };
}

export function csvExport(filename, rows, columns) {
  const header = columns.map((c) => c.label).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const value = c.export ? c.export(row) : row[c.key];
          return `"${String(value ?? '').replace(/"/g, '""')}"`;
        })
        .join(',')
    )
    .join('\n');
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
