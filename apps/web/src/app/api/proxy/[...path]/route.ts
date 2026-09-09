import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, buildProxyHeaders } from "@/lib/server/apiProxy";

async function forward(request: NextRequest, path: string[]) {
	try {
		const targetUrl = `${API_BASE_URL}/${path.join("/")}${request.nextUrl.search}`;

		const headers = new Headers();

		const contentType = request.headers.get("content-type");
		if (contentType) headers.set("content-type", contentType);

		// The user's own JWT — distinct from the app-key above, safe to pass
		// through as-is since it's per-user, not a shared secret.
		const authHeader = request.headers.get("authorization");
		if (authHeader) headers.set("authorization", authHeader);

		for (const [key, value] of Object.entries(buildProxyHeaders())) {
			headers.set(key, value);
		}

		const hasBody = !["GET", "HEAD"].includes(request.method);
		// Buffered rather than streamed straight through — a streamed request
		// body needs `duplex: "half"` on Node's fetch, which can be flaky
		// under Turbopack dev. Fine at this app's request sizes (JSON only,
		// so far).
		const body = hasBody ? await request.arrayBuffer() : undefined;

		const upstreamResponse = await fetch(targetUrl, {
			method: request.method,
			headers,
			body,
		});

		const responseBody = await upstreamResponse.arrayBuffer();

		return new NextResponse(responseBody, {
			status: upstreamResponse.status,
			headers: {
				"content-type":
					upstreamResponse.headers.get("content-type") ?? "application/json",
			},
		});
	} catch (error) {
		console.error("Proxy request failed:", error);

		return NextResponse.json(
			{
				statusCode: 502,
				message: "Failed to reach the API. Please try again.",
				timestamp: new Date().toISOString(),
			},
			{ status: 502 },
		);
	}
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
	const { path } = await params;
	return forward(request, path);
}

export async function POST(request: NextRequest, { params }: RouteContext) {
	const { path } = await params;
	return forward(request, path);
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
	const { path } = await params;
	return forward(request, path);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
	const { path } = await params;
	return forward(request, path);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
	const { path } = await params;
	return forward(request, path);
}
