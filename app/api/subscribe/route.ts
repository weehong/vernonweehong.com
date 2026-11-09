import { isRateLimited } from "@/lib/rate-limit";
import { clientAddress } from "@/lib/request";
import { parseSubscribeBody, subscribe } from "@/lib/subscribe";

export const maxDuration = 15;

/** `POST { email }`. Answers `{ ok }` or `{ error: "invalid" | "failed" }`. */
export async function POST(request: Request): Promise<Response> {
	const address = clientAddress(request);
	if (isRateLimited(`subscribe:${address}`)) {
		return Response.json({ error: "failed" }, { status: 429 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "invalid" }, { status: 400 });
	}

	const parsed = parseSubscribeBody(body);
	if (!parsed.ok) return Response.json({ error: "invalid" }, { status: 400 });
	if (parsed.honeypot) return Response.json({ ok: true });

	try {
		const outcome = await subscribe(
			parsed.email,
			address === "unknown" ? undefined : address
		);
		if (outcome === "done") return Response.json({ ok: true });
		return Response.json(
			{ error: outcome },
			{ status: outcome === "invalid" ? 400 : 502 }
		);
	} catch {
		return Response.json({ error: "failed" }, { status: 502 });
	}
}
