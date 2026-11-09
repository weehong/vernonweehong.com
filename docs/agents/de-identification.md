# De-identification

Posts are public, and Vernon works at DBS, a bank. A post keeps the **lesson** and drops the employer's **internals**: what Vernon learned and how he thinks stays; how DBS is built, secured and staffed goes. De-identify every draft, in both languages, before it goes to Vernon for review, and again on every update to a published post.

## Steps

1. **Sweep.** List every proper noun, system or tool name, team or department, person, number and example in the draft. Done when nothing in the draft that names or measures something is left off the list.
2. **Sort** each item against [Decided items](#decided-items) first, then [Categories](#categories):
   - A decided item → apply its decision.
   - Clearly in a category → replace it with a generic description of what it does (`ENaaS` → "an internal infrastructure service").
   - Anything you are unsure of → ask Vernon, one question per item: name the item, quote the sentence, and offer the generic wording you would use.
3. **Report** in the review message: what you generalised, so Vernon can overrule it, and any dropped detail he may still want in his private notes (for example the names of the access requests to raise on his next project).
4. **Record** every answer Vernon gives in [Decided items](#decided-items), so the question is asked once. Done when the table holds every item asked about.

## Categories

Generalise these to what they do:

- **Internal systems**: platforms, services, tools and process names that exist only inside the employer.
- **Security and access**: access and privilege tooling, permission levels, how access to logs, servers or data is obtained.
- **Test data and accounts**: test users, credentials, permission tiers, where test data comes from.
- **Architecture**: which components a system uses and how data flows between them.
- **People and organisation**: colleagues, clients, team and department names, project and product names.
- **Figures**: volumes, user counts, costs, dates and durations from work.
- **Anything not public**: unreleased plans, incidents, internal decisions.

Keep, as written: the lesson, Vernon's reasoning and approach, role names (product owner, business analyst), and widely used public technology named on its own, without the internal detail around it.

## Decided items

| Item                                                  | Decision                                                                       | Decided    |
| ----------------------------------------------------- | ------------------------------------------------------------------------------ | ---------- |
| DBS, the employer's name                              | Stays, as written                                                              | 2026-11-09 |
| Kafka                                                 | Stays, as written                                                              | 2026-11-09 |
| ENaaS                                                 | Generalise: "an internal infrastructure service"                               | 2026-11-09 |
| CyberArk                                              | Generalise: "special access, so we can read the logs after deployment"         | 2026-11-09 |
| Test accounts: how many permission tiers, credentials | Generalise: "test accounts for every permission level", no count, no passwords | 2026-11-09 |
