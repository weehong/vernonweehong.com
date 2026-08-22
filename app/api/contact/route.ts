import { parseContactPayload, sendContactMail } from "@/lib/contact-mail";
import { isRateLimited } from "@/lib/rate-limit";

export const maxDuration = 15;

function clientAddress(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) {
		const first = forwarded.split(",")[0]?.trim();
		if (first) return first;
	}
	return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request): Promise<Response> {
	if (isRateLimited(clientAddress(request))) {
		return Response.json(
			{ error: "Too many messages. Try again later." },
			{ status: 429 }
		);
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Invalid request." }, { status: 400 });
	}

	const parsed = parseContactPayload(body);
	if (!parsed.ok) {
		return Response.json({ error: parsed.error }, { status: 400 });
	}
	if (parsed.honeypot) {
		return Response.json({ ok: true });
	}

	try {
		await sendContactMail(parsed.payload);
	} catch {
		return Response.json(
			{ error: "Could not send the message. Try again later." },
			{ status: 502 }
		);
	}

	return Response.json({ ok: true });
}
