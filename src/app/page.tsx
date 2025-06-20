// src/app/page.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import RequestForm from '@/components/requestform'
import ResponseDisplay from '@/components/response'
import HistoryListClient from '@/components/historyclient'

interface HistoricalRequestSummary {
  id: number;
  method: string;
  url: string;
  statusCode?: number;
  timestamp: string;
}

interface FullHistoricalRequestDetails {
  id: number;
  method: string;
  url: string;
  requestHeaders?: object;
  requestBody?: string;
  statusCode?: number;
  responseHeaders?: object;
  responseBody?: string;
  timestamp: string;
}

export default function HomePage() {
  const [currentResponse, setCurrentResponse] = useState<any>(null);
  const [currentRequest, setCurrentRequest] = useState<{
    method: string;
    url: string;
    headers: object;
    body: string;
  }>({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    headers: { 'Content-Type': 'application/json' },
    body: '',
  });

  const [initialHistoryData, setInitialHistoryData] = useState<{
    requests: HistoricalRequestSummary[];
    total: number;
  }>({ requests: [], total: 0 });

  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    const fetchInitialHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const res = await fetch('/api/requests?page=1&limit=10');
        if (!res.ok) {
          throw new Error('Failed to fetch initial history');
        }
        const data = await res.json();
        setInitialHistoryData({
          requests: data.requests,
          total: data.total,
        });
      } catch (error) {
        console.error('Error fetching initial history:', error);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    fetchInitialHistory();
  }, []);

  const handleSelectHistoryItem = useCallback(
    async (id: number) => {
      try {
        const res = await fetch(`/api/requests/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch history item details');
        }
        const data: FullHistoricalRequestDetails = await res.json();

        setCurrentRequest({
          method: data.method,
          url: data.url,
          headers: data.requestHeaders || {},
          body: data.requestBody || '',
        });

        let responseBodyForDisplay: any;
        try {
            responseBodyForDisplay = data.responseBody ? JSON.parse(data.responseBody) : '';
        } catch(e) {
            responseBodyForDisplay = data.responseBody || '';
        }

        setCurrentResponse({
          statusCode: data.statusCode || 0,
          headers: data.responseHeaders || {},
          body: responseBodyForDisplay,
          isError: data.statusCode && data.statusCode >= 400 || data.statusCode === 0
        });

      } catch (error) {
        console.error('Error loading history item:', error);
        alert('Could not load history item: ' + error);
      }
    },
    []
  );

  const handleSendRequest = useCallback(
    async (requestDetails: {
      method: string;
      url: string;
      headers: object;
      body: string;
    }) => {
      setCurrentResponse(null);
      try {
        const res = await fetch('/api/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestDetails),
        });

        const data = await res.json();
        setCurrentResponse({
          statusCode: data.statusCode,
          headers: data.headers,
          body: data.body,
          isError: data.statusCode && data.statusCode >= 400 || data.statusCode === 0
        });

        handleHistoryRefetchRequired();

      } catch (error: any) {
        console.error('Network or client-side error sending request:', error);
        setCurrentResponse({
          statusCode: 0,
          headers: {},
          body: { message: `Network Error: ${error.message}. Please check URL and connectivity.` },
          isError: true,
        });
      }
    },
    []
  );

  const handleHistoryRefetchRequired = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const res = await fetch('/api/requests?page=1&limit=10');
      if (!res.ok) {
        throw new Error('Failed to re-fetch history');
      }
      const data = await res.json();
      setInitialHistoryData({
        requests: data.requests,
        total: data.total,
      });
    } catch (error) {
      console.error('Error re-fetching history:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  const handleDeleteHistoryItem = useCallback(
    async (id: number) => {
      try {
        const res = await fetch(`/api/requests/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error('Failed to delete history item');
        }
        handleHistoryRefetchRequired();
      } catch (error) {
        console.error('Error deleting history item:', error);
        alert('Failed to delete history item: ' + error);
      }
    },
    [handleHistoryRefetchRequired]
  );

  return (
    <div className="container mx-auto p-4 md:grid md:grid-cols-2 gap-8 min-h-screen bg-gray-100">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          ⚡ REST Client
        </h1>
        <RequestForm
          initialRequest={currentRequest}
          onSendRequest={handleSendRequest}
          key={currentRequest.url + currentRequest.method}
        />
        <ResponseDisplay response={currentResponse} />
      </div>

      <div className="flex flex-col gap-6 mt-8 md:mt-0">
        <h2 className="text-2xl font-bold text-gray-700">Request History</h2>
        {isHistoryLoading ? (
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center min-h-[200px]">
            <p className="text-gray-500">Loading history...</p>
          </div>
        ) : (
          <HistoryListClient
            initialHistory={initialHistoryData.requests}
            initialTotal={initialHistoryData.total}
            onSelectHistoryItem={handleSelectHistoryItem}
            onDeleteHistoryItem={handleDeleteHistoryItem}
          />
        )}
      </div>
    </div>
  );
}