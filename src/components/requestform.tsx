'use client';

import { useState, useEffect } from 'react';

interface RequestFormProps {
  initialRequest?: {
    method: string;
    url: string;
    headers: object;
    body: string;
  };
  onSendRequest: (request: {
    method: string;
    url: string;
    headers: object;
    body: string;
  }) => void;
}

const RequestForm: React.FC<RequestFormProps> = ({
  initialRequest,
  onSendRequest,
}) => {
  const [method, setMethod] = useState(initialRequest?.method || 'GET');
  const [url, setUrl] = useState(initialRequest?.url || '');
  const [headers, setHeaders] = useState(
    JSON.stringify(initialRequest?.headers || {}, null, 2)
  );
  const [body, setBody] = useState(initialRequest?.body || '');
  const [isSending, setIsSending] = useState(false);
  const [headerError, setHeaderError] = useState<string | null>(null);
  const [bodyError, setBodyError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRequest) {
      setMethod(initialRequest.method);
      setUrl(initialRequest.url);
      setHeaders(JSON.stringify(initialRequest.headers || {}, null, 2));
      setBody(initialRequest.body || '');
      setHeaderError(null);
      setBodyError(null);
    }
  }, [initialRequest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setHeaderError(null);
    setBodyError(null);

    let parsedHeaders: object = {};
    let parsedBody: string = body;

    try {
      if (headers.trim()) {
        parsedHeaders = JSON.parse(headers);
      }
    } catch (err) {
      setHeaderError('Invalid JSON in Headers');
      return;
    }

    if (
      body.trim() &&
      ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())
    ) {
      try {
        parsedBody = JSON.parse(body);
      } catch (err) {
        setBodyError('Invalid JSON in Body');
        return;
      }
    }

    setIsSending(true);
    try {
      await onSendRequest({ method, url, headers: parsedHeaders, body: parsedBody });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="method" className="block text-sm font-medium text-gray-700">
          Method
        </label>
        <select
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
          <option>PATCH</option>
          <option>HEAD</option>
          <option>OPTIONS</option>
        </select>
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          URL
        </label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/data"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="headers" className="block text-sm font-medium text-gray-700">
          Headers (JSON)
        </label>
        <textarea
          id="headers"
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          rows={5}
          className={`mt-1 block w-full border ${headerError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono`}
          placeholder='{\n  "Content-Type": "application/json"\n}'
        ></textarea>
        {headerError && <p className="text-red-500 text-xs mt-1">{headerError}</p>}
      </div>

      {['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && (
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">
            Body (JSON or Text)
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className={`mt-1 block w-full border ${bodyError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono`}
            placeholder='{\n  "name": "New Item",\n  "value": 123\n}'
          ></textarea>
          {bodyError && <p className="text-red-500 text-xs mt-1">{bodyError}</p>}
        </div>
      )}

      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={isSending}
      >
        {isSending ? 'Sending...' : 'Send Request'}
      </button>
    </form>
  );
};

export default RequestForm;