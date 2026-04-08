import { NextResponse } from "next/server";

const UPSTREAM =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_URL ||
  "http://localhost:8080";

function buildUpstreamUrl(pathParts: string[], requestUrl: URL) {
  const base = UPSTREAM.replace(/\/+$/, "");
  const path = pathParts.map(encodeURIComponent).join("/");
  const qs = requestUrl.search ? requestUrl.search : "";
  return `${base}/${path}${qs}`;
}

async function proxy(req: Request, params: { path: string[] }) {
  const url = new URL(req.url);
  const upstreamUrl = buildUpstreamUrl(params.path, url);

  const headers = new Headers(req.headers);
  // Ensure upstream receives JSON; preserve Authorization if present.
  headers.set("content-type", headers.get("content-type") || "application/json");
  headers.delete("host");

  const init: RequestInit = {
    method: req.method,
    headers,
    // GET/HEAD must not include body
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.text(),
    redirect: "manual",
  };

  const upstreamRes = await fetch(upstreamUrl, init);
  const resHeaders = new Headers(upstreamRes.headers);
  resHeaders.delete("set-cookie");

  const text = await upstreamRes.text();
  return new NextResponse(text, {
    status: upstreamRes.status,
    headers: resHeaders,
  });
}

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params);
}
export async function POST(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params);
}
export async function PUT(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params);
}
export async function PATCH(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params);
}
export async function DELETE(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params);
}

