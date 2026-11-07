# TamuDating Firebase setup

The website is hosted separately; Firebase is used for Authentication and Cloud Firestore only. Do not configure Firebase Hosting unless you choose it later.

## Admin approval workflow

1. A member signs up; a profile document is created without approval flags. Members cannot set or edit `profileApproved` or `messagingApproved`.
2. The member verifies their email. The verified admin `tamudating1@gmail.com` reviews profiles on `admin.html` and approves suitable profiles.
3. Approved profiles appear in discovery.
4. Member pays manually by Lipa na M-Pesa Buy Goods and Services, Till `1875493`, and submits the transaction code.
5. Admin compares the code and amount with the official merchant statement, then approves or rejects the payment on the admin page.
6. Messaging remains unavailable until both people have `profileApproved` and `messagingApproved` set by the admin.

## Current limitations and launch checklist

- This app is still a prototype. Matching and live chat are not implemented. The approval flags are groundwork for those features, not proof that chat is functional.
- Admin approval actions require the latest `firestore.rules` from this repository to be published in Firebase Console. The rule `canMessage` checks both approval flags.
- Payment codes are stored in Firestore for private access by the member/admin. Verify them manually; never ask for a user's M-Pesa PIN or password.
- No STK Push or Daraja API is used. Site hosting remains with your chosen provider.
- Configure Firebase Authentication Email/Password and authorized domains; create and verify `tamudating1@gmail.com`.
- Test using separate member and admin accounts before accepting real payments. Review legal, privacy, refund, and payment requirements before launch.
