import { parseContactPayload, sendContactMail } from "@/lib/contact-mail";
import { clientAddress } from "@/lib/request";
import { isRateLimited } from "@/lib/rate-limit";

export const maxDuration = 15;

/**
 * Contact form. Errors are codes (`invalid`, `tooMany`, `failed`); the form
 * shows the matching dictionary text in the visitor's edition.
 */
export async function POST(request: Request): Promise<Response> {
	if (isRateLimited(`contact:${clientAddress(request)}`)) {
		return Response.json({ error: "tooMany" }, { status: 429 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "invalid" }, { status: 400 });
	}

	const parsed = parseContactPayload(body);
	if (!parsed.ok)
		return Response.json({ error: parsed.error }, { status: 400 });
	if (parsed.honeypot) return Response.json({ ok: true });

	try {
		await sendContactMail(parsed.payload);
	} catch {
		return Response.json({ error: "failed" }, { status: 502 });
	}
	return Response.json({ ok: true });
}
