import { useState, useMemo } from 'react';
import {
  HiOutlineSearch, HiOutlineChevronLeft, HiOutlineChevronRight,
  HiOutlineChevronUp, HiOutlineChevronDown, HiOutlineDownload,
} from 'react-icons/hi';
import Loader from './Loader';

const DataTable = ({
  columns,
  data = [],
  loading = false,
  searchable = true,
  sortable = true,
  pagination = true,
  pageSize = 10,
  onRowClick,
  emptyMessage = 'No data found',
  actions,
  exportable = false,
  onExport,
}) => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      columns.some((col) => {
        const value = col.accessor ? row[col.accessor] : '';
        return String(value).toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [data, search, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Toolbar */}
      {(searchable || exportable || actions) && (
        <div className="flex items-center justify-between gap-4 p-4 border-b border-white/5">
          {searchable && (
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 w-64 shadow-sm transition-colors duration-300" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)' }}>
              <HiOutlineSearch className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-sm outline-none w-full"
                style={{ color: 'var(--text-main)' }}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {exportable && (
              <button onClick={onExport} className="btn-secondary flex items-center gap-2 text-xs">
                <HiOutlineDownload className="w-4 h-4" />
                Export
              </button>
            )}
            {actions}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={col.accessor || col.header}
                  className={`table-header ${sortable && col.accessor ? 'cursor-pointer select-none hover:text-gray-200' : ''}`}
                  onClick={() => col.accessor && handleSort(col.accessor)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {sortable && sortConfig.key === col.accessor && (
                      sortConfig.direction === 'asc'
                        ? <HiOutlineChevronUp className="w-3 h-3" />
                        : <HiOutlineChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <Loader className="justify-center" />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-gray-500 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <tr
                  key={row._id || i}
                  className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.accessor || col.header} className="table-cell">
                      {col.render ? col.render(row) : row[col.accessor] || '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiOutlineChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
