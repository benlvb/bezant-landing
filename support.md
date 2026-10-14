---
layout: page
title: Support
permalink: /support/
---

{% include jsonld-faqpage.html %}

# Bezant Support

Bezant is a personal finance planning app for iOS. This page is the support URL we list on App Store Connect.

## Common questions

### What is Bezant?

A private, on-device money app for iPhone and Apple Watch. Plan goals, log expenses in one tap, and keep data on your device — no account required, no bank linking.

### Does Bezant link to my bank?

No. Manual-entry only.

Bezant is a **manual-entry planner**, not a bookkeeping app. You enter your balances, incomes, and expenses yourself. This means: no bank credentials to share, no aggregator service in the loop, and nothing leaves your device except the sync to your own iCloud, which runs whenever your iPhone is signed in to iCloud.

### Do I need an account?

No. Bezant has no accounts, and you never need to sign in.

Version 1.0 offered an optional Sign in with Apple. It was never an account on any server of ours, and skipping it changed nothing. It named your first profile after you; that name syncs with the profile when Bezant syncs with your iCloud, and you can rename it by tapping your profile at the top of Settings. See the [privacy policy](/privacy/) for details.

### Where is my data stored?

On iPhone by default. Optional iCloud = your CloudKit private DB; E2E needs Advanced Data Protection.

Locally, Bezant uses iOS's `UserDefaults` system. Nothing is uploaded to any server we run.

### Is Bezant free?

Yes. v1.0 free on the App Store.

### Can I log expenses quickly?

Yes — Quick Log, widgets, Siri, Watch; inbox until categorized.

Long-press your Home Screen → Edit → Add Widget → search Bezant. Eight widgets ship:

- **Home Screen:** Quick Log (medium and large), Quick Log (small), Net Worth, and Top Goal.
- **Lock Screen:** Quick Log, Net Worth, Top Goal, and Streak.

On iOS 18 there's also a **Quick Log** control for Control Center and the Action button.

For Siri, say "What's my net worth in Bezant?", "Log an expense in Bezant", or "Quick log in Bezant".

### What are streaks?

Log a spend or $0 no-spend day for a daily flame; milestones 7/30/100.

### Can I plan savings goals with dates?

Yes; Top/Mid/Low; What-if on Home for funded-by dates.

Settings → **Allocation strategy**. Two options:

- **Priority** (default): Each goal's share is weighted by its tier — Top (3) / Mid (2) / Low (1). When a goal hits its target the leftover cascades to the remaining goals by the same weights.
- **Even**: The monthly surplus is split evenly across all active goals. Spillover redistributes when a goal caps.

The What-if planner (Home → **"What if…"** card) lets you preview how slider changes (extra contribution, expense cut, lump sum) shift your goal completion dates — without committing the changes.

### Can I track a trip or overseas expenses?

Yes; Events for time-bounded trip budgets + category logs; manual entry, no bank import.

### Does Bezant work on Apple Watch?

Yes — glance, complications, Digital Crown quick-log.

### Which currencies?

USD, MYR, EUR, SGD via ECB rates.

Currency selection in Settings → Currency. Conversion uses the European Central Bank's daily reference rates, fetched in the background once per day. If you're offline, Bezant uses the last cached rates. If a rate still can't be resolved, display and entry fall back to USD together — there is no hardcoded FX fallback.

### How do I get help?

Email **ben@benliew.xyz** — see [Support](/support/).

Include:

- Your iOS version (Settings → General → About → Software Version)
- Your Bezant version (Settings → scroll to bottom)
- A description of what you saw vs. what you expected
- A screenshot if possible

We read every message but reply on a best-effort basis — Bezant is a small project.

## How to

### How do I get started?

Open Bezant. From version 1.1 the first launch is two short screens: tap **Continue**, pick your currency, then **Start** for an empty profile of your own (**Skip** does the same with your region's currency), or tap **Explore with sample data** to look around first; Settings → **Exit demo** clears it. If Bezant finds your data in iCloud on a new install, it offers to restore it. In version 1.0 the first launch was a three-card onboarding with **Try demo** and **Get started**. After that there are three tabs — **Home**, **Track** and **Settings** — plus one floating **+** button. Tap it for the create menu (log an expense, add a goal, add a saving); press and hold it to jump straight to Quick Log.

### How do I sync across devices?

There is nothing to turn on: whenever your iPhone is signed in to iCloud, Bezant syncs on its own. It pulls from iCloud when the app launches and pushes your changes shortly after each save; Settings → **iCloud sync** → **Sync now** syncs on demand. Sync writes to **your** iCloud account's CloudKit private database (as an asset). That copy is end-to-end encrypted only if you turn on [Advanced Data Protection](https://support.apple.com/en-us/102651) — without ADP, Apple can access it. We never can: we run no server and have no admin access to your container.

To stop syncing, turn iCloud off for Bezant in the iOS Settings app: tap your name, then **iCloud**, then **See All** next to *Saved to iCloud*, then tap Bezant ([Apple's steps](https://support.apple.com/en-us/118225)). That stops future syncing but leaves the copy already in your iCloud; to remove it, erase all data (below) first.

### Using Bezant on more than one device

If you use Bezant on more than one device with the same iCloud account (two iPhones, or an iPhone and an iPad), update every one of them to version 1.1 before you add planned items to an event. Version 1.0 can't read a profile that has planned items: it keeps its own older copy of that profile and shows a notice under **iCloud sync** in Settings asking you to update the app. If you see it, update that device before you change that profile there: if you edit it on 1.0 first, updating later can lose either those edits or the planned items on your other devices.

### How do I import expenses from a spreadsheet?

Settings → **Import expenses from CSV**. Paste a CSV with a header row (`Name, Amount, Date, Category, Frequency, IsFixed, Notes`). Only **Name** and **Amount** are required. Preview opens automatically; tap **Import** to commit.

A few things worth knowing before you paste a bank statement:

- **Rows with no Frequency import as one-time spending.** Add `Frequency` (`monthly`, `weekly`, `yearly`, …) for recurring bills — otherwise a 12-line trip would become twelve monthly commitments.
- **Dates are `YYYY-MM-DD`.** `03/04/2026` is refused rather than guessed at, because it means two different months either side of the Atlantic. A one-time row with no date is dated the day you import it, and the preview shows you that date before you commit.
- **A row Bezant can't read is skipped, not corrected.** The count above the preview says how many rows were refused, and the reason for each is listed. (A very large paste is also truncated — that limit is reported separately.)

### How do I back up?

Settings → **Save backup to Files**. Saves a JSON snapshot you can keep in iCloud Drive or Files. To restore, **Migrate from backup**.

### How do I erase all my data?

Settings → **Your data** → **Erase all data** (in 1.0: Settings → Account → Delete account & data). It removes every profile from this device and starts Bezant fresh. What happens to your iCloud copy depends on iCloud when you erase:

- **Signed in to iCloud:** it also strips your data from your iCloud.
- **Not signed in to iCloud:** it erases this iPhone only. Anything synced to your iCloud earlier stays there until you erase again while signed in.
- **Signed in, but iCloud can't be reached** (for example, you're offline): it erases nothing and asks you to try again.

In 1.0 it erases nothing unless you are signed in to iCloud and it can be reached. Uninstalling Bezant removes everything Bezant keeps on the device, but not your iCloud copy (a backup you saved to Files stays too).

### I deleted something by mistake.

Within five seconds of any delete you'll see an **Undo** banner at the bottom of the screen. Tap **Undo** to restore.

### How do I hide amounts?

Settings → **Hide amounts**. All values display as `$••••`. If you also enable **Face Unlock**, Face ID / Touch ID is required before amounts can be unhidden. With lock on, the app-switcher snapshot is blurred so balances don't flash in Recents.

### PDF statements

Settings → **Export PDF statement**. Generates a printable monthly summary you can share via Files, AirDrop, or any share-sheet target. **SURPLUS** is that month's actuals (income minus expenses, including one-time logs). Goal dates on the same PDF use your usual **planning surplus** (recurring income minus recurring expenses), so a one-time bonus or bill does not move those dates.

## Privacy

See the [Privacy Policy](/privacy/).

## Contact

**ben@benliew.xyz**
