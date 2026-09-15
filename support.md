---
layout: page
title: Support
permalink: /support/
---

# Bezant Support

Bezant is a personal finance planning app for iOS. This page is the support URL we list on App Store Connect.

## Common questions

### How do I get started?

Open Bezant. The first launch shows a three-card onboarding. **Skip** (on the first two cards) or **Try demo →** (on the last) drops you straight in with pre-seeded sample data; **Get started** sets up your own profile on an empty canvas. After that there are three tabs — **Home**, **Track** and **Settings** — plus one floating **+** button. Tap it for the create menu (log an expense, add a goal, add a saving); press and hold it to jump straight to Quick Log.

### Where is my data stored?

Locally on your iPhone, in iOS's `UserDefaults` system. Nothing is uploaded to any server we run.

### Does Bezant work with my bank?

No — by design. Bezant is a **manual-entry planner**, not a bookkeeping app. You enter your balances, incomes, and expenses yourself. This means: no bank credentials to share, no aggregator service in the loop, and your data never leaves your device unless you turn on iCloud sync.

### How do I sync across devices?

Settings → **iCloud sync** → **Sync now**. The first sync after enabling pulls existing data from iCloud; subsequent saves push automatically (debounced). iCloud sync is end-to-end via Apple's CloudKit private database — you control the data, not us.

### How do allocation strategies work?

Settings → **Allocation**. Two options:

- **Priority** (default): Each goal's share is weighted by its tier — Top (3) / Mid (2) / Low (1). When a goal hits its target the leftover cascades to the remaining goals by the same weights.
- **Even**: The monthly surplus is split equally across all active goals.

The What-if simulator (Home → **"What if…"** card) lets you preview how slider changes (extra contribution, expense cut, lump sum) shift your goal completion dates — without committing the changes.

### How do I import expenses from a spreadsheet?

Settings → **Import expenses from CSV**. Paste a CSV with a header row (`Name, Amount, Date, Category, Frequency, IsFixed, Notes`). Only **Name** and **Amount** are required. Preview opens automatically; tap **Import** to commit.

A few things worth knowing before you paste a bank statement:

- **Rows with no Frequency import as one-time spending.** Add `Frequency` (`monthly`, `weekly`, `yearly`, …) for recurring bills — otherwise a 12-line trip would become twelve monthly commitments.
- **Dates are `YYYY-MM-DD`.** `03/04/2026` is refused rather than guessed at, because it means two different months either side of the Atlantic. A one-time row with no date is dated the day you import it, and the preview shows you that date before you commit.
- **A row Bezant can't read is skipped, not corrected.** The count above the preview says how many rows were refused, and the reason for each is listed. (A very large paste is also truncated — that limit is reported separately.)

### How do I back up?

Settings → **Save backup to Files**. Saves a JSON snapshot you can keep in iCloud Drive or Files. To restore, **Migrate from backup**.

### I deleted something by mistake.

Within five seconds of any delete you'll see an **Undo** banner at the bottom of the screen. Tap **Undo** to restore.

### How do I hide amounts?

Settings → **Hide amounts**. All values display as `$••••`. If you also enable **Face Unlock**, Face ID is required before amounts can be unhidden.

### Currency / FX rates

Currency selection in Settings → Currency. Conversion uses the European Central Bank's daily reference rates, fetched in the background once per day. If you're offline, Bezant uses the last cached rates (and falls back to a hardcoded MYR rate of 4.7 if there's never been a fetch).

### Widgets / Siri

Long-press your Home Screen → Edit → Add Widget → search Bezant. Eight widgets ship:

- **Home Screen:** Quick Log (medium and large), Quick Log (small), Net Worth, and Top Goal.
- **Lock Screen:** Quick Log, Net Worth, Top Goal, and Streak.

On iOS 18 there's also a **Quick Log** control for Control Center and the Action button.

For Siri, say "What's my net worth?", "Log an expense in Bezant", or "Quick log in Bezant".

### PDF statements

Settings → **Export PDF statement**. Generates a printable monthly summary you can share via Files, AirDrop, or any share-sheet target.

## Bug reports and feature requests

Email **benliewvb@gmail.com** with:
- Your iOS version (Settings → General → About → Software Version)
- Your Bezant version (Settings → scroll to bottom)
- A description of what you saw vs. what you expected
- A screenshot if possible

We read every message but reply on a best-effort basis — Bezant is a small project.

## Privacy

See the [Privacy Policy](/privacy/).

## Contact

**benliewvb@gmail.com**
