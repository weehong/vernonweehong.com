"use client";

import { useEffect, useState } from "react";

const themeKey = "vwhk-theme";

export function ThemeToggle(): React.ReactElement {
	function toggleTheme(): void {
		const nextDark = !document.documentElement.classList.contains("dark");
		document.documentElement.classList.toggle("dark", nextDark);
		document.documentElement.classList.toggle("light", !nextDark);
		window.localStorage.setItem(themeKey, nextDark ? "dark" : "light");
	}

	return (
		<button
			className="theme-toggle"
			type="button"
			onClick={toggleTheme}
			aria-label="Toggle dark mode"
		>
			<span aria-hidden="true" />
		</button>
	);
}

export function ContactForm(): React.ReactElement {
	const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
		"idle"
	);
	const [errorMessage, setErrorMessage] = useState("");

	async function submit(
		event: React.FormEvent<HTMLFormElement>
	): Promise<void> {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);
		const nameValue = data.get("name");
		const emailValue = data.get("email");
		const messageValue = data.get("message");
		const websiteValue = data.get("website");
		const name = typeof nameValue === "string" ? nameValue : "";
		const email = typeof emailValue === "string" ? emailValue : "";
		const message = typeof messageValue === "string" ? messageValue : "";
		const website = typeof websiteValue === "string" ? websiteValue : "";

		setStatus("sending");
		setErrorMessage("");

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, message, website }),
			});
			const result: unknown = await response.json().catch(() => null);
			if (!response.ok) {
				const errorText =
					typeof result === "object" &&
					result !== null &&
					"error" in result &&
					typeof result.error === "string"
						? result.error
						: "Could not send the message. Try again later.";
				setErrorMessage(errorText);
				setStatus("error");
				return;
			}
			form.reset();
			setStatus("sent");
		} catch {
			setErrorMessage("Could not send the message. Try again later.");
			setStatus("error");
		}
	}

	return (
		<form className="contact-form" onSubmit={submit}>
			<label htmlFor="cf-name">Name</label>
			<input id="cf-name" name="name" type="text" required maxLength={100} />
			<label htmlFor="cf-email">Email</label>
			<input id="cf-email" name="email" type="email" required maxLength={254} />
			<label htmlFor="cf-website" className="honeypot">
				Website
			</label>
			<input
				id="cf-website"
				name="website"
				type="text"
				tabIndex={-1}
				autoComplete="off"
				className="honeypot"
			/>
			<label htmlFor="cf-message">Message</label>
			<textarea id="cf-message" name="message" required maxLength={5000} />
			<div className="form-action">
				<button type="submit" disabled={status === "sending"}>
					{status === "sending" ? "Sending…" : "Send message"}
				</button>
				{status === "sent" ? (
					<span role="alert">Thanks — your message is on its way.</span>
				) : null}
				{status === "error" ? (
					<span role="alert" data-tone="error">
						{errorMessage}
					</span>
				) : null}
			</div>
		</form>
	);
}

export function PortfolioEffects(): null {
	useEffect(() => {
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sections = Array.from(
			document.querySelectorAll<HTMLElement>("[data-reveal]")
		);
		const spyLinks = Array.from(
			document.querySelectorAll<HTMLAnchorElement>("[data-spy]")
		);
		let revealObserver: IntersectionObserver | undefined;
		let spyObserver: IntersectionObserver | undefined;
		let frame = 0;
		let resizeFrame = 0;

		const setCardMinHeights = (): void => {
			document.querySelectorAll<HTMLElement>("[data-card-stack]").forEach(
				(stack) => {
					stack.style.removeProperty("--stack-card-height");
					if (window.innerWidth < 1024) return;

					const firstCard = stack.querySelector<HTMLElement>(":scope > .card");
					const height = firstCard?.getBoundingClientRect().height ?? 0;
					if (height > 0)
						stack.style.setProperty("--stack-card-height", `${String(height)}px`);
				}
			);
		};
		const onResize = (): void => {
			if (resizeFrame) cancelAnimationFrame(resizeFrame);
			resizeFrame = requestAnimationFrame(() => {
				resizeFrame = 0;
				setCardMinHeights();
			});
		};

		setCardMinHeights();
		void document.fonts?.ready.then(setCardMinHeights);
		window.addEventListener("resize", onResize);

		const showSection = (section: HTMLElement): void => {
			section.dataset["visible"] = "true";
			section
				.querySelectorAll<HTMLElement>("[data-stagger] > *")
				.forEach((item) => {
					item.dataset["visible"] = "true";
				});
		};

		if (reducedMotion.matches || !("IntersectionObserver" in window)) {
			sections.forEach(showSection);
		} else {
			document.documentElement.classList.add("motion-ready");
			revealObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) return;
						showSection(entry.target as HTMLElement);
						revealObserver?.unobserve(entry.target);
					});
				},
				{ threshold: 0.12 }
			);
			sections.forEach((section) => revealObserver?.observe(section));
		}

		const setActive = (id: string): void => {
			spyLinks.forEach((link) => {
				link.dataset["active"] = String(link.dataset["spy"] === id);
			});
		};
		if ("IntersectionObserver" in window) {
			spyObserver = new IntersectionObserver(
				(entries) => {
					const visible = entries
						.filter((entry) => entry.isIntersecting)
						.sort(
							(a, b) => a.boundingClientRect.top - b.boundingClientRect.top
						);
					if (visible[0]) setActive(visible[0].target.id);
				},
				{ rootMargin: "-20% 0px -60% 0px" }
			);
			spyLinks.forEach((link) => {
				const target = document.getElementById(link.dataset["spy"] ?? "");
				if (target) spyObserver?.observe(target);
			});
		}

		const paint = (): void => {
			frame = 0;
			const y = window.scrollY;
			document.querySelectorAll<HTMLElement>("[data-blob]").forEach((blob) => {
				blob.style.transform = `translate3d(0, ${String(y * 0.15)}px, 0)`;
			});
			const image = document.querySelector<HTMLElement>("[data-parallax-img]");
			const frameElement = document.querySelector<HTMLElement>(
				"[data-parallax-frame]"
			);
			if (image && frameElement) {
				const rect = frameElement.getBoundingClientRect();
				const middle = rect.top + rect.height / 2 - window.innerHeight / 2;
				image.style.transform = `translate3d(0, ${String(middle * -0.12)}px, 0)`;
			}
		};
		const onScroll = (): void => {
			if (!frame && !reducedMotion.matches)
				frame = requestAnimationFrame(paint);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		paint();

		return (): void => {
			revealObserver?.disconnect();
			spyObserver?.disconnect();
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onResize);
			if (frame) cancelAnimationFrame(frame);
			if (resizeFrame) cancelAnimationFrame(resizeFrame);
			document.documentElement.classList.remove("motion-ready");
		};
	}, []);

	return null;
}
