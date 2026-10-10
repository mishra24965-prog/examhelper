import type { Config } from '@netlify/functions';
import serverless from 'serverless-http';
import { createApiApp } from '../../server/api.ts';

const app = createApiApp();
const serverlessHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  try {
    return await serverlessHandler(event, context);
  } catch (err: any) {
    console.error('Netlify Function Error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ error: 'API request failed', message: err?.message || 'Server error' })
    };
  }
};

export default async (request: any, context: any) => {
  // Check if standard Web Request (Netlify Functions v2)
  if (request && typeof request.text === 'function') {
    try {
      const url = new URL(request.url);
      const headers: Record<string, string> = {};
      if (request.headers && typeof request.headers.forEach === 'function') {
        request.headers.forEach((val: string, key: string) => {
          headers[key.toLowerCase()] = val;
        });
      }

      let bodyStr = '';
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        try {
          bodyStr = await request.text();
        } catch {
          bodyStr = '';
        }
      }

      const event = {
        httpMethod: request.method || 'POST',
        path: url.pathname,
        rawPath: url.pathname,
        queryStringParameters: Object.fromEntries(url.searchParams.entries()),
        headers,
        body: bodyStr,
        isBase64Encoded: false,
        requestContext: {
          http: {
            method: request.method || 'POST',
            path: url.pathname
          }
        }
      };

      const result: any = await serverlessHandler(event, context || {});
      const responseHeaders = new Headers(result.headers || {});
      responseHeaders.set('Cache-Control', 'no-store');

      const resBody = result.isBase64Encoded ? Buffer.from(result.body, 'base64').toString('utf-8') : (result.body || '');

      return new Response(resBody, {
        status: result.statusCode || 200,
        headers: responseHeaders
      });
    } catch (err: any) {
      console.error('Netlify Functions v2 Request Error:', err);
      return Response.json(
        { error: 'API request failed', message: err?.message || 'Server error' },
        { status: 500 }
      );
    }
  }

  // Otherwise delegate to standard AWS Lambda handler
  return handler(request, context);
};

export const config: Config = {
  path: '/api/*',
};
