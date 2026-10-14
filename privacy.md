---
layout: page
title: Privacy Policy
permalink: /privacy/
---

# Privacy Policy

**Effective date:** August 26, 2026
**Last updated:** October 14, 2026 (version 1.1: no sign-in, how iCloud sync starts and stops, and Erase all data without iCloud)
**App:** Bezant (iOS)
**Contact:** ben@benliew.xyz

Bezant is a personal finance planning app. The short version: **we don't collect, transmit, or sell your data.** This page exists because Apple requires every App Store app to link a privacy policy, and to clearly state what little data flow there is.

## Data we collect on our servers

**None.** Bezant has no backend. There is no analytics SDK, no crash reporter that we operate, and no advertising identifier collection. We never see your financial data: it stays on your devices and in your own iCloud.

## No accounts, no sign-in

Bezant has no accounts. From version 1.1 it asks for no sign-in at all: no name, no email, no login.

**Version 1.0** offered an optional **Sign in with Apple** during onboarding, to label your local profile. It was never an account on any server of ours:

- If you used it, Apple gave the app your chosen name and email (or a private relay address, if you chose "Hide My Email") plus an opaque per-app user identifier. These were stored on your device. We do not transmit, log, or receive them — there is no server to send them to.
- 1.0 also **named your first profile** after that name (or, if you did not share a name, after the start of your email address). A profile's name is part of what syncs: when Bezant syncs with your iCloud, the name travels with the profile to your own iCloud and your other devices, as described below. You can rename a profile at any time: tap your profile at the top of Bezant's Settings.
- Version 1.1 removes Sign in with Apple. Erasing all data (below) removes what 1.0 stored on the device and, when you erase with iCloud on for Bezant, strips the profile names from iCloud. Uninstalling removes what is on the device, but not the copy in your iCloud.
- Bezant stays in the list of apps using Sign in with Apple in your Apple ID settings until you remove it there.

**Erasing your data:** Settings → Your data → *Erase all data* (in 1.0: Settings → Account → *Delete account & data*) removes every profile from your device. What happens to the copy in your iCloud depends on iCloud when you erase:

- **Signed in to iCloud, with iCloud on for Bezant:** it erases Bezant's data on this iPhone and strips your data from the records synced to your iCloud.
- **Not signed in to iCloud:** it erases Bezant's data on this iPhone only. Any copy synced to your iCloud earlier stays there until you erase again while signed in with iCloud on for Bezant, and it can sync back to this iPhone if you sign in to iCloud on it again.
- **Signed in with iCloud on for Bezant, but iCloud can't be reached** (for example, you are offline): it stops, erases nothing, and asks you to try again.

If you have turned iCloud off for Bezant (see below), turn it back on before you erase, so the erase can reach the copy in your iCloud.

In version 1.0, *Delete account & data* erases nothing at all unless Bezant can reach your iCloud. Two more limits:

- If Bezant is offering you an older on-device copy of your data (shown in Settings when saved data could not be read), that copy is kept until you discard it.
- Uninstalling Bezant removes everything Bezant keeps on the device (a backup you saved to Files is yours, and stays), but not the copy in your iCloud.

## Data stored on your device

Everything you enter into Bezant is stored locally in iOS's `UserDefaults` system — the same storage iOS uses for any app's settings. That covers:

- Your financial entries: savings sources, goals and their contributions, expenses, incomes, monthly snapshots, category budgets, and events (date-bounded budgets such as a trip) with their planned items.
- Your activity: logged spending dates and no-spend days (used for the streak).
- Your settings: currency, accent color, the hide-amounts and Face Unlock toggles, the allocation strategy, and your reminder preference.
- In version 1.0 only, the optional Sign in with Apple name and email described above.
- **A merchant memory.** When you log an expense, Bezant remembers on-device which category you chose for that merchant name, so it can pre-fill the category next time. This is a simple tally kept in the same local storage, and it syncs to your own iCloud with the rest of your profile (below) — it is never uploaded anywhere we can see, and it is removed with the rest of your data.

Profiles keep separate copies of all of the above. When you uninstall Bezant, iOS removes all of it.

## iCloud sync

Bezant has no sync switch of its own. Whenever your iPhone is signed in to iCloud, Bezant syncs your data to **your own** iCloud account's private database, unless you turn iCloud off for Bezant (below); when it is not, your data stays on the device. Specifically:

