const targetHost = "https://github.com"

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const headers = new Headers(req.headers);
  headers.set("host", targetHost); // 这句不是很有必要

  const body = new Uint8Array(await req.arrayBuffer());
  const options = {
    method: req.method,
    headers,
    body: body.length === 0 ? null : body,
  };

  const targetUrl = `${targetHost}${url.pathname}${url.search}`;
  const response = await fetch(targetUrl, options);

  const responseBody = new Uint8Array(await response.arrayBuffer());
  const proxyHeaders = new Headers(response.headers);
  proxyHeaders.set("access-control-allow-origin", "*");

  return new Response(responseBody.length === 0 ? null : responseBody, {
    status: response.status,
    headers: proxyHeaders,
  });
})