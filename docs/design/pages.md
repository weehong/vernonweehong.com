# Pages, languages and content

How the pages are assembled from [components.md](components.md), how the two language editions work, where content lives, and how search and email subscriptions behave.

Before writing any routing, font or proxy code, read the matching guide in `node_modules/next/dist/docs/01-app/` (this is Next.js 16: `proxy.ts`, not `middleware.ts`).

---

## Routing

Two editions, never mixed on one page:

| Edition | URL prefix                                                                      | `<html lang>` | Default |
| ------- | ------------------------------------------------------------------------------- | ------------- | ------- |
| English | none (`/`, `/writing`, `/writing/{slug}`, `/resume`, `/privacy`)                | `en`          | yes     |
| Chinese | `/zh` (`/zh`, `/zh/writing`, `/zh/writing/{slug}`, `/zh/resume`, `/zh/privacy`) | `zh-Hans`     | no      |

Implementation:

- All pages live under `app/[lang]/…` with `generateStaticParams` returning `[{ lang: 'en' }, { lang: 'zh' }]`. The root layout moves to `app/[lang]/layout.tsx` and sets `<html lang={lang === 'zh' ? 'zh-Hans' : 'en'}>`.
- `proxy.ts`: requests without a `/zh` prefix are **rewritten** (not redirected) to `/en/…`, so English URLs stay unprefixed. Requests to `/en` or `/en/…` are **redirected** (308) to the unprefixed URL so there is one URL per page. Skip `_next`, `api`, static files and metadata routes.
- No automatic language redirect from `Accept-Language`. The only automatic step: if a `locale=zh` cookie exists (set by the LanguageSwitch) and the request is exactly `/`, redirect to `/zh`.
- `hasLocale(lang)` guards every page; unknown values return `notFound()`.
- Every page passes `alternates` to the LanguageSwitch and to metadata: `{ en: '/writing/x', 'zh-Hans': '/zh/writing/x', 'x-default': '/writing/x' }`.
- API routes (`/api/contact`, `/api/subscribe`) stay outside `[lang]` and receive `locale` in the request body.

## Fonts

Load with `next/font/google` in `app/[lang]/layout.tsx` and expose these CSS variables (the theme reads exactly these names):

| Font                | Variable            | Settings                                                                                                                                             |
| ------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bricolage Grotesque | `--font-bricolage`  | `subsets: ['latin']`, `weight: ['600','700','800']`, `display: 'swap'`                                                                               |
| Geist               | `--font-geist`      | `subsets: ['latin']`, `weight: ['400','500','600']`                                                                                                  |
| Geist Mono          | `--font-geist-mono` | `subsets: ['latin']`, `weight: ['400','500']`                                                                                                        |
| Noto Sans SC        | `--font-noto-sc`    | Chinese edition only. `weight: ['400','500','700','900']`, `preload: false` (no Chinese subset to preload; Google serves it in unicode-range slices) |

Add the variable classes to `<html>`. The English edition must not download Noto Sans SC, except the two characters of the `中文` switch label, which may fall back to the system CJK font.

## Interface text