- **Where:** Apple's CloudKit private database, scoped to your Apple ID.
- **Who can see it:** You, and — depending on your iCloud settings — Apple. Your financial data is written to a **CloudKit asset** (older versions used an encrypted CloudKit field; those are read once and replaced). Assets are encrypted in transit and at rest. Whether they are *end-to-end* encrypted — meaning Apple holds no key that can read them — depends on your account: per [Apple's iCloud data security overview](https://support.apple.com/en-us/102651), "when you turn on Advanced Data Protection, third-party app data stored in iCloud Backup and CloudKit encrypted fields and assets are end-to-end encrypted". Without Advanced Data Protection, Apple can access this data. **We** never can, either way — we run no server and have no admin access to your container.
- **What's stored:** The same data your device holds locally, serialized as JSON. It travels as an asset because a CloudKit record is capped at 1 MB and a long history outgrows that, at which point syncing would stop. Two small pieces of each record are *not* encrypted, because CloudKit needs them to list and order records: the profile's display name, and the timestamp of its last change.
- **Older records:** Before we moved to encrypted fields, the app wrote this JSON into an ordinary (unencrypted) CloudKit field in your private database. If you synced before that change, a copy may still sit in that old field until the app next uploads that profile, at which point it is deleted. Erasing all data with iCloud on for Bezant (below) strips your data from those records.
- **When it leaves your device:** Whenever you save changes (debounced), and on-demand via Settings → Sync now.
- **How to turn it off:** turn iCloud off for Bezant in the iOS Settings app: tap your name, then **iCloud**, then **See All** next to *Saved to iCloud*, then tap Bezant and turn it off ([Apple's steps](https://support.apple.com/en-us/118225); older iOS versions label these screens differently). Apple says an app turned off there no longer connects with iCloud, so Bezant stops syncing. Bezant does not erase the copy already in your iCloud when you turn it off; to remove that, erase all data first (next point). If you have already turned it off, turn it back on for Bezant, then erase.
- **How to delete:** Settings → Your data → *Erase all data* (in 1.0: Settings → Account → *Delete account & data*), done while you are signed in to iCloud with iCloud on for Bezant, strips your data and profile names from the synced records in your iCloud, leaving only an empty deletion marker (an id and two timestamps) so your other devices delete their copies too. If you erase while not signed in to iCloud, the iCloud copy stays until you erase again while signed in with iCloud on for Bezant. Uninstalling Bezant does not remove it.

We never see this data. We have no admin access to your CloudKit container.

## Foreign exchange rates

Bezant fetches the European Central Bank's public daily reference rates from `www.ecb.europa.eu` to convert between currencies. This is a one-way GET request to a public XML file — no user identifier, no payload, no cookies. The ECB does not receive any information about you beyond what your iOS device sends to any HTTPS server (IP address, user agent).

## Tracking and identifiers

**No tracking.** We don't use IDFA, fingerprinting, third-party trackers, or any identifier for advertising. We don't share data with third parties — there are no third parties to share with.

Our App Store privacy label reads: **Data Not Collected.**

## Permissions we ask for

- **Face ID (Touch ID):** Optional. Used only when you enable "Face Unlock" in Settings to gate the privacy mask. The biometric data itself never leaves the Secure Enclave on your device.
- **Siri / Shortcuts:** Optional. Used only when you invoke the "What's my net worth?" or "Log expense" shortcuts. Apple processes the voice input; we receive only the resolved intent parameters.
- **iCloud:** Optional. Used whenever your iPhone is signed in to iCloud, unless you turn iCloud off for Bezant (see above).
- **Photos (add only):** Optional. iOS asks only when you share the snapshot image from Home and choose to save it to your photo library. This access lets Bezant add images; it cannot read your library, and Bezant never asks to.
- **Notifications:** Optional, and there is one, and it is **local**: the daily log reminder (Settings → Daily reminder), which nudges you only on days you haven't logged. It is scheduled entirely on your device — there is no push server, nothing is sent to us, and it carries no marketing or tracking content.

We do not request: contacts, read access to your photos, location, microphone (Apple's Siri layer is separate), camera, calendar, system Reminders, health data, motion data, **remote/marketing push notifications**, or background app refresh.

## Children's privacy

Bezant is suitable for general audiences. We do not knowingly collect personal information from any user — including children under 13.

## Changes

If we materially change this policy we'll update the "Effective date" above and push a new build of Bezant that links to the updated version. The current version of this document is the source of truth.

## Contact

Questions? Email **ben@benliew.xyz**.
