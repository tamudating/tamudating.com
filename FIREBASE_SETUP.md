# Firebase setup (initial scaffold)

The repository is currently a static homepage prototype. These files prepare Firebase Hosting and Firestore rules; they do **not** connect the current page to Firebase yet.

## Before enabling Firebase

1. Create a Firebase project and register a web app.
2. Enable Firebase Authentication (email/password is a reasonable starting point) and require verified email addresses.
3. Create the Firestore database and deploy `firestore.rules` using the Firebase CLI.
4. Add Firebase's public web-app configuration to the eventual client app. Web config is not a service-account secret; never put service-account keys in the browser or repository.
5. Sign in as `tamudating1@gmail.com` and verify that this account's email is verified. The rules grant this account admin access; protect its mailbox and use multi-factor authentication where available.
6. Test all rules in the Firebase Emulator Suite before launch.

## Initial data model

- `profiles/{uid}`: browseable profile only. Do not put email, transaction details, identity documents, or exact address here.
- `privateUsers/{uid}`: account-private information, accessible only by the owner and admin.
- `payments/{paymentId}`: member-submitted M-Pesa transaction code and plan, initially `pending`; only the admin can change or delete a payment.
- `conversations/{conversationId}` and nested `messages/{messageId}`: rules require both participants' `messagingApproved` profile flag to be true.
- `reports/{reportId}` and `blocks/{blockId}`: safety reports and user blocks.

The admin must manually verify an M-Pesa transaction before changing its payment status and setting the member's `messagingApproved` flag. This project does not yet include a payment integration, approval UI, authentication UI, or profile/chat UI.

## Important limitations

- The rules enforce that only the designated verified email can administer Firestore records. Never use a client-side `isAdmin` field for authorization.
- The current `profiles` rule allows signed-in members to read profile documents, so only public profile fields belong there.
- Voice/video calls, push notifications, automated identity verification, and M-Pesa STK integration are not implemented.
- Review local legal, privacy, and payment requirements before accepting payments or collecting identity information.

## Deploy rules

Install the Firebase CLI, sign in with an authorized account, select your project, then run:

```sh
firebase use YOUR_FIREBASE_PROJECT_ID
firebase deploy --only firestore:rules
```

To deploy the static homepage after configuring Hosting:

```sh
firebase deploy --only hosting
```
