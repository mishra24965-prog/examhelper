import type { Config } from '@netlify/functions';
import serverless from 'serverless-http';
import { createApiApp } from '../../server/api.ts';

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
    const handler = serverless(createApiApp());
    const event = {
      version: '2.0',
      rawPath: url.pathname,
      rawQueryString: url.search.slice(1),
      headers: Object.fromEntries(request.headers),
      body: Buffer.from(await request.arrayBuffer()).toString('base64'),
      isBase64Encoded: true,
      requestContext: {
        http: { method: request.method, sourceIp: request.headers.get('x-nf-client-connection-ip') || '' },
      },
    };
    const result = await handler(event, {}) as ApiResponse;
    const headers = new Headers(result.headers);
    headers.set('cache-control', 'no-store');
    for (const cookie of result.cookies || []) {
      headers.append('set-cookie', cookie);
    }
    const body = result.isBase64Encoded ? Buffer.from(result.body, 'base64') : result.body;
    return new Response(request.method === 'HEAD' || result.statusCode === 204 || result.statusCode === 304 ? null : body, {
      status: result.statusCode,
      headers,
    });
  } catch {
    return Response.json({ error: 'API request failed' }, { status: 500 });
  }
};

export const config: Config = {
  path: '/api/*',
};
