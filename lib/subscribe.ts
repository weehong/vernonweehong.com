/**
 * Email updates, Phase 1 (docs/design/pages.md, Subscriptions): one free
 * Buttondown newsletter that sends every post in both languages. Never enable
 * a paid plan or add-on.
 */

export type SubscribeOutcome = "done" | "invalid" | "failed";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const ENDPOINT = "https://api.buttondown.com/v1/subscribers";

export function parseSubscribeBody(
	body: unknown
): { ok: true; email: string; honeypot: boolean } | { ok: false } {
	if (typeof body !== "object" || body === null) return { ok: false };
	const record = body as Record<string, unknown>;
	const email =
		typeof record["email"] === "string" ? record["email"].trim() : "";
	const website = record["website"];
	if (email.length === 0 || email.length > 254 || !EMAIL_PATTERN.test(email))
		return { ok: false };
	return {
		ok: true,
		email,
		honeypot: typeof website === "string" && website.trim().length > 0,
	};
}

/**
 * Adds the address to the newsletter. Double opt-in stays on, so Buttondown
 * sends the confirmation email. An address that is already subscribed counts
 * as done: the form never reveals who is on the list.
 */
export async function subscribe(
	email: string,
	ipAddress: string | undefined,
	fetcher: typeof fetch = fetch
): Promise<SubscribeOutcome> {
	const key = process.env.BUTTONDOWN_API_KEY?.trim();
	if (!key) return "failed";
	const response = await fetcher(ENDPOINT, {
		method: "POST",
		headers: {
			Authorization: `Token ${key}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email_address: email,
			...(ipAddress ? { ip_address: ipAddress } : {}),
		}),
		signal: AbortSignal.timeout(10_000),
	});
	if (response.ok) return "done";
	if (response.status === 400) {
		const body = (await response.json().catch(() => ({}))) as {
			code?: unknown;
		};
		const code = typeof body.code === "string" ? body.code : "";
		return code.includes("invalid") ? "invalid" : "done";
	}
	return "failed";
}
