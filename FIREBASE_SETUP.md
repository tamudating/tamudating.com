# TamuDating manual payment setup (prototype)

TamuDating's current website is a front-end prototype. It does not initiate STK Push, connect to Daraja, submit transaction codes to Firestore, or accept/verify live payments.

## Intended manual Buy Goods flow

1. Admin adds the official business Till number to the public payment instructions after confirming it.
2. Member selects the plan: KSh 1,000 one-time introduction access or KSh 3,000/month VIP.
3. Member opens M-Pesa and chooses **Lipa na M-Pesa → Buy Goods and Services**, enters the official Till number and exact amount, and confirms payment in M-Pesa.
4. Member submits the M-Pesa transaction code in the signed-in app.
5. A trusted backend saves a pending payment record in Firestore. Do not store transaction codes in browser localStorage or trust a client-side approval flag.
6. Admin signs in using the verified Firebase account `tamudating1@gmail.com`, checks the payment against the actual M-Pesa merchant statement, then approves or rejects it.
7. Firestore rules/server logic grant messaging access only after approval for both conversation participants. A payment submission alone must never unlock messaging.

## Before taking real payments

- Configure Firebase Authentication and Firestore, then implement the transaction submission and admin-review flow securely.
- Keep payment documents private to the submitting member and authorized admin; avoid publishing transaction codes in profile documents.
- Validate plan and amount on trusted server logic, prevent duplicate transaction-code reuse, and retain an audit trail for decisions.
- Show clear support, refund, and payment terms. Never ask for a user's M-Pesa PIN or password.
- Confirm local business, privacy, tax, and consumer obligations before launch.

No Till number was supplied, so the interface currently shows a placeholder. This is a manual payment design only—no M-Pesa integration or live submission is active.
