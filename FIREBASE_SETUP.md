# TamuDating Firebase setup

The website is hosted separately; Firebase is used for Authentication and Cloud Firestore only. Do not configure Firebase Hosting unless you choose it later.

## Security update and required deployment steps

The updated `firestore.rules` requires a verified Firebase Authentication email for profile and payment access. Members can read their own profile and approved profiles; the verified admin can review all profiles and payments. Member edits are limited to unapproved profiles; profile content becomes locked after admin approval so profile edits cannot silently bypass review. To change an approved profile, the admin must edit or remove approval first.

After pulling the latest repository version, publish the full `firestore.rules` file in Firebase Console under **Firestore Database → Rules**. Rules in GitHub do not automatically update Firebase. Test signup, profile approval, discovery, payment submission, and admin review with separate test accounts before launch.

## Admin approval workflow

1. A member signs up; a profile document is created without approval flags. Members cannot set or edit `profileApproved` or `messagingApproved`.
2. The member verifies their email. The verified admin `tamudating1@gmail.com` reviews profiles on `admin.html` and approves suitable profiles.
3. Approved profiles appear in discovery.
4. Member pays manually by Lipa na M-Pesa Buy Goods and Services, Till `1875493`, and submits the transaction code.
5. Admin compares the code and amount with the official merchant statement, then approves or rejects the payment on the admin page.
6. Matching and live chat are not implemented. Approval flags do not provide actual messaging functionality.

## Current limitations and launch checklist

- This app is a prototype. Do not accept real payments or sensitive member data until you have tested and reviewed the full workflow and prepared privacy, safety, and refund policies.
- Payment codes are stored in Firestore for private access by the member/admin. Verify them manually; never ask for a user's M-Pesa PIN or password.
- No STK Push or Daraja API is used. Site hosting remains with your chosen provider.
- Configure Firebase Authentication Email/Password and authorized domains; create and verify `tamudating1@gmail.com`.
- The Firebase browser config is public client configuration, not a secret. Never commit passwords, service-account private keys, payment API secrets, or access tokens.
