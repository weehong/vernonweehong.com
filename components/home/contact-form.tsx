"use client";

import { useMutation } from "@tanstack/react-query";
import { useId } from "react";
import { buttonClasses } from "@/components/ui/buttons";
import { ArrowIcon } from "@/components/ui/icons";

export type ContactFormText = {
	readonly name: string;
	readonly email: string;
	readonly message: string;
	readonly send: string;
	readonly sending: string;
	readonly sent: string;
	readonly invalid: string;
	readonly tooMany: string;
	readonly error: string;
};

type ErrorCode = "invalid" | "tooMany" | "failed";

async function send(form: FormData): Promise<void> {
	const response = await fetch("/api/contact", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(Object.fromEntries(form)),
	});
	if (response.ok) return;
	const body = (await response.json().catch(() => ({}))) as {
		error?: ErrorCode;
	};
	throw new Error(body.error ?? "failed");
}

const labelClass = "flex flex-col gap-1.5 text-body-sm font-medium";
const fieldClass =
	"box-border min-h-12 rounded-sm border border-night-line bg-transparent px-3.5 py-3 font-sans text-base text-on-night placeholder:text-on-night-soft";

/** The contact form on the night panel. */
export function ContactForm({
	text,
}: {
	readonly text: ContactFormText;
}): React.ReactElement {
	const id = useId();
	const mutation = useMutation({ mutationFn: send });
	const errorText =
		(
			{ invalid: text.invalid, tooMany: text.tooMany } as Record<
				string,
				string | undefined
			>
		)[mutation.error?.message ?? ""] ?? text.error;

	return (
		<form
			className="relative flex min-w-0 flex-[1_1_380px] flex-col gap-4"
			onSubmit={(event) => {
				event.preventDefault();
				const form = event.currentTarget;
				mutation.mutate(new FormData(form), {
					onSuccess: () => {
						form.reset();
					},
				});
			}}
		>
			<div className="flex flex-wrap gap-4">
				<label
					htmlFor={`${id}-name`}
					className={`flex-[1_1_180px] ${labelClass}`}
				>
					{text.name}
					<input
						id={`${id}-name`}
						name="name"
						autoComplete="name"
						required
						maxLength={100}
						className={fieldClass}
					/>
				</label>
				<label
					htmlFor={`${id}-email`}
					className={`flex-[1_1_180px] ${labelClass}`}
				>
					{text.email}
					<input
						id={`${id}-email`}
						name="email"
						type="email"
						autoComplete="email"
						required
						maxLength={254}
						className={fieldClass}
					/>
				</label>
			</div>
			<label htmlFor={`${id}-message`} className={labelClass}>
				{text.message}
				<textarea
					id={`${id}-message`}
					name="message"
					rows={5}
					required
					maxLength={5000}
					className={`resize-y ${fieldClass}`}
				/>
			</label>
			{/* Honeypot: hidden from people, filled in by bots. */}
			<input
				type="text"
				name="website"
				tabIndex={-1}
				autoComplete="off"
				aria-hidden
				className="hidden"
			/>
			{mutation.isSuccess && (
				<p role="status" className="text-small font-semibold">
					{text.sent}
				</p>
			)}
			{mutation.isError && (
				<p role="alert" className="text-small font-semibold">
					{errorText}
				</p>
			)}
			<button
				type="submit"
				disabled={mutation.isPending}
				className={`self-end ${buttonClasses.onNightSubmit}`}
			>
				{mutation.isPending ? text.sending : text.send}
				<ArrowIcon />
			</button>
		</form>
	);
}
