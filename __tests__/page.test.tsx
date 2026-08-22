import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "../app/page";

test("renders Vernon's portfolio content and navigation", () => {
	render(<Home />);

	expect(
		screen.getByRole("heading", { level: 1, name: /vernon wee hong koh/i })
	).toBeInTheDocument();
	expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
	expect(
		screen.getByRole("navigation", { name: "Portfolio sections" })
	).toBeInTheDocument();
	expect(
		screen.getByRole("heading", { name: "Ten years shipping backends" })
	).toBeInTheDocument();
	expect(
		screen.getByRole("heading", { name: "Upmatches" })
	).toBeInTheDocument();
	expect(screen.getByText("Singapore · GMT+8")).toBeInTheDocument();
	expect(
		screen.queryByText("vernonweehongkoh@gmail.com")
	).not.toBeInTheDocument();
	expect(screen.queryByText("(+65) 8741 8787")).not.toBeInTheDocument();
});

test("toggles and persists the selected theme", () => {
	render(<Home />);
	const toggle = screen.getByRole("button", { name: "Toggle dark mode" });

	fireEvent.click(toggle);

	expect(document.documentElement).toHaveClass("dark");
	expect(window.localStorage.getItem("vwhk-theme")).toBe("dark");
});
