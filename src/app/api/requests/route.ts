import { NextRequest, NextResponse } from 'next/server';
import { getOrm } from '@/lib/db';
import { HistoricalRequest } from '@/lib/entities';
import { wrap } from '@mikro-orm/core';

export async function GET(req: NextRequest) {
  const orm = await getOrm();
  if (!orm) {
    return NextResponse.json({ message: 'Database not initialized' }, { status: 500 });
  }
  const em = orm.em.fork();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    const [requests, total] = await em.findAndCount(
      HistoricalRequest,
      {},
      {
        orderBy: { timestamp: 'DESC' },
        limit,
        offset,
        fields: ['id', 'method', 'url', 'statusCode', 'timestamp'],
      }
    );

    const serializedRequests = requests.map(r => wrap(r).toObject());

    return NextResponse.json({
      requests: serializedRequests,
      total,
      page,
      limit,
    });
  } catch (error : unknown ) {
    console.error('API GET /requests error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch historical requests', error: error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const orm = await getOrm();
  if (!orm) {
    return NextResponse.json({ message: 'Database not initialized' }, { status: 500 });
  }
  const em = orm.em.fork();

  try {
    const { method, url, headers, body } = await req.json();

    if (!url || !method) {
      return NextResponse.json(
        { message: 'URL and Method are required' },
        { status: 400 }
      );
    }

    let externalResponse;
    let responseText = '';
    let responseStatus = 0;
    let responseHeaders = {};

    try {
      externalResponse = await fetch(url, {
        method,
        headers: headers || {},
        body: body ? JSON.stringify(body) : undefined,
      });

      responseText = await externalResponse.text();
      responseStatus = externalResponse.status;
      responseHeaders = Object.fromEntries(externalResponse.headers.entries());
    } catch (fetchError: unknown) {
      console.error('External fetch error:', fetchError);
      responseText = `Network Error: ${fetchError}`;
      responseStatus = 0;
    }

    const newHistory = new HistoricalRequest(method, url);
    newHistory.requestHeaders = headers || {};
    newHistory.requestBody = body ? JSON.stringify(body) : '';
    newHistory.statusCode = responseStatus;
    newHistory.responseHeaders = responseHeaders;
    newHistory.responseBody = responseText;

    await em.persistAndFlush(newHistory);

    let responseBodyForClient;
    try {
      responseBodyForClient = JSON.parse(responseText);
    } catch (e) {
      console.log("Error is ", e)
      responseBodyForClient = responseText;
    }

    return NextResponse.json(
      {
        statusCode: responseStatus,
        headers: responseHeaders,
        body: responseBodyForClient,
      },
      { status: responseStatus || 200 }
    );
  } catch (error: unknown) {
    console.error('API POST /requests error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error },
      { status: 500 }
    );
  }
}