---
layout: page
title: Privacy Policy
permalink: /privacy/
---

# Privacy Policy

**Effective date:** August 26, 2026
**Last updated:** October 1, 2026 (no sign-in from version 1.1)
**App:** Bezant (iOS)
**Contact:** ben@benliew.xyz

Bezant is a personal finance planning app. The short version: **we don't collect, transmit, or sell your data.** This page exists because Apple requires every App Store app to link a privacy policy, and to clearly state what little data flow there is.

## Data we collect on our servers

**None.** Bezant has no backend. There is no analytics SDK, no crash reporter that we operate, and no advertising identifier collection. We never see your financial data because it never leaves your devices.

## No accounts, no sign-in

Bezant has no accounts. From version 1.1 it asks for no sign-in at all: no name, no email, no login.

**Version 1.0** offered an optional **Sign in with Apple** during onboarding, to label your local profile. It was never an account on any server of ours:

- If you used it, Apple gave the app your chosen name and email (or a private relay address, if you chose "Hide My Email") plus an opaque per-app user identifier. These were stored on your device. We do not transmit, log, or receive them — there is no server to send them to.
- 1.0 also **named your first profile** after that name (or, if you did not share a name, after the start of your email address). A profile's name is part of what syncs: with iCloud sync on, it travels with the profile to your own iCloud and your other devices, as described below. You can rename a profile at any time: tap your profile at the top of Bezant's Settings.
- Version 1.1 removes Sign in with Apple. Erasing all data (below) removes what 1.0 stored on the device and strips the profile names from iCloud. Uninstalling removes what is on the device, but not the copy in your iCloud.
- Bezant stays in the list of apps using Sign in with Apple in your Apple ID settings until you remove it there.

**Erasing your data:** Settings → Your data → *Erase all data* (in 1.0: Settings → Account → *Delete account & data*) removes every profile from your device and strips your data from your iCloud. Two limits:

- It clears your iCloud copy first, so it needs iCloud: if you are not signed in to iCloud, or iCloud cannot be reached, it stops and erases nothing. Uninstalling Bezant removes everything Bezant keeps on the device (a backup you saved to Files is yours, and stays).
- If Bezant is offering you an older on-device copy of your data (shown in Settings when saved data could not be read), that copy is kept until you discard it.

## Data stored on your device

Everything you enter into Bezant is stored locally in iOS's `UserDefaults` system — the same storage iOS uses for any app's settings. That covers:

- Your financial entries: savings sources, goals and their contributions, expenses, incomes, monthly snapshots, and category budgets.
- Your activity: logged spending dates and no-spend days (used for the streak).
- Your settings: currency, accent color, the hide-amounts and Face Unlock toggles, the allocation strategy, and your reminder preference.
- In version 1.0 only, the optional Sign in with Apple name and email described above.
- **A merchant memory.** When you log an expense, Bezant remembers on-device which category you chose for that merchant name, so it can pre-fill the category next time. This is a simple tally kept in the same local storage — it is never uploaded anywhere we can see, and it is removed with the rest of your data.

Profiles keep separate copies of all of the above. When you uninstall Bezant, iOS removes all of it.

## Optional iCloud sync

If you enable iCloud sync (Settings → iCloud → on, plus enable the iCloud capability in your build), Bezant writes your data to **your own** iCloud account's private database. Specifically:

- **Where:** Apple's CloudKit private database, scoped to your Apple ID.
- **Who can see it:** You, and — depending on your iCloud settings — Apple. Your financial data is written to a **CloudKit asset** (older versions used an encrypted CloudKit field; those are read once and replaced). Assets are encrypted in transit and at rest. Whether they are *end-to-end* encrypted — meaning Apple holds no key that can read them — depends on your account: per [Apple's iCloud data security overview](https://support.apple.com/en-us/102651), "when you turn on Advanced Data Protection, third-party app data stored in iCloud Backup and CloudKit encrypted fields and assets are end-to-end encrypted". Without Advanced Data Protection, Apple can access this data. **We** never can, either way — we run no server and have no admin access to your container.
- **What's stored:** The same data your device holds locally, serialized as JSON. It travels as an asset because a CloudKit record is capped at 1 MB and a long history outgrows that, at which point syncing would stop. Two small pieces of each record are *not* encrypted, because CloudKit needs them to list and order records: the profile's display name, and the timestamp of its last change.
- **Older records:** Before we moved to encrypted fields, the app wrote this JSON into an ordinary (unencrypted) CloudKit field in your private database. If you synced before that change, a copy may still sit in that old field until the app next uploads that profile, at which point it is deleted. Erasing all data (below) strips your data from those records.
- **When it leaves your device:** Whenever you save changes (debounced), and on-demand via Settings → Sync now.
- **How to delete:** Settings → Your data → *Erase all data* (in 1.0: Settings → Account → *Delete account & data*) strips your data and profile names from the synced records in your iCloud, leaving only an empty deletion marker (an id and two timestamps) so your other devices delete their copies too. Alternatively, uninstall Bezant from all your devices and sign out of iCloud; Apple removes orphaned CloudKit data per their own retention policy.

We never see this data. We have no admin access to your CloudKit container.

## Foreign exchange rates

Bezant fetches the European Central Bank's public daily reference rates from `www.ecb.europa.eu` to convert between currencies. This is a one-way GET request to a public XML file — no user identifier, no payload, no cookies. The ECB does not receive any information about you beyond what your iOS device sends to any HTTPS server (IP address, user agent).

## Tracking and identifiers

**No tracking.** We don't use IDFA, fingerprinting, third-party trackers, or any identifier for advertising. We don't share data with third parties — there are no third parties to share with.

Our App Store privacy label reads: **Data Not Collected.**

## Permissions we ask for

- **Face ID (Touch ID):** Optional. Used only when you enable "Face Unlock" in Settings to gate the privacy mask. The biometric data itself never leaves the Secure Enclave on your device.
- **Siri / Shortcuts:** Optional. Used only when you invoke the "What's my net worth?" or "Log expense" shortcuts. Apple processes the voice input; we receive only the resolved intent parameters.
- **iCloud:** Optional. Used only when you enable iCloud sync (see above).
- **Notifications:** Optional, and there is one, and it is **local**: the daily log reminder (Settings → Daily reminder), which nudges you only on days you haven't logged. It is scheduled entirely on your device — there is no push server, nothing is sent to us, and it carries no marketing or tracking content.

We do not request: contacts, photos, location, microphone (Apple's Siri layer is separate), camera, calendar, system Reminders, health data, motion data, **remote/marketing push notifications**, or background app refresh.

## Children's privacy

Bezant is suitable for general audiences. We do not knowingly collect personal information from any user — including children under 13.

## Changes

If we materially change this policy we'll update the "Effective date" above and push a new build of Bezant that links to the updated version. The current version of this document is the source of truth.

## Contact

Questions? Email **ben@benliew.xyz**.
