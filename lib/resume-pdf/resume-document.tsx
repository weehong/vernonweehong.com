import {
	Document,
	Link,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import { printTokens as c } from "@/lib/design-tokens";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { formatMonth, type Locale } from "@/lib/i18n/locales";
import type { Resume } from "@/lib/resume";

/**
 * The resume as a PDF (docs/design/pages.md, Resume → PDF): the layout of the
 * old resume-main generator, filled from the approved resume.json.
 */

const styles = StyleSheet.create({
	page: {
		paddingTop: 40,
		paddingBottom: 40,
		paddingHorizontal: 40,
		fontSize: 10,
		color: c.ink,
		backgroundColor: c.paper,
	},
	name: { fontSize: 12, fontWeight: 700 },
	contact: { color: c.inkSoft, marginTop: 2 },
	section: { marginTop: 10 },
	heading: {
		fontWeight: 700,
		textTransform: "uppercase",
		letterSpacing: 1,
		borderBottomWidth: 1,
		borderBottomColor: c.rule,
		paddingBottom: 1,
		marginBottom: 4,
	},
	row: { flexDirection: "row", marginTop: 4 },
	label: { width: 170, paddingRight: 8 },
	strong: { fontWeight: 700 },
	medium: { fontWeight: 500 },
	note: { fontSize: 8, color: c.inkMuted },
	details: { flex: 1 },
	paragraph: { textAlign: "justify" },
	line: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
	link: { color: c.ink, textDecoration: "none" },
});

/** `**…**` becomes bold text; nothing else is parsed. */
function rich(text: string): React.ReactNode {
	return text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
		index % 2 === 1 ? (
			<Text key={index} style={styles.strong}>
				{part}
			</Text>
		) : (
			part
		)
	);
}

function Section({
	title,
	children,
}: {
	readonly title: string;
	readonly children: React.ReactNode;
}): React.ReactElement {
	return (
		<View style={styles.section}>
			<Text style={styles.heading} minPresenceAhead={40}>
				{title}
			</Text>
			{children}
		</View>
	);
}

export function ResumeDocument({
	resume,
	dictionary,
	locale,
	fontFamily,
	title,
}: {
	readonly resume: Resume;
	readonly dictionary: Dictionary;
	readonly locale: Locale;
	readonly fontFamily: string;
	readonly title: string;
}): React.ReactElement {
	const month = (value: string): string =>
		formatMonth(locale, value, dictionary.resume.month);
	const date = new Date(`${resume.updated}T00:00:00Z`);
	const separator = locale === "zh" ? "、" : ", ";
	const { header } = resume;

	return (
		<Document
			title={title}
			author="Vernon Wee Hong KOH"
			subject={`${header.title} · ${header.location}`}
			language={locale === "zh" ? "zh-Hans" : "en"}
			creationDate={date}
			modificationDate={date}
		>
			<Page size="A4" style={[styles.page, { fontFamily }]} wrap>
				<View>
					<Text style={styles.name}>Vernon Wee Hong KOH</Text>
					<Text>
						{header.title} · {header.location}
					</Text>
					<Text style={styles.contact}>
						{[
							header.email,
							header.site,
							...header.links.map((link) =>
								link.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
							),
						].join(" · ")}
					</Text>
				</View>

				<Section title={dictionary.resume.summary}>
					<Text style={styles.paragraph}>{rich(resume.summary)}</Text>
				</Section>

				<Section title={dictionary.resume.skills}>
					{resume.skills.map((skill) => (
						<View key={skill.group} style={styles.row} wrap={false}>
							<Text style={[styles.label, styles.medium]}>{skill.group}</Text>
							<Text style={styles.details}>{skill.items.join(separator)}</Text>
						</View>
					))}
				</Section>

				<Section title={dictionary.resume.experience}>
					{resume.experience.map((job) => (
						<View key={`${job.company}-${job.start}`} style={styles.row}>
							<View style={styles.label}>
								<Text style={styles.medium}>{job.role}</Text>
								<Text style={styles.medium}>{job.company}</Text>
								<Text style={styles.note}>
									{month(job.start)} –{" "}
									{job.end === null
										? dictionary.resume.present
										: month(job.end)}
								</Text>
							</View>
							<View style={styles.details}>
								{job.highlights.map((highlight) => (
									<Text
										key={highlight}
										style={[styles.paragraph, { marginBottom: 3 }]}
									>
										{rich(highlight)}
									</Text>
								))}
							</View>
						</View>
					))}
				</Section>

				<Section title={dictionary.resume.projects}>
					{resume.projects.map((project) => (
						<View key={project.name} style={styles.row} wrap={false}>
							<View style={styles.label}>
								<Text style={styles.medium}>{project.name}</Text>
								{"status" in project && project.status ? (
									<Text style={styles.note}>({project.status})</Text>
								) : null}
							</View>
							<Text style={[styles.details, styles.paragraph]}>
								{rich(project.description)}
							</Text>
						</View>
					))}
				</Section>

				<Section title={dictionary.resume.awards}>
					{resume.awards.map((award) => (
						<View key={award.title} style={styles.line} wrap={false}>
							<Link src={award.url} style={[styles.link, styles.details]}>
								{award.title}
							</Link>
							<Text>{award.year}</Text>
						</View>
					))}
				</Section>

				<Section title={dictionary.resume.education}>
					{resume.education.map((entry) => (
						<View key={entry.school} style={styles.line} wrap={false}>
							<View style={styles.details}>
								<Text style={styles.medium}>{entry.school}</Text>
								<Text>{entry.credential}</Text>
							</View>
							<Text>{entry.period}</Text>
						</View>
					))}
				</Section>
			</Page>
		</Document>
	);
}
