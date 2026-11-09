import { afterEach, describe, expect, it, vi } from "vitest";
import { parseSubscribeBody, subscribe } from "@/lib/subscribe";

const reply = (status: number, body: unknown = {}): typeof fetch =>
	vi.fn(async () => Response.json(body, { status })) as unknown as typeof fetch;

describe("subscribe", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("validates the email and catches the honeypot", () => {
		expect(parseSubscribeBody({ email: "a@b.co" })).toEqual({
			ok: true,
			email: "a@b.co",
			honeypot: false,
		});
		expect(parseSubscribeBody({ email: "nope" })).toEqual({ ok: false });
		expect(parseSubscribeBody({ email: "a@b.co", website: "x" })).toMatchObject(
			{
				honeypot: true,
			}
		);
	});

	it("adds the address to the one newsletter, without tags", async () => {
		vi.stubEnv("BUTTONDOWN_API_KEY", "key");
		const fetcher = reply(201);
		expect(await subscribe("a@b.co", "1.2.3.4", fetcher)).toBe("done");
		const [, init] = vi.mocked(fetcher).mock.calls[0] ?? [];
		expect((init?.headers as Record<string, string>)["Authorization"]).toBe(
			"Token key"
		);
		expect(JSON.parse(String(init?.body))).toEqual({
			email_address: "a@b.co",
			ip_address: "1.2.3.4",
		});
	});

	it("never reveals that an address is already subscribed", async () => {
		vi.stubEnv("BUTTONDOWN_API_KEY", "key");
		expect(
			await subscribe(
				"a@b.co",
				undefined,
				reply(400, { code: "email_already_exists" })
			)
		).toBe("done");
		expect(
			await subscribe(
				"a@b.co",
				undefined,
				reply(400, { code: "email_invalid" })
			)
		).toBe("invalid");
		expect(await subscribe("a@b.co", undefined, reply(500))).toBe("failed");
	});

	it("fails safely without an API key", async () => {
		expect(await subscribe("a@b.co", undefined, reply(201))).toBe("failed");
	});
});