All interface text comes from `app/[lang]/dictionaries/{en,zh}.json` (the pattern in the Next.js internationalization guide). Components receive the dictionary; they never contain literal UI strings. Content (profile, posts) is separate, see [Content](#content).

Required keys, with the approved wording (rows added 2026-11-09 during implementation — `contact.sending` … `.error`, `topicGroup`, `matchWhere.*`, `subscribe.sending` / `.retry`, `resume.actions`, `meta.*`, `post.code.*`, `post.callout.*`, `tableScroll` — and the updated `footerRole` await Vernon’s approval). The hero kicker comes from `home.json`, not the dictionary:

| Key                                                                                            | en                                                                                                                                                                                                                 | zh                                                                                                                                               |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `badge`                                                                                        | Open to backend & platform roles                                                                                                                                                                                   | 正在寻找后端与平台工程职位                                                                                                                       |
| `langNav`                                                                                      | Language                                                                                                                                                                                                           | 语言                                                                                                                                             |
| `pageLinks`                                                                                    | Page links                                                                                                                                                                                                         | 页面链接                                                                                                                                         |
| `onThisPage`                                                                                   | On this page                                                                                                                                                                                                       | 本页内容                                                                                                                                         |
| `onThisPost`                                                                                   | On this post                                                                                                                                                                                                       | 本文目录                                                                                                                                         |
| `elsewhere`                                                                                    | Elsewhere                                                                                                                                                                                                          | 其他链接                                                                                                                                         |
| `menu.title` / `.open` / `.close`                                                              | Menu / Open menu / Close menu                                                                                                                                                                                      | 菜单 / 打开菜单 / 关闭菜单                                                                                                                       |
| `home` / `writing` / `rss` / `allWriting` (the Resume link uses `resume.kicker`)               | Home / Writing / RSS feed / All writing                                                                                                                                                                            | 首页 / 写作 / RSS 订阅 / 全部文章                                                                                                                |
| `themeToDark` / `themeToLight`                                                                 | Switch to dark theme / Switch to light theme                                                                                                                                                                       | 切换到深色模式 / 切换到浅色模式                                                                                                                  |
| `footerRole`                                                                                   | Senior backend engineer · Singapore                                                                                                                                                                                | 资深后端工程师 · 新加坡                                                                                                                          |
| `readResume` / `contactMe`                                                                     | Read the resume / Contact me                                                                                                                                                                                       | 查看简历 / 联系我                                                                                                                                |
| `current` / `now`                                                                              | Current / Now                                                                                                                                                                                                      | 在职 / 现在                                                                                                                                      |
| `sections.about` … `sections.contact` (link column)                                            | About · Experience · Projects · Skills · Contact                                                                                                                                                                   | 关于 · 经历 · 项目 · 技能 · 联系                                                                                                                 |
| `skillArea` / `tools` / `dailyDrivers`                                                         | Skill area / Tools / Daily drivers at DBS                                                                                                                                                                          | 领域 / 工具 / 在星展银行日常使用                                                                                                                 |
| `year` / `type` / `background` / `where` / `award` / `education`                               | Year / Type / Background / Where / Award / Education                                                                                                                                                               | 年份 / 类型 / 内容 / 地点 / 奖项 / 教育                                                                                                          |
| `contact.name` / `.email` / `.message` / `.send`                                               | Name / Email / Message / Send message                                                                                                                                                                              | 姓名 / 邮箱 / 留言 / 发送                                                                                                                        |
| `contact.sending` / `.sent`                                                                    | Sending… / Thanks, your message is on its way. I will reply soon.                                                                                                                                                  | 发送中… / 谢谢，消息已发出，我会尽快回复。                                                                                                       |
| `contact.invalid` / `.tooMany` / `.error`                                                      | Fill in your name, a valid email address and a message. / Too many messages. Please try again later. / Your message could not be sent. Please try again later.                                                     | 请填写姓名、有效的邮箱地址和留言。 / 发送次数过多，请稍后再试。 / 消息未能发出，请稍后再试。                                                     |
| `writingTitle` (lead / mark / tail)                                                            | Notes from / the build / and the years around it                                                                                                                                                                   | — / 动手做事 / 之余的笔记与思考                                                                                                                  |
| `writingIntro`                                                                                 | Reflections and tech notes: what I build, and what building it teaches me.                                                                                                                                         | 关于感悟与技术的笔记：我做了什么，以及做的过程教会了我什么。                                                                                     |
| `emailCta`                                                                                     | Get posts by email                                                                                                                                                                                                 | 邮件订阅                                                                                                                                         |
| `search.label` / `.placeholder` / `.hint` / `.clear`                                           | Search everything I've written / Titles, topics, whole posts. Typos are fine. / Searches titles, summaries, topics and the full text. Close spellings still match. / Clear search                                  | 搜索全部文章 / 搜索标题、主题或全文 / 会搜索标题、摘要、主题和全文。英文单词拼错一两个字母也能找到。 / 清除搜索                                  |
| `nav.search` / `.latest` / `.topics` / `.archive`                                              | Search / Latest / Topics / Archive                                                                                                                                                                                 | 搜索 / 最新 / 主题 / 归档                                                                                                                        |
| `newThisMonth` / `readPost`                                                                    | New this month / Read the post                                                                                                                                                                                     | 本月新文 / 阅读全文                                                                                                                              |
| `topics.reflections` / `.tech`                                                                 | Reflections / Tech                                                                                                                                                                                                 | 感悟 / 技术                                                                                                                                      |
| `topics.reflectionsDesc`                                                                       | Lessons from ten years of shipping, and the life around it.                                                                                                                                                        | 十年工作与生活里，慢慢积累下来的体会。                                                                                                           |
| `topics.techDesc`                                                                              | APIs, search, services and the tools I build them with.                                                                                                                                                            | 关于 API、搜索、服务，以及搭建它们的工具。                                                                                                       |
| `allTopics` / `results`                                                                        | All topics / Search results                                                                                                                                                                                        | 全部主题 / 搜索结果                                                                                                                              |
| `topicGroup`                                                                                   | Filter by topic                                                                                                                                                                                                    | 按主题筛选                                                                                                                                       |
| `count.posts`                                                                                  | {n} post / {n} posts                                                                                                                                                                                               | {n} 篇 (index header: 共 {n} 篇)                                                                                                                 |
| `count.matches`                                                                                | {n} post matches “{q}” / {n} posts match “{q}”                                                                                                                                                                     | 找到 {n} 篇与“{q}”相关的文章                                                                                                                     |
| `matchedIn` + `matchWhere.title` / `.summary` / `.text` / `.topic`                             | Matched in title + text + topic                                                                                                                                                                                    | 匹配：标题、正文、主题                                                                                                                           |
| `empty.title` / `.hint` / `.clear`                                                             | Nothing matches “{q}” / Try fewer letters, another spelling, or clear the filters. / Clear search and filters                                                                                                      | 没有找到与“{q}”相关的文章 / 试试更短的关键词，或清除筛选条件。 / 清除搜索和筛选                                                                  |
| `empty.noPostsTitle` / `.noPostsHint`                                                          | No posts yet / The first one is on its way. Subscribe below to get it by email.                                                                                                                                    | 还没有文章 / 第一篇正在路上。在下方订阅，发布时会通过邮件通知你。                                                                                |
| `minutes`                                                                                      | {n} min read                                                                                                                                                                                                       | {n} 分钟阅读                                                                                                                                     |
| `subscribe.eyebrow` / `.title` / `.desc`                                                       | Email updates / Get new posts by email / One email when I publish something new, with the post in English and Chinese. No other mail, and you can unsubscribe in one click.                                        | 邮件更新 / 新文章发到你的邮箱 / 每次发布新文章时发一封邮件，内含中英文两个版本。没有其他内容，随时一键退订。                                     |
| `subscribe.label` / `.button` / `.error`                                                       | Email address / Subscribe / Enter an email address like name@example.com.                                                                                                                                          | 邮箱地址 / 订阅 / 请输入有效的邮箱地址，例如 name@example.com。                                                                                  |
| `subscribe.sending` / `.retry`                                                                 | Subscribing… / Something went wrong. Please try again.                                                                                                                                                             | 订阅中… / 出了点问题，请再试一次。                                                                                                               |
| `subscribe.fine` / `.privacy` / `.rss`                                                         | Your address is only used for these updates. / How I handle it / Prefer RSS?                                                                                                                                       | 你的邮箱只用于发送文章更新。 / 隐私说明 / 用 RSS 订阅                                                                                            |
| `subscribe.doneTitle` / `.doneText`                                                            | Almost done. Check your inbox. / I sent a confirmation link to {email}. Updates start once you click it.                                                                                                           | 快好了，请查收邮件。 / 确认链接已发送到 {email}，点击后即可开始接收更新。                                                                        |
| `post.thoughts`                                                                                | Thoughts on this? I reply to everything.                                                                                                                                                                           | 对这篇文章有想法？每条消息我都会回复。                                                                                                           |
| `notFound.kicker` / `.text` / `.home`                                                          | 404 · Not found / The page you are looking for does not exist. / Go back home                                                                                                                                      | 404 · 页面不存在 / 你要找的页面不存在。 / 返回首页                                                                                               |
| `resume.kicker` / `.actions` / `.back` / `.download` / `.updated`                              | Resume / Resume actions / Back to home / Download PDF / Last updated {date}                                                                                                                                        | 简历 / 简历操作 / 返回首页 / 下载 PDF / 最后更新：{date}                                                                                         |
| `resume.summary` / `.skills` / `.experience` / `.projects` / `.awards` / `.education`          | Summary / Skills / Experience / Projects / Awards / Education                                                                                                                                                      | 简介 / 技能 / 经历 / 项目 / 奖项 / 教育                                                                                                          |
| `resume.present` / `.month`                                                                    | Present / {month} {year} (e.g. Apr 2020)                                                                                                                                                                           | 至今 / {year} 年 {month} 月                                                                                                                      |
| `post.related`                                                                                 | You might also like                                                                                                                                                                                                | 你可能也会喜欢                                                                                                                                   |
| `ai.title` / `ai.note` (Writing index)                                                         | My ideas, polished with AI. / I write the thoughts and rough notes; AI shapes them into finished sentences in English and Chinese. I review every post before it goes up.                                          | 观点是我的，文字经 AI 润色。 / 我写下想法和草稿，由 AI 整理成通顺的中英文文章。每篇文章发布前都由我审阅。                                        |
| `post.aiTag`                                                                                   | Polished with AI                                                                                                                                                                                                   | AI 润色                                                                                                                                          |
| `post.howTitle` / `post.howBody`                                                               | How this post was written / The ideas, opinions and examples are mine. I wrote them down as rough notes, and AI shaped them into finished sentences in English and Chinese. I review every post before it goes up. | 这篇文章是怎么写的 / 观点、看法和例子都来自我。我先写下粗略的笔记，再由 AI 整理成通顺的中英文文章。每篇文章发布前都由我审阅。                    |
| `post.code.wrap` / `.showAll` / `.showFewer` (CodeBlock; `{n}` is the line count)              | Wrap lines / Show all {n} lines / Show fewer lines                                                                                                                                                                 | 自动换行 / 显示全部 {n} 行 / 收起                                                                                                                |
| `post.callout.note` / `.tip` / `.important` / `.warning` / `.caution` (Callout default titles) | Note / Tip / Important / Warning / Caution                                                                                                                                                                         | 注意 / 提示 / 重要 / 警告 / 当心                                                                                                                 |
| `tableScroll` (TableBox region label)                                                          | Table: scroll sideways to see more                                                                                                                                                                                 | 表格：可左右滑动查看更多                                                                                                                         |
| `meta.title` / `.description`                                                                  | Vernon KOH · Senior Backend Engineer in Singapore / Vernon KOH (Vernon Wee Hong KOH) is a senior backend engineer in Singapore building Java and Spring Boot integrations for regulated banking.                   | Vernon KOH · 新加坡资深后端工程师 / Vernon KOH（Vernon Wee Hong KOH）是新加坡的资深后端工程师，为受监管的银行业务构建 Java 与 Spring Boot 集成。 |
| `meta.writingDescription` / `.notFoundTitle`                                                   | Reflections and tech notes by Vernon KOH, a backend engineer in Singapore. Every post exists in English and Chinese. / Page not found                                                                              | 新加坡后端工程师 Vernon KOH 的感悟与技术笔记，每篇文章都有中英文两个版本。 / 页面不存在                                                          |

Dates: English `12 Nov 2026`; Chinese `2026年11月12日`. Use `Intl.DateTimeFormat` (`en-GB` `{ day: 'numeric', month: 'short', year: 'numeric' }`; `zh-CN` `{ dateStyle: 'long' }`).

---

## Content

All content is written by AI from Vernon's notes: he supplies the thoughts, AI rephrases and structures them, in both languages. Vernon reviews both versions before publishing.

### Profile (homepage and resume)

The approved homepage copy, in both languages, is [copywriting/home.json](copywriting/home.json), taken word for word from the canvas artboards "Homepage · light" and "首页 · 中文版". Vernon approved both languages on 2026-11-09. He approved a revision the same day that brings it in line with the resume (title, DBS points, Resetrix, Wrapsfer, Upmatches sold, skills); the canvas artboards still show the earlier text, so the JSON wins where they differ. It is the source for:

- `lib/profile.ts` reads `copywriting/home.json` directly: `getProfile(locale)` picks one side of every `{ en, zh }` value (`lib/content/localize.ts`), so the site can never drift from the approved copy.
- Section labels and headings (`about.heading`, `experience.heading`, …): render `lead` + `<mark className="highlight">mark</mark>` + `tail`. English leads already end with a space; Chinese ones do not, so never add or trim spaces in code.
- Outcomes: `**…**` marks a number or result rendered as `<strong className="font-semibold text-ink">`. Parse only `**`; no other Markdown.
- The profile card keys are localised (`role` → `职位`, `company` → `公司`, `markets` → `市场`, `stack` → `技术栈`); the request line `GET /v1/engineers/vernon-koh` and `200 OK` stay as they are in both.
- Company names: DBS Bank is `星展银行` in Chinese; IPI Singapore, Blissbox, WizWerx, Resetrix, Upmatches, Wrapsfer, Life Poem, Treasures Private Client and all technology names stay in English. The homepage may shorten company names (`Blissbox` for `Blissbox Pte. Ltd.`); the resume uses the full names.
- Projects: Wrapsfer and the PDF search project use the diagram (`media.rows`, with `emphasis` marking the marker and night boxes); Upmatches uses the phone-outline placeholder (captions in the JSON). Each card shows its `label` (In development, Sold) as a StatusChip.

Facts must match across languages: numbers, periods, URLs, technology lists and the daily-driver flags. A unit test asserts both locale files have the same keys, the same `**…**` count per outcome and the same numbers. The resume copy is [copywriting/resume.json](copywriting/resume.json), in the same `{ en, zh }` shape: header, summary, skill groups, experience (role, company, months, highlights), projects, awards and education. Vernon approved both languages on 2026-11-09. It is the general resume and the base for future job-specific versions, so keep it generic (title "Senior Backend Engineer", standard hyphenation). `lib/resume.ts` reads it directly, like `lib/profile.ts`; `updated` is the Last updated date. It is self-contained and is the source of truth for career facts: where the homepage states a role, company, period or number, it must agree with `resume.json` (a unit test compares them). One exception, decided by Vernon on 2026-11-14: the resume's Experience lists employers only, so the Resetrix entry appears on the homepage alone, and the work done there (Life Poem, the enquiry triage proof of concept) is under the resume's Projects with no company or founder wording.

Rule for new or changed copy: Vernon supplies the thought, AI writes both languages, Vernon approves, and the JSON and the locale files are updated together. Do not write copy that is not in the JSON.

### Posts

```
content/writing/en/{slug}.mdx
content/writing/zh/{slug}.mdx
```

- Same `slug` (English, kebab-case) in both languages. A post is published only when **both** files exist and both have `status: published`.
- Every post exists in both languages (decided by Vernon, 2026-11-09). A post without its pair fails the build; there is no single-language post and no `lang` field.
- Frontmatter (both files):

```yaml
title: "Reviewing AI-written code: what I check first"
highlight: "what I check first" # closing words of the title, drawn with the highlighter on the post page
summary: "One or two sentences for the archive row and search."
standfirst: "One sentence under the title on the post page."
topic: tech # tech | reflections — must match across languages
publishedOn: 2026-09-09 # must match across languages
updatedOn: 2026-09-20 # optional
status: draft # draft | published
```

- Body: Markdown/MDX with `##` sections (they feed "On this post" and get §n prefixes), code fences with a language and an optional `title="File.java"`, lists, quotes, images. No raw HTML.
- A build-time check (like Resetrix's `insight-check`) fails the build if: a field is missing; the pair disagrees on topic or date; `highlight` is not the end of `title`; the body has fewer than two `##`; a link is not https; raw HTML appears; the Chinese file contains a run of English prose longer than ten words, or the English file contains Chinese characters (keeps the editions from mixing; code blocks, inline code and proper nouns excepted).
- Chinese edition: explain in Chinese, in simplified Chinese with mainland usage. Use the Chinese term engineers in China use (上下文, 数据库, 后端, 生产环境, 架构, 产品负责人, 业务分析师) where the notes use an English word. English stays only for proper nouns, terms Chinese tech writing keeps as is (Kafka, API), and identifiers such as field names, set in inline code. A term a general reader may not know gets a few words of explanation the first time.
- Reading time: English words ÷ 220; Chinese characters ÷ 350; round, minimum 1.
- Post number (the big 01, 02… in the archive): position by `publishedOn`, oldest = 01. Identical in both editions.
- Drafts are visible outside production only (same rule as Resetrix).

### RSS

`/feed.xml` (English) and `/zh/feed.xml` (Chinese), full text, newest 20. Each links its edition's posts only.

---

## Search

Client-side, per edition, no service.

- At build time, generate each edition’s index as a static route, `/writing/search-index.json` and `/zh/writing/search-index.json`: for each published post `{ slug, no, title, summary, topic, topicName, publishedOn, minutes, body }`, with `body` as plain text (MDX stripped, code blocks removed).
- The Writing index loads its edition's file and searches in the browser:
  1. Split the query on whitespace into lower-case tokens. Every token must match somewhere in the post.
  2. A token matches a field if the field (lower-cased) contains it. This covers Chinese.
  3. Otherwise, for Latin tokens of 3+ characters only: a word matches if its edit distance to the token (or its prefix of the token's length) is ≤ 1, or ≤ 2 for tokens of 6+ characters.
  4. Score: title × 3, summary × 2, topic name × 2, body × 1; exact matches count double. Sort by score, then newest.
  5. Highlight every matched range with `<mark>` in the title and in either the summary or, if only the body matched, a snippet around the first hit (60 chars before / 110 after in English, 30 / 60 in Chinese, with `…`).
  6. Show "Matched in …" for each result.
- While a query is active: hide Latest and Topics; hide year separators; the count line shows the match count.
- `/` focuses the search; `Esc` clears it.

---

## Subscriptions

Email updates via **Buttondown** (decided by Vernon, 2026-11-09). Check field names and plan limits against Buttondown's current API docs (https://docs.buttondown.com) when implementing; do not rely on memory.

**Free plan only, for now.** Never sign up for, upgrade to or enable any paid Buttondown plan or add-on. Vernon will decide later; until then everything must work on the free plan (first 100 active subscribers). On Buttondown's pricing page (checked 2026-11-09) tagging & segmentation (+$9/month) and RSS-to-email (+$9/month) are paid add-ons, and the API refuses to create new tags on plans without tagging (`403 feature_disabled`).

What stays the same in every phase: the form, the `POST /api/subscribe` `{ email }` route, double opt-in, and every message the form shows. Only the server side changes between phases.

### Phase 1: free plan (build this; decided by Vernon, 2026-11-09)

- **One free Buttondown newsletter, one bilingual email per post.** Buttondown's docs (checked 2026-11-09) make several newsletters in one account a paid feature, so the earlier plan of one newsletter per language does not fit the free plan. Vernon chose one newsletter instead.
- Key: `BUTTONDOWN_API_KEY` (from Buttondown → API → Keys; server only, never sent to the browser; placeholder in `.env.example`, value in Vercel for Production and Preview).
- `/api/subscribe` creates the subscriber with `email_address` (plus the visitor's `ip_address`), no tags.
- The form has no language choice: every subscriber gets both languages. The panel text says so (`subscribe.desc`).
- Sending: when a post is published in both languages, Vernon sends one email from the newsletter by hand, with the English post first and the Chinese post after it. The site needs nothing for this. (Emails may hold both languages; the rule against mixing applies to pages.)

### Phase 2: paid add-ons (only after Vernon decides to pay)

- The tagging and RSS-to-email add-ons on the same newsletter. The form gets back an `English` / `中文` choice (defaulting to the current edition) and `/api/subscribe` adds `tags: [language]`; existing subscribers keep receiving both until they choose.
- Two RSS-to-email automations, one per edition feed (`/feed.xml` → `en`, `/zh/feed.xml` → `zh`).

### Both phases

- Double opt-in stays on in Buttondown (the default), so Buttondown sends the confirmation email. The form shows the "Almost done" state on success, the field error on an invalid address, and a generic retry message on any other error. An address that is already subscribed also shows "Almost done" (never reveal whether an address is on the list).
- Rate-limit `/api/subscribe` with the existing `lib/rate-limit.ts` and add a honeypot like the contact form.
- `/privacy` and `/zh/privacy`: what is stored (email, confirmation time), that Buttondown stores and sends it, how to unsubscribe (link in every email) and how to ask for deletion.

---

## Page assembly

Every route file only composes: it reads `params`, guards the locale, loads the dictionary and content, then returns one [page layout](components.md#page-layouts) whose children are components. No HTML elements, `className`, `style` or literal text in a route file (README hard rules 20–22, checked by `npm run lint`). The recipes below are the complete JSX of each page; everything they render is in [components.md](components.md).

The root layout `app/[lang]/layout.tsx` is the one place raw elements appear, and only these two:

```tsx
<html lang={htmlLang} className={fontVariables} suppressHydrationWarning>
	<body>
		<Providers>{children}</Providers>
		<ThemeScript />
	</body>
</html>
```

### Homepage (`/`, `/zh`)

```tsx
<HomeLayout
	locale={lang}
	dictionary={dict}
	alternates={alternates}
	linkColumn={homeLinks}
>
	<Hero profile={profile} dictionary={dict} />
	<AboutSection profile={profile} dictionary={dict} />
	<ExperienceSection profile={profile} dictionary={dict} />
	<ProjectsSection profile={profile} dictionary={dict} />
	<SkillsSection profile={profile} dictionary={dict} />
	<ContactPanel dictionary={dict} />
</HomeLayout>
```

No figures band (removed by decision). Link column: On this page §1–§5; Elsewhere: Writing →, Resume →, GitHub ↗, LinkedIn ↗.

### Writing index (`/writing`, `/zh/writing`)

```tsx
<WritingLayout
	locale={lang}
	dictionary={dict}
	alternates={alternates}
	linkColumn={writingLinks}
>
	<WritingHeader dictionary={dict} />
	<WritingIndex posts={posts} searchIndex={index} dictionary={dict} />
	<SubscribePanel locale={lang} dictionary={dict} />
</WritingLayout>
```

WritingIndex renders SearchBar → §2 Latest (FeaturedPost, newest published post) → §3 Topics (two TopicBlocks) → §4 Archive (toolbar → YearSeparator → ArchiveRows… → closing rule, or EmptyState, which also shows "No posts yet" when the edition has no posts). Latest and Topics are hidden while searching or filtering.

Link column: On this page §1 Search · §2 Latest · §3 Topics · §4 Archive; Elsewhere: Home ←, Resume →, RSS ↗, GitHub ↗, LinkedIn ↗.

### Post (`/writing/{slug}`, `/zh/writing/{slug}`)

```tsx
<PostLayout
	locale={lang}
	dictionary={dict}
	alternates={alternates}
	linkColumn={postLinks}
>
	<PostHeader post={post} dictionary={dict} />
	<PostBody content={post.content} />
	<HowWritten dictionary={dict} />
	<SubscribePanel locale={lang} dictionary={dict} />
	<PostActions dictionary={dict} />
	<RelatedPosts posts={related} dictionary={dict} />
</PostLayout>
```

Link column: On this post (one item per `##`, §n); Elsewhere: All writing ←, Home ←, RSS ↗, GitHub ↗.

### Resume (`/resume`, `/zh/resume`)

A single printable column, no link column. Content from `lib/resume/{en,zh}.ts` only. Section order follows Vernon’s resume PDF.

```tsx
<ResumeLayout locale={lang} dictionary={dict}>
	<ResumeHeader
		resume={resume}
		updated={<ResumeUpdated date={resume.updated} dictionary={dict} />}
	/>
	<ResumeSummary resume={resume} dictionary={dict} />
	<ResumeSkills resume={resume} dictionary={dict} />
	<ResumeExperience resume={resume} dictionary={dict} />
	<ResumeProjects resume={resume} dictionary={dict} />
	<ResumeAwards resume={resume} dictionary={dict} />
	<ResumeEducation resume={resume} dictionary={dict} />
</ResumeLayout>
```

**PDF.** `/resume.pdf` and `/zh/resume.pdf` are real PDFs generated on request from the same `resume.json` with `@react-pdf/renderer` (it replaces the separate `resume-main` generator, whose layout it follows), so the page and the PDF never drift. The download is named `Vernon Wee Hong KOH - Resume.pdf` (Chinese: `Vernon Wee Hong KOH - 简历.pdf`). Layout: A4, 40pt margins, 10pt Ubuntu Sans Mono (Chinese: Noto Sans SC, subset to the text), black on white; a 12pt bold name, the title and the contact line (email · site · GitHub · LinkedIn, no phone or nationality); then Summary, Skills, Experience, Projects, Awards and Education, each under an uppercase bold heading with a 1pt rule, rows in a 170pt label column plus details, pages breaking where they fall. Colours come from `printTokens` in `lib/design-tokens.ts` (print is exempt from the colour rule). Job-specific versions later: an override file per application on top of the generic `resume.json`, rendered by the same document.

Each `Resume{Section}` is a [ResumeSection](components.md#resume-components); Skills, Experience and Projects use ResumeRows. Print: keep `@page { size: A4; margin: 0 }` and replace the old print variable block with:

```css
@media print {
	:root,
	.dark {
		--paper: #ffffff;
		--raised: #ffffff;
		--sunken: #ffffff;
		--ink: #000000;
		--ink-soft: #222222;
		--ink-muted: #444444;
		--rule: #cccccc;
		--rule-strong: #000000;
		--marker: transparent;
		--marker-ink: #000000;
		--night: #ffffff;
		--on-night: #000000;
		--track-display: 0em; /* negative tracking breaks PDF text extraction */
	}
	html,
	body {
		font-size: 9.5pt;
		line-height: 1.4;
	}
}
```

(Print is the one place pure black is allowed: it is ink on paper, not a background.)

### Not found (per edition)

`app/[lang]/not-found.tsx`:

```tsx
<NotFoundLayout locale={locale} dictionary={dict} alternates={alternates}>
	<NotFoundMessage homeHref={homeHref} dictionary={dict} />
</NotFoundLayout>
```

Unknown paths under `/zh/…` render the Chinese version; everything else the English one.

---

## Metadata

- `pageMetadata()` gains `locale` and `alternates.languages` (en, zh-Hans, x-default).
- Open Graph `locale`: `en_SG` / `zh_CN`.

### Share images (Open Graph / Twitter)

1200 × 630, generated with `next/og` `ImageResponse` per page and per edition (`opengraph-image.tsx` and `twitter-image.tsx` under each route, as today). Always the light theme.

- Layout: `paper` background; 72px padding; top-left the VK monogram (64px `marker` square, `radius-sm`, `marker-ink` text) and "Vernon KOH"; bottom-left the title in Bricolage 800 (Chinese: Noto Sans SC 900), max two lines, with the page's highlighted phrase on a `marker` box; top-right a small mono label (`Writing` / `写作`, `Resume` / `简历`, or the post topic); a 16px dot grid in `dots-on-marker` colour across the right third.
- Markup: the image route only loads fonts and data and returns `new ImageResponse(<ShareImage {...props} />, size)`. All the image's elements and inline styles live in `components/share/share-image.tsx` (inline `style` is allowed there because `ImageResponse` has no Tailwind). `icon.tsx` and `apple-icon.tsx` work the same way with a `MonogramIcon` component.
- Titles: homepage = hero statement; Writing = index heading; post = post title and `highlight`; resume = "Vernon Wee Hong KOH" + role.
- Fonts: `ImageResponse` cannot use `next/font`; fetch the TTF files for Bricolage Grotesque 800, Geist 500, Geist Mono 500 and (Chinese only) Noto Sans SC 900 subset to the title's characters, at build time.
- Colours: `ImageResponse` cannot read CSS variables, so share images use the light-theme values from a single `lib/design-tokens.ts` constant (generated from or checked against `theme.css` by a unit test). This is the only place outside `theme.css` where colour values may appear.

### SEO checklist (every page, both editions)

- `<html lang>` (`en` / `zh-Hans`); a localized `<title>` and description from the dictionary or the content; one `h1`.
- Canonical URL plus `hreflang` alternates (en, zh-Hans, x-default) and the edition's RSS link, all through `pageMetadata()`.
- Open Graph (type, url, locale with the other edition as `alternateLocale`, title, description, share image) and `summary_large_image` Twitter cards. Posts add `article` published and modified times, section (topic) and author.
- JSON-LD from `lib/structured-data.ts`, rendered with the `JsonLd` component. Every page carries the edition's `WebSite` and the shared `Person` (facts from `resume.json`; `alternateName` lists the spellings people search for, the only place "Koh" appears). The homepage adds `ProfilePage`, the resume `ProfilePage` + `BreadcrumbList`, the Writing index `CollectionPage`, each post `BlogPosting` + `BreadcrumbList`. Every node has `inLanguage`.
- `/sitemap.xml`: both editions, each URL with its alternates and `lastmod` (the resume's `updated` date, or the post's `updatedOn` / `publishedOn`).
- `/robots.txt` and the robots meta: indexing only in production (`NEXT_PUBLIC_APP_ENVIRONMENT=production`); everywhere else `noindex, nofollow` and `Disallow: /`.
- `/manifest.webmanifest`, the VK icon at 32, 192 and 512px and the 180px Apple icon; `theme-color` for light and dark.
- Share images are served at their `/en/…` paths without a redirect; the search index sends `X-Robots-Tag: noindex`; unknown URLs return a real 404 with a localized title.
- Optional `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` adds the Search Console meta tag.
