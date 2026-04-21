import { type NextRequest, NextResponse } from "next/server";

const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"]);

function getBackendBaseUrl(): string {
  const backendUrl = process.env.API_INTERNAL_BASE_URL;

  if (!backendUrl) {
    throw new Error("Missing API_INTERNAL_BASE_URL environment variable.");
  }

  return backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
}

function buildTargetUrl(pathSegments: string[], request: NextRequest): string {
  const baseUrl = getBackendBaseUrl();
  const path = pathSegments.map(encodeURIComponent).join("/");
  const query = request.nextUrl.search;

  return `${baseUrl}/${path}${query}`;
}

function createForwardHeaders(request: NextRequest): Headers {
  const headers = new Headers(request.headers);

  headers.delete("host");
  headers.delete("content-length");

  return headers;
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  try {
    const { path } = await context.params;
    const targetUrl = buildTargetUrl(path, request);
    const method = request.method;

    const response = await fetch(targetUrl, {
      method,
      headers: createForwardHeaders(request),
      body: METHODS_WITHOUT_BODY.has(method) ? undefined : await request.text(),
      redirect: "manual",
      cache: "no-store",
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);

    return NextResponse.json(
      { message: "No se pudo conectar con el backend." },
      { status: 502 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return proxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return proxyRequest(request, context);
}

export async function OPTIONS(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return proxyRequest(request, context);
}

export async function HEAD(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return proxyRequest(request, context);
}
