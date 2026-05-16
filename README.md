# remove-barriers

```md
# Lattice

Lattice is a public-interest research product for understanding power and policy.

It has two core tools:

- **Exposé**: reveals hidden relationships between politicians, companies, donors, think tanks, media organisations, and institutions
- **Policy Translator**: turns complex UK bills into plain English so people can quickly understand what a policy does, who it affects, and why it matters

The problem Lattice solves is simple: the public’s most important questions are buried in scattered records, technical language, and disconnected systems. Lattice brings those records together into something readable, searchable, and easier to act on.

## What it does

### Exposé
Exposé helps users investigate people, companies, and institutions through a more accessible research interface.

It includes:

- a **browser extension** that highlights known entities directly inside articles and webpages
- a **3D investigator** that maps connections between people, companies, institutions, events, and reporting
- source-linked dossiers with summaries, contradictions, relationships, and verification links
- built-in case studies showing how hidden networks operate in real UK scandals and public controversies

### Policy Translator
Policy Translator helps people understand UK legislation without needing legal or parliamentary expertise.

It includes:

- bill summaries in plain English
- key takeaways and who the bill affects
- profile-based views for different kinds of users
- saved summary history for previous searches
- support for translating live bill content through the deployed API

## Why it matters

Lattice is designed for:

- journalists
- researchers
- campaigners
- students
- civic organisations
- ordinary citizens trying to understand how power works

Instead of forcing users to search across filings, registries, parliamentary pages, and corporate records one by one, Lattice turns that work into a clearer research workflow.

## Current product areas

- `/` Homepage and product overview
- `/expose` Exposé product landing page
- `/expose-tool` 3D investigator
- `/bills` Policy Translator

## Tech stack

- **Astro**
- **React**
- **Tailwind-style utility classes**
- **Vercel** for deployment
- **Chrome extension** for inline entity context
- **Kimi / Moonshot API** for research and translation flows

## Getting started

### Requirements

- Node.js **22**
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Environment variables

Create a `.env` file if needed for local API routes.

```bash
MOONSHOT_API_KEY=your_key_here
```

If deploying on Vercel, add the same environment variable in project settings.

## Browser extension

The extension lives in the `extension/` folder.

To test it locally:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Reload the pages you want to test

The extension currently supports seeded public-data dossiers for selected UK politicians, parties, think tanks, companies, and media organisations.

## Project structure

```bash
src/
  components/
  data/
  layouts/
  pages/
    api/
    bills/
    expose.astro
    expose-tool.astro
extension/
public/
```

## Status

Lattice is currently an evolving product prototype with working public-facing flows.

Current focus areas include:

- better source-backed entity coverage
- stronger investigation workflows
- improved case studies
- clearer plain-English policy explanations
- better public usability across desktop and mobile

## Roadmap

- more live public-record integrations
- richer entity coverage across UK politics and corporate power
- stronger saved research and history features
- better export and collaboration workflows
- more robust source verification and evidence packaging
