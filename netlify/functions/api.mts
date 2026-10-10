import type { Config } from '@netlify/functions';
import serverless from 'serverless-http';
import { createApiApp } from '../../server/api.ts';

const app = createApiApp();
const handler = serverless(app);

type ApiResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  cookies?: string[];
  body: string;
  isBase64Encoded?: boolean;
};

export default async (request: Request) => {
  try {
    const url = new URL(request.url);
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    let bodyStr = '';
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        bodyStr = await request.text();
      } catch {
        bodyStr = '';
      }
    }

    const event = {
      version: '2.0',
      rawPath: url.pathname,
      rawQueryString: url.search.slice(1),
      headers,
      body: bodyStr,
      isBase64Encoded: false,
      requestContext: {
        http: {
          method: request.method,
          path: url.pathname,
          protocol: 'HTTP/1.1',
          sourceIp: headers['x-nf-client-connection-ip'] || '127.0.0.1',
          userAgent: headers['user-agent'] || '',
        },
      },
    };

    const result = (await handler(event as any, {} as any)) as ApiResponse;
    const responseHeaders = new Headers(result.headers || {});
    responseHeaders.set('cache-control', 'no-store');

    for (const cookie of result.cookies || []) {
      responseHeaders.append('set-cookie', cookie);
    }

    const resBody = result.isBase64Encoded ? Buffer.from(result.body, 'base64') : result.body;

    return new Response(
      request.method === 'HEAD' || result.statusCode === 204 || result.statusCode === 304 ? null : resBody,
      {
        status: result.statusCode || 200,
        headers: responseHeaders,
      }
    );
  } catch (error: any) {
    console.error('Netlify API Function Error:', error);
    return Response.json(
      { error: 'API request failed', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
};

export const config: Config = {
  path: '/api/*',
};
