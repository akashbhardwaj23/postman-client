'use client';

import React, { useState, useEffect } from 'react';

interface ResponseDisplayProps {
  response: {
    statusCode: number;
    headers: object;
    body: any;
    isError?: boolean;
  } | null;
}

export default function ResponseDisplay ({ response } : ResponseDisplayProps) {
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');
  const [formattedBody, setFormattedBody] = useState<string>('');

  useEffect(() => {
    if (response?.body) {
      if (typeof response.body === 'object') {
        setFormattedBody(JSON.stringify(response.body, null, 2));
      } else {
        setFormattedBody(String(response.body));
      }
    } else {
      setFormattedBody('');
    }
  }, [response?.body]);

  if (!response) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md min-h-[200px] flex items-center justify-center text-gray-500">
        No response yet.
      </div>
    );
  }

  const statusCodeColor = response.statusCode >= 200 && response.statusCode < 300
    ? 'text-green-600'
    : response.statusCode >= 400 || response.statusCode === 0 // Include 0 for network errors
    ? 'text-red-600'
    : 'text-gray-600';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Response</h3>
      <div className="flex items-center space-x-4 mb-4">
        <span className={`text-xl font-bold ${statusCodeColor}`}>
          Status: {response.statusCode}
        </span>
        {response.isError && (
          <span className="text-red-500 font-medium"> (Error)</span>
        )}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('body')}
            className={`${
              activeTab === 'body'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
          >
            Body
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`${
              activeTab === 'headers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
          >
            Headers
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'body' && (
          <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-96 font-mono">
            {formattedBody || '(No Body)'}
          </pre>
        )}
        {activeTab === 'headers' && (
          <div className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-96 font-mono">
            {Object.entries(response.headers).length > 0 ? (
              Object.entries(response.headers).map(([key, value]) => (
                <p key={key} className="mb-1">
                  <span className="font-semibold">{key}:</span> {String(value)}
                </p>
              ))
            ) : (
              <p>(No Headers)</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
