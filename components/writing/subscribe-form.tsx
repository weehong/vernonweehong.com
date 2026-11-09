"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useId, useState } from "react";
import { buttonClasses } from "@/components/ui/buttons";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill } from "@/lib/i18n/locales";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

async function post(input: {
	email: string;
	website: string;
}): Promise<string> {
	const response = await fetch("/api/subscribe", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	if (response.ok) return input.email;
	const body = (await response.json().catch(() => ({}))) as { error?: string };
	throw new Error(body.error === "invalid" ? "invalid" : "failed");
}

/** Email sign-up on the marker panel (one newsletter, both languages). */
export function SubscribeForm({
	text,
	privacyHref,
	feedHref,
}: {
	readonly text: Dictionary["subscribe"];
	readonly privacyHref: string;
	readonly feedHref: string;
}): React.ReactElement {
	const id = useId();
	const mutation = useMutation({ mutationFn: post });
	const [badAddress, setBadAddress] = useState(false);

	if (mutation.isSuccess) {
		return (
			<div
				role="status"
				className="flex flex-col gap-1.5 rounded-[8px] bg-raised p-5 text-ink"
			>
				<p className="font-display text-xl font-bold">{text.doneTitle}</p>
				<p className="text-body-sm text-ink-soft">
					{fill(text.doneText, { email: mutation.data })}
				</p>
			</div>
		);
	}

	const invalid = badAddress || mutation.error?.message === "invalid";
	return (
		<form
			noValidate
			className="flex flex-col gap-2.5"
			onSubmit={(event) => {
				event.preventDefault();
				const form = new FormData(event.currentTarget);
				const field = (name: string): string => {
					const value = form.get(name);
					return typeof value === "string" ? value : "";
				};
				const email = field("email").trim();
				if (!EMAIL_PATTERN.test(email)) {
					mutation.reset();
					setBadAddress(true);
					return;
				}
				setBadAddress(false);
				mutation.mutate({
					email,
					website: field("website"),
				});
			}}
		>
			<label htmlFor={`${id}-email`} className="text-body-sm font-medium">
				{text.label}
			</label>
			<div className="flex flex-wrap gap-2">
				<input
					id={`${id}-email`}
					name="email"
					type="email"
					autoComplete="email"
					placeholder="you@example.com"
					aria-invalid={invalid || undefined}
					className="box-border min-h-12 min-w-0 flex-[1_1_220px] rounded-sm border-2 border-marker-ink bg-raised px-3.5 font-sans text-base text-ink"
				/>
				<button
					type="submit"
					disabled={mutation.isPending}
					className={`ml-auto ${buttonClasses.onMarkerSubmit}`}
				>
					{mutation.isPending ? text.sending : text.button}
				</button>
			</div>
			<input
				type="text"
				name="website"
				tabIndex={-1}
				autoComplete="off"
				aria-hidden
				className="hidden"
			/>
			{(invalid || mutation.isError) && (
				<p role="alert" className="text-small font-semibold">
					{invalid ? text.error : text.retry}
				</p>
			)}
			<p className="font-mono text-label normal-case tracking-normal leading-[1.6]">
				{text.fine}{" "}
				<Link href={privacyHref} className="underline underline-offset-3">
					{text.privacy}
				</Link>{" "}
				·{" "}
				<a href={feedHref} className="underline underline-offset-3">
					{text.rss}
				</a>
			</p>
		</form>
	);
}
