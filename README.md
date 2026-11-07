# TamuDating

A pink-and-white dating platform prototype for adult younger men and mature women seeking respectful, mutually chosen connections.

## Current status

The repository contains static homepage/dashboard concepts and an initial Firestore rules scaffold. The site does not yet provide real Firebase sign-in, persistent profiles, secure payment submission, real admin approval, matching, or live chat. Do not accept real payments through this prototype.

## Manual payment plan

- KSh 1,000 one-time introduction access
- KSh 3,000/month VIP
- Intended payment method: manual Lipa na M-Pesa → Buy Goods and Services, using the official Till number (not yet provided)
- Member submits the transaction code for admin verification
- Messaging should unlock only when both users' payments are approved

There is no STK Push or Daraja API integration. See `FIREBASE_SETUP.md` for the intended manual workflow and security requirements.

## Admin account

The intended admin identity is the verified Firebase Authentication account `tamudating1@gmail.com`. Firebase is not connected yet. Never store service-account credentials or use client-side admin checks as security.

## Safety and privacy

The product is adults-only. Use approximate location rather than exact/live location, require consent before sharing social contact details, and provide blocking/reporting and account deletion before launch.
