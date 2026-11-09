# Triage labels

Every issue in `docs/issues/` carries exactly one category label and exactly one state label in its `labels` frontmatter. Change the state label as the issue moves; keep the category.

## Category

| Label         | Meaning                                                      |
| ------------- | ------------------------------------------------------------ |
| `bug`         | The site differs from the spec in `docs/design/`, or breaks. |
| `enhancement` | New or changed behaviour; the spec changes first.            |

## State

| Label             | Meaning                                                                                  | Who acts |
| ----------------- | ---------------------------------------------------------------------------------------- | -------- |
| `needs-triage`    | New; Vernon has not reviewed it.                                                         | Vernon   |
| `needs-info`      | Blocked on a question; the open question is written in the issue's Notes.                | Vernon   |
| `ready-for-agent` | Fully specified: an agent can finish it from the issue, the spec and the code alone.     | Agent    |
| `ready-for-human` | Needs Vernon's judgement or hands (see below), even when an agent does part of the work. | Vernon   |
| `wontfix`         | Declined; the Resolution section says why.                                               | Nobody   |

An agent picks up only `ready-for-agent` issues. Moving an issue into `ready-for-agent` is Vernon's call; an agent triaging proposes a state and leaves the issue at `needs-triage` until Vernon confirms.

## What makes an issue `ready-for-human`

The project's hard rules in `docs/design/README.md` reserve these for Vernon:

- New or changed homepage, profile, resume or dictionary copy (approved before it enters the JSON).
- Visible design changes that must also be made in the canvas or design system artifacts.
- Anything on a third-party account: signing up, settings, or any paid plan or add-on.
