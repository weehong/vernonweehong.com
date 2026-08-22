import nodemailer from "nodemailer";

export type ContactPayload = {
	name: string;
	email: string;
	message: string;
};

export type SmtpConfig = {
	host: string;
	port: number;
	user: string;
	password: string;
	to: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
const DEFAULT_HOST = "smtp-mail.outlook.com";
const DEFAULT_PORT = 587;
const DEFAULT_TO = "vernonweehongkoh@outlook.com";
const CONNECTION_TIMEOUT_MS = 5_000;
const SEND_TIMEOUT_MS = 10_000;

function asTrimmedString(
	value: unknown,
	maxLength: number
): string | undefined {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	if (trimmed.length === 0 || trimmed.length > maxLength) return undefined;
	return trimmed;
}

export function parseContactPayload(
	body: unknown
):
	| { ok: true; payload: ContactPayload; honeypot: boolean }
	| { ok: false; error: string } {
	if (typeof body !== "object" || body === null) {
		return { ok: false, error: "Invalid request." };
	}

	const record = body as Record<string, unknown>;
	const website = record["website"];
	const honeypot = typeof website === "string" && website.trim().length > 0;

	const name = asTrimmedString(record["name"], MAX_NAME);
	const email = asTrimmedString(record["email"], MAX_EMAIL);
	const message = asTrimmedString(record["message"], MAX_MESSAGE);

	if (!name || !email || !message) {
		return { ok: false, error: "Name, email and message are required." };
	}
	if (!EMAIL_PATTERN.test(email)) {
		return { ok: false, error: "Enter a valid email address." };
	}

	return { ok: true, payload: { name, email, message }, honeypot };
}

export function getSmtpConfig(): SmtpConfig | undefined {
	const user = process.env.SMTP_USER?.trim();
	const password = process.env.SMTP_PASSWORD?.trim();
	if (!user || !password) return undefined;

	const portValue = process.env.SMTP_PORT?.trim();
	const port = portValue ? Number(portValue) : DEFAULT_PORT;
	if (!Number.isInteger(port) || port <= 0) return undefined;

	return {
		host: process.env.SMTP_HOST?.trim() || DEFAULT_HOST,
		port,
		user,
		password,
		to: process.env.CONTACT_TO?.trim() || DEFAULT_TO,
	};
}

export async function sendContactMail(
	payload: ContactPayload,
	config: SmtpConfig | undefined = getSmtpConfig()
): Promise<void> {
	if (!config) {
		throw new Error("SMTP is not configured.");
	}

	const transport = nodemailer.createTransport({
		host: config.host,
		port: config.port,
		secure: config.port === 465,
		requireTLS: config.port !== 465,
		connectionTimeout: CONNECTION_TIMEOUT_MS,
		greetingTimeout: CONNECTION_TIMEOUT_MS,
		socketTimeout: SEND_TIMEOUT_MS,
		auth: {
			user: config.user,
			pass: config.password,
		},
	});

	let timeout: ReturnType<typeof setTimeout> | undefined;
	try {
		await Promise.race([
			transport.sendMail({
				from: `"Portfolio contact" <${config.user}>`,
				to: config.to,
				replyTo: `"${payload.name.replaceAll('"', "")}" <${payload.email}>`,
				subject: `Portfolio enquiry from ${payload.name}`,
				text: `${payload.message}\n\n— ${payload.name} (${payload.email})`,
			}),
			new Promise<never>((_, reject) => {
				timeout = setTimeout(
					() => {
						reject(new Error("SMTP send timed out."));
					},
					SEND_TIMEOUT_MS
				);
			}),
		]);
	} finally {
		if (timeout) clearTimeout(timeout);
		transport.close();
	}
}
