# Job-specific resume

Vernon shares a job posting; you return his resume retold for that job, as a PDF he can send. The general resume, [docs/design/copywriting/resume.json](../design/copywriting/resume.json), is the only source of facts. A job-specific resume is that resume **amplified**: the same career, told in the posting's language with the strongest true wording. Amplify the telling, keep the facts ([Facts](#facts)).

Job-specific resumes are private. They live in `resumes/<company>-<role>/` (lowercase, hyphens: `resumes/apple-senior-backend-engineer/`), which git ignores; `/resume` on the site stays the general one.

## Steps

1. **Read the posting.** Open the URL in the browser and read the page text: careers sites (Apple's among them) load the posting with JavaScript, so a plain fetch returns only the menus. If it needs a login or shows no job text, ask Vernon to paste the posting. Save it as `job.md` in the folder: the URL, the date read, and the posting's text. Done when `job.md` holds the full posting.
2. **List what it asks for** at the end of `job.md`: every responsibility, required and preferred skill, technology, domain and seniority signal, each in the posting's own words. Done when no requirement in the posting is missing from the list.
3. **Match.** Beside each listed item, write the resume line that proves it, or `gap`. Done when every item has a line or `gap`.
4. **Ask about gaps.** Ask Vernon which gaps he has real experience of, grouping related gaps into one tick-list question (protocols, technologies, domain, results). For every gap he ticks, get the specifics before writing a word about it: where, which system or product, what he did, and any number. A ticked gap with specifics becomes a new fact for this resume, and goes into the general resume too if he says so. A gap he leaves unticked, or ticks without specifics, stays out. Done when every gap is either backed by specifics or out.
5. **Write** `resume.json` in the folder: a copy of the general resume, in the same shape, rewritten by [Amplify](#amplify). English only, unless the posting is in Chinese or Vernon asks for both.
6. **Render**: `npm run job-resume -- <folder>` (add `zh` for Chinese) writes `resume.pdf` beside it. Read the PDF: done when it is at most two pages, with no line orphaned on a page of its own. The general resume already runs a line past two pages in this layout, so reaching two means cutting: first projects that match nothing, then the oldest role's detail.
7. **Report** to Vernon: the PDF, the match table from step 3, and every line you changed, old wording beside new, so he can overrule any of it. Send nothing; he sends it.

## Amplify

Each rule shapes wording, order or emphasis:

- **Title**: the general title plus the posting's focus, as in `Senior Backend Engineer, Integrations`.
- **Summary**: rewrite it for this job. Lead with the years and the core stack, then the three strongest matches from step 3, in the posting's words.
- **Mirror the posting.** Where the resume and the posting name the same thing differently, use the posting's term (`event streaming` for `event-driven integration`, if that is what they call it), so a recruiter or a keyword filter finds it.
- **Power verbs.** Every highlight opens with one, and no verb opens two highlights in the same role: Architected, Engineered, Drove, Launched, Transformed, Accelerated, Consolidated, Standardized, Orchestrated, Hardened, Spearheaded, Owned, Delivered. Inside a highlight, results take forceful participles: `slashing setup effort by **30%**`, `collapsing turnaround from **hours to seconds**`, `eliminating duplicated code`.
- **Dense highlights.** One highlight carries the whole story in one sentence of 30 to 50 words: what he built, with which technology, at what scale or under what constraint, for whom, and the result. Fold a thin highlight into a neighbour, and expand a relevant one with detail the general resume or Vernon's answers already hold.
- **Bold what the job wants.** Wrap in `**…**` every result number and every phrase that answers a listed requirement: technologies, patterns, scope, leadership (`**event-driven integration on Kafka**`, `**acting project lead**`). Two to five bold phrases per highlight, as in the sample Vernon approved. Bold renders in the summary, experience highlights and project descriptions; skills, titles and names stay plain.
- **Order by relevance.** Within a role, highlights that match the posting come first. Skill groups and the items inside them follow the posting's priorities. Projects that match come first; a project that matches nothing may be cut to keep two pages.
- **Seniority.** State ownership plainly wherever it is true: who he led, what he decided, what he was accountable for.

## Facts

- Every employer, role title at an employer, date, number, technology and outcome comes from the general resume or from Vernon's answer in step 4. A stronger verb or a posting term is used only where it is still true of what he did: `Architected` for work he designed, `Led` for people he led.
- Experience lists employers only. Work done outside employment is a Project, described without a company or a founder role.
- Surname in capitals (`KOH`); `DBS Bank`, product and technology names as the general resume writes them.
- The header (email, site, links), awards and education are copied unchanged.
