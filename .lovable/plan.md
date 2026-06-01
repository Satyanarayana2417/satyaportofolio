# Plan

## 1. Experience section (mobile)
- Hide the description text on cards at mobile breakpoint; keep title, company, dates visible.
- Tap on a card opens a modal with full description + meta.
- Upgrade timeline visuals: animated gradient line that fills as you scroll, glowing pulse dots, staggered fade-in, subtle parallax on cards. Desktop keeps alternating layout, mobile uses a single-column rail with refined spacing.

## 2. Admin: Profile management
- New Firestore doc `site/profile` storing: name, role, bio, profileImageUrl, resumeUrl, socials.
- Admin tab "Profile" lets admin upload/replace/delete profile photo (Cloudinary image) and upload/replace/delete resume (Cloudinary raw PDF).
- Hero/About sections read from this doc with fallback to current static data.

## 3. Admin: Contact inbox
- Contact form writes to Firestore `contacts` collection (name, email, message, createdAt, read flag).
- New Admin tab "Messages" lists submissions newest-first, mark as read, delete, reply via mailto.
- Unread badge on the tab.

## 4. Mobile notifications for new contact messages
- Use Web Push via the browser Notification API + a realtime Firestore listener while the admin page is open.
- When admin grants permission, any new unread submission triggers a `new Notification(...)` (works on mobile when the admin tab is open / installed as PWA).
- Add a small "Enable notifications" button in admin header. (True background push would need a service worker + FCM server key; we'll wire the in-app realtime notifications now and note the PWA/background limitation.)

## 5. Admin: Social links
- Stored on the same `site/profile` doc: github, linkedin, twitter, instagram, email, website (each optional).
- Editable from the Profile tab; Hero / Contact / Footer read from it.

## 6. Admin: Resume upload
- Upload PDF to Cloudinary (resource_type=raw), save URL on `site/profile.resumeUrl`.
- "View Resume" button in NavBar / Hero links to that URL (fallback to bundled PDF).

## Technical notes
- Extend `src/lib/cloudinary.ts` with a `uploadRawToCloudinary` for PDFs.
- Add `src/hooks/useSiteProfile.ts` (onSnapshot on `site/profile`).
- Add `src/hooks/useContactMessages.ts`.
- Refactor `src/routes/admin.tsx` into tabs: Projects | Profile | Messages.
- Contact form (`ContactSection`) switches from current behavior to `addDoc(collection(db,'contacts'), …)` with zod validation.
- Notifications: request permission on demand, then on snapshot diff of unread messages call `new Notification()` + play a short sound.

## Out of scope (will note to user)
- True background push when admin app is closed (requires FCM service worker + server key + HTTPS PWA install). Can add as follow-up.
