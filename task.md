# SaaS Idea Generator from Reddit

## 📌 Goal

Build a minimal viable SaaS that helps beginner founders generate product ideas.
The service tracks new popular subreddits where users discuss problems and, based on insights, generates product ideas with a **promising score**.

---

## 🚀 How It Works (MVP Flow)

1. **Source Collection**: Periodically fetch a list of popular subreddits where people share problems.
2. **Signal Extraction**: Extract problem statements, pain points, and engagement from fresh posts/comments.
3. **Idea Generation**: Use an LLM to generate short product ideas:

   - Name
   - Elevator pitch
   - Target audience
   - Pain point solved

4. **Scoring**: Provide numerical or text-based scoring (e.g. pain severity, willingness to pay, competition, TAM).
5. **Delivery**: Show users a feed of fresh recommendations, with optional email subscriptions and filters.

---

## ⚙️ Functional Requirements (MVP)

- **Landing Page**: One-page product description (Hero block, value proposition, CTA _Get started_).
- **Authentication**: Register, login, logout via **Supabase Auth**.
- **Recommendations Feed**:

  - Idea name
  - Short pitch (1–2 sentences)
  - Key insight/pain
  - Source (subreddit/link)
  - Scoring (0–100)
  - “New” badge

- **Email Subscriptions**:

  - Form + topic filter (e.g. devtools, health, education)
  - Integration with SaaS provider (Resend, Mailgun, SendGrid, Postmark)
  - Proper unsubscribe (via email link or profile)

- **LLM Integration**:

  - Generate and score product ideas
  - Configurable prompts and structured response typing

---

## 🛠️ Tech Stack

- **GitHub** (repository with commit history)
- **React + Node.js + TypeScript** (Next.js optional)
- **Supabase** (Auth + Postgres)
- **LLM** (OpenAI, Gemini, or similar)
- **Email SaaS** (Resend/Mailgun/SendGrid/Postmark)
- **Cursor** (mandatory; AI workflow part of the task)

---

## 📂 Required Artifacts

- Public (or link-accessible) GitHub repository
- `.cursor/` folder with:

  - `rules.md` (AI rules/constraints: architecture, style, commit conventions)
  - `PROMPTS.md` (5–10 key prompts with context + results)
  - Full interaction history with Cursor (export/screenshots)

- `README.md` including **local setup instructions**

---

## 🕒 Prioritization

You have up to **8 hours** to implement as much useful functionality as possible.
Feature prioritization is part of the evaluation.

---

## 📬 What to Deliver

- Link to GitHub repository
- Export/screenshots of Cursor history + `.cursor/` folder
- Final `README.md`

---
