import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { ContactForm } from "../components/portfolio-interactions";

afterEach(() => {
	vi.unstubAllGlobals();
});

test("posts the contact form and shows a success message", async () => {
	const fetchMock = vi.fn().mockResolvedValue({
		ok: true,
		json: async (): Promise<{ ok: true }> => ({ ok: true }),
	});
	vi.stubGlobal("fetch", fetchMock);

	render(<ContactForm />);
	fireEvent.change(screen.getByLabelText("Name"), {
		target: { value: "Ada" },
	});
	fireEvent.change(screen.getByLabelText("Email"), {
		target: { value: "ada@example.com" },
	});
	fireEvent.change(screen.getByLabelText("Message"), {
		target: { value: "Hello" },
	});
	fireEvent.click(screen.getByRole("button", { name: "Send message" }));

	await waitFor(() => {
		expect(
			screen.getByText("Thanks — your message is on its way.")
		).toBeInTheDocument();
	});

	expect(fetchMock).toHaveBeenCalledWith(
		"/api/contact",
		expect.objectContaining({ method: "POST" })
	);
	const body = JSON.parse(
		(fetchMock.mock.calls[0]?.[1] as { body: string }).body
	) as { name: string; email: string; message: string };
	expect(body).toMatchObject({
		name: "Ada",
		email: "ada@example.com",
		message: "Hello",
	});
});
