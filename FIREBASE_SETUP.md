# TamuDating Firebase setup

The website is hosted separately; Firebase is used for Authentication and Cloud Firestore only. Do not configure Firebase Hosting unless you later choose it.

## Project connected in code

The Firebase web app config is in `firebase-config.js`. It is public client configuration, not a private service-account credential. Restrict its API key to your production website domains in Google Cloud API key settings before launch. Never commit service-account JSON/private keys.

## Console steps required

1. In Firebase Console, select project `tamu-dating-3a497`.
2. Go to **Authentication → Get started → Sign-in method**, enable **Email/Password**, and save.
3. Go to **Firestore Database → Create database**. Choose production mode and a nearby region; region selection is difficult to change later.
4. Open **Firestore → Rules**, paste/deploy the repository's `firestore.rules`, and publish. Review/test these rules in the Emulator Suite before production.
5. In **Authentication → Users**, create the admin account `tamudating1@gmail.com` or sign up from the site with it. Verify the email. Admin rules require this exact verified email.
6. Configure the authorized domains for Authentication. Add the actual website host domain when known. The default Firebase auth domain is included.
7. On the signup page, create a test member using an email you control, verify the email from the inbox, then sign in.

## Current implemented pieces

- Firebase Auth email/password signup/login with email-verification requirement.
- Public profile data in `profiles/{uid}` and email in owner/admin-only `privateUsers/{uid}`.
- Manual Buy Goods payment record submission to Firestore, pending review; no STK Push or Daraja API.
- Admin payment list and approve/reject action for the verified admin email. Verify every transaction against the merchant statement before approval.
- Profile discovery is only intended for profiles explicitly approved by admin. Matching and chat remain future work.

## Important

This configuration does not host/deploy the website. Deploy the site with your chosen provider. For ES modules/CDN Firebase SDK imports, serve it over HTTPS or localhost (not by opening the HTML file directly). The payment Till is not configured in the website yet. Keep real payment submissions disabled until the Till is confirmed and the payment flow has been tested with Firebase rules.

When approving a transaction, the admin UI updates the payment status and the member's `messagingApproved` flag. The Firestore rules prevent members from changing approval flags. App testing is still needed before accepting real payments.
