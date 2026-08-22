import { afterEach, expect, test, vi } from "vitest";
import { getSmtpConfig, parseContactPayload } from "../lib/contact-mail";
import { isRateLimited, resetRateLimits } from "../lib/rate-limit";

afterEach(() => {
	resetRateLimits();
	vi.unstubAllEnvs();
});

test("parses a valid contact payload", () => {
	const parsed = parseContactPayload({
		name: "  Ada  ",
		email: "ada@example.com",
		message: "Hello from the form.",
	});

	expect(parsed).toEqual({
		ok: true,
		honeypot: false,
		payload: {
			name: "Ada",
			email: "ada@example.com",
			message: "Hello from the form.",
		},
	});
});

test("rejects missing fields and invalid email", () => {
	expect(parseContactPayload(null).ok).toBe(false);
	expect(parseContactPayload({ name: "Ada" }).ok).toBe(false);
	expect(
		parseContactPayload({
			name: "Ada",
			email: "not-an-email",
			message: "Hi",
		}).ok
	).toBe(false);
});

test("flags a filled honeypot without failing validation", () => {
	const parsed = parseContactPayload({
		name: "Bot",
		email: "bot@example.com",
		message: "Spam",
		website: "https://spam.example",
	});

	expect(parsed.ok).toBe(true);
	if (parsed.ok) expect(parsed.honeypot).toBe(true);
});

test("reads SMTP config from the environment", () => {
	expect(getSmtpConfig()).toBeUndefined();

	vi.stubEnv("SMTP_USER", "vernonweehongkoh@outlook.com");
	vi.stubEnv("SMTP_PASSWORD", "secret");
	const config = getSmtpConfig();

	expect(config).toMatchObject({
		host: "smtp-mail.outlook.com",
		port: 587,
		user: "vernonweehongkoh@outlook.com",
		to: "vernonweehongkoh@outlook.com",
	});
});

test("rate-limits a key after five hits in the window", () => {
	const now = 1_000_000;
	expect(isRateLimited("1.1.1.1", now)).toBe(false);
	expect(isRateLimited("1.1.1.1", now + 1)).toBe(false);
	expect(isRateLimited("1.1.1.1", now + 2)).toBe(false);
	expect(isRateLimited("1.1.1.1", now + 3)).toBe(false);
	expect(isRateLimited("1.1.1.1", now + 4)).toBe(false);
	expect(isRateLimited("1.1.1.1", now + 5)).toBe(true);
	expect(isRateLimited("2.2.2.2", now + 5)).toBe(false);
});
