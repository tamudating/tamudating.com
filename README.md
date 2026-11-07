# TamuDating

A pink-and-white dating platform concept for adult younger men and mature women seeking respectful, mutually matching connections.

## Current status

The repository contains a responsive static homepage prototype and an initial Firebase/Firestore configuration scaffold. It is not yet a complete or live dating application: sign-in, profile editing, payments, admin approval UI, matching, and chat still need implementation and Firebase project configuration.

## Included

- `index.html` – homepage structure and content
- `styles.css` – responsive styling
- `app.js` – small UI interaction behavior
- `firebase.json` – Firebase Hosting and Firestore CLI configuration
- `firestore.rules` – initial access-control rules
- `FIREBASE_SETUP.md` – setup, data model, and deployment notes

## Product outline

- Adults only; mature women and younger men
- Profile discovery with two photos, bio, hobbies, love language, relationship goals, and approximate town/location
- KSh 1,000 one-time payment submitted with an M-Pesa transaction code and reviewed by the admin
- Messaging only when both participants have admin-approved access
- Optional KSh 3,000/month VIP membership, with clearly described benefits
- Mutual consent before sharing WhatsApp/social details
- Reporting, blocking, and approximate location rather than exact/live location

## Admin account

The initial Firestore rules recognize the verified Firebase Authentication account `tamudating1@gmail.com` as the administrator. This is not a Firebase project or account credential. Protect the account and do not add service-account keys to client code.

## Setup

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md). Firebase configuration and project credentials have not been supplied, and Firebase is not connected to the page yet.
