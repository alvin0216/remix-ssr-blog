import { renderToString } from 'react-dom/server';
import { RemixServer } from 'remix';

import type { EntryContext } from 'remix';

// 加载环境变量 默认加载 .env
require('dotenv').config();

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(<RemixServer context={remixContext} url={request.url} />);

  responseHeaders.set('Content-Type', 'text/html');

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
