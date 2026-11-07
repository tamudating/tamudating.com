# TamuDating

Dating site for adults: younger men and mature women seeking respectful, consensual connections.

## Current state

The repository is connected in code to the Firebase project `tamu-dating-3a497` for Firebase Authentication and Cloud Firestore. It is not configured for Firebase Hosting; deploy the static site through the hosting provider you choose.

Implemented in this step: email/password signup and login, email verification, profile creation, manual payment-code submission, and a verified-email admin payment review interface. Matching and live chat are explicitly not active yet. The public Till number remains unconfigured, so do not accept real payments yet.

## Setup

Follow `FIREBASE_SETUP.md`: enable Email/Password Authentication, create Firestore, publish `firestore.rules`, create/verify the admin account, and add your production domain under Authentication authorized domains. Run the website on localhost or HTTPS because Firebase modules use browser ES modules.

The Firebase web config is in `firebase-config.js`. This config is intended to be public in browser apps; restrict the API key to the actual website domain and relevant APIs in Google Cloud. Never add Firebase service-account credentials to this repository.
