import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import ResumePage from "../app/resume/page";
import { resumeEmail, resumeExperience, resumeProjects } from "../lib/resume";

test("renders the resume from the resume data in PDF section order", () => {
	render(<ResumePage />);

	expect(
		screen.getByRole("heading", { level: 1, name: /vernon wee hong koh/i })
	).toBeInTheDocument();
	expect(
		screen
			.getAllByRole("heading", { level: 2 })
			.map((heading) => heading.textContent)
	).toEqual(["Skills", "Experience", "Projects", "Awards", "Education"]);
	for (const job of resumeExperience) {
		expect(screen.getByText(job.company)).toBeInTheDocument();
	}
	for (const project of resumeProjects) {
		expect(
			screen.getByRole("heading", { level: 3, name: project.name })
		).toBeInTheDocument();
	}
	expect(screen.getByText("May 2018")).toHaveAttribute("datetime", "2018-05");
	expect(
		screen.getByRole("button", { name: "Print / Save as PDF" })
	).toBeInTheDocument();
	expect(
		screen.getByRole("link", { name: /back to portfolio/i })
	).toHaveAttribute("href", "/");
});

test("shows the email address but not the phone number", () => {
	render(<ResumePage />);

	expect(screen.getByRole("link", { name: resumeEmail })).toHaveAttribute(
		"href",
		`mailto:${resumeEmail}`
	);
	expect(screen.queryByText(/8741/)).not.toBeInTheDocument();
});
