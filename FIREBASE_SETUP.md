# TamuDating Firebase setup

The website is hosted separately; Firebase is used for Authentication and Cloud Firestore only. Do not configure Firebase Hosting unless you choose it later.

## Security update and required deployment steps

The current rules now allow a new member to create a profile before email verification, which avoids the signup conflict. Once the member verifies their email, Firebase denies access to unapproved or other users' profile data unless they are the owner or the admin. This keeps discovery limited to approved profiles. The admin account remains `tamudating1@gmail.com` and must be verified in Firebase.

After pulling the latest repository version, publish the full `firestore.rules` file in Firebase Console under **Firestore Database → Rules**. Rules in GitHub do not automatically update Firebase. Test signup, profile approval, discovery, payment submission, and admin review with separate member/admin accounts before launch.

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
