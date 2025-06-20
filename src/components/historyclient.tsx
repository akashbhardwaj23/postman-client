'use client';

import { useState, useEffect } from 'react';

interface HistoricalRequestSummary {
  id: number;
  method: string;
  url: string;
  statusCode?: number;
  timestamp: string;
}

interface HistoryListClientProps {
  initialHistory: HistoricalRequestSummary[];
  initialTotal: number;
  onSelectHistoryItem: (id: number) => void;
  onDeleteHistoryItem: (id: number) => void;
}

const HISTORY_LIMIT = 10;

export default function HistoryListClient ({
  initialHistory,
  initialTotal,
  onSelectHistoryItem,
  onDeleteHistoryItem,
} : HistoryListClientProps){
  const [history, setHistory] = useState<HistoricalRequestSummary[]>(initialHistory);
  const [total, setTotal] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalPages = Math.ceil(total / HISTORY_LIMIT);

  const fetchHistory = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/requests?page=${page}&limit=${HISTORY_LIMIT}`);
      if (!res.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await res.json();
      setHistory(data.requests);
      setTotal(data.total);
      setCurrentPage(data.page);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setHistory(initialHistory);
    setTotal(initialTotal);
    setCurrentPage(1);
  }, [initialHistory, initialTotal]);


  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchHistory(page);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this history item?');
    if (!confirmDelete) return;

    try {
      await onDeleteHistoryItem(id);
      await fetchHistory(history.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage);
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {isLoading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <p>No request history found.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {history.map((item) => (
              <li
                key={item.id}
                className="bg-gray-50 p-4 rounded-md border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-semibold px-2 py-1 text-xs rounded-full ${
                        item.statusCode && item.statusCode >= 200 && item.statusCode < 300
                          ? 'bg-green-100 text-green-800'
                          : item.statusCode && (item.statusCode >= 400 || item.statusCode === 0)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.method} {item.statusCode ? `(${item.statusCode})` : ''}
                    </span>
                    <span className="text-sm text-gray-500 truncate max-w-[calc(100%-120px)]">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-blue-700 break-all mt-1">{item.url}</p>
                </div>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => onSelectHistoryItem(item.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
