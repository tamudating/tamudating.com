import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  writeBatch
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const ADMIN_EMAIL = 'tamudating1@gmail.com';
const PLAN_AMOUNTS = { intro: 1000, vip: 3000 };
const $ = (selector) => document.querySelector(selector);

function showMessage(form, message, isError = false) {
  let element = form.querySelector('[data-form-message]');
  if (!element) {
    element = document.createElement('p');
    element.dataset.formMessage = 'true';
    element.setAttribute('role', 'status');
    form.append(element);
  }
  element.textContent = message;
  element.classList.toggle('form-error', isError);
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function safeImageUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function setBusy(form, busy) {
  const button = form.querySelector('button[type="submit"]');
  if (button) button.disabled = busy;
}

async function handleSignup(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const age = Number(data.age);
  const photos = String(data.photos || '').split(',').map((url) => safeImageUrl(url.trim())).filter(Boolean);

  if (!Number.isInteger(age) || age < 18) {
    showMessage(form, 'You must be at least 18 years old to create an account.', true);
    return;
  }
  if (photos.length < 2) {
    showMessage(form, 'Please provide two valid photo links beginning with https://.', true);
    return;
  }
  if (String(data.password || '').length < 8) {
    showMessage(form, 'Use a password with at least 8 characters.', true);
    return;
  }

  setBusy(form, true);
  try {
    const credential = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
    const user = credential.user;
    const batch = writeBatch(db);
    batch.set(doc(db, 'profiles', user.uid), {
      displayName: String(data.fullName).trim(),
      age,
      location: String(data.location).trim(),
      seeking: data.seeking,
      bio: String(data.bio).trim(),
      hobbies: String(data.hobbies).trim(),
      loveLanguage: String(data.loveLanguage).trim(),
      relationshipGoal: String(data.goals).trim(),
      photoUrls: photos,
      createdAt: serverTimestamp()
    });
    batch.set(doc(db, 'privateUsers', user.uid), {
      email: user.email,
      createdAt: serverTimestamp()
    });
    await batch.commit();
    await sendEmailVerification(user);
    await signOut(auth);
    showMessage(form, 'Account created. Check your email and verify it, then sign in. Your profile will need admin approval before discovery.');
    form.reset();
  } catch (error) {
    showMessage(form, error.message || 'Could not create your account. Please try again.', true);
  } finally {
    setBusy(form, false);
  }
}

async function handleLogin(form) {
  const data = new FormData(form);
  const email = String(data.get('email') || '').trim();
  const password = String(data.get('password') || '');
  setBusy(form, true);
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (!credential.user.emailVerified) {
      await sendEmailVerification(credential.user);
      await signOut(auth);
      showMessage(form, 'Please verify your email first. We sent a verification link; check your inbox and spam folder.', true);
      return;
    }
    window.location.href = credential.user.email?.toLowerCase() === ADMIN_EMAIL ? 'admin.html' : 'dashboard.html';
  } catch (error) {
    showMessage(form, error.message || 'Could not sign in. Check your details and try again.', true);
  } finally {
    setBusy(form, false);
  }
}

function renderProfileCard(profile) {
  const image = safeImageUrl(profile.photoUrls?.[0] || '');
  const photo = image ? `<img src="${escapeHtml(image)}" alt="Profile of ${escapeHtml(profile.displayName || 'member')}" loading="lazy">` : '';
  return `<article class="profile-card">${photo}<div class="profile-body">
    <div class="profile-header"><h3>${escapeHtml(profile.displayName || 'Member')}, ${Number(profile.age) || ''}</h3></div>
    <p class="meta">${escapeHtml(profile.location || '')}</p><p>${escapeHtml(profile.bio || '')}</p>
    <div class="chips"><span>${escapeHtml(profile.loveLanguage || '')}</span><span>${escapeHtml(profile.relationshipGoal || '')}</span></div>
    <p>Profile approved. Matching and live chat are not enabled yet.</p>
  </div></article>`;
}

async function loadDashboard(user) {
  const title = $('#dashboard-title');
  if (title) title.textContent = `Welcome, ${user.displayName || user.email || 'member'}`;
  const status = $('#member-status');
  try {
    const [profileSnap, allProfiles] = await Promise.all([
      getDoc(doc(db, 'profiles', user.uid)),
      getDocs(collection(db, 'profiles'))
    ]);
    const profile = profileSnap.data() || {};
    const profileApproved = profile.profileApproved === true;
    const paymentApproved = profile.messagingApproved === true;
    if (status) {
      status.textContent = !profileApproved ? 'Profile approval pending' : paymentApproved ? 'Profile and payment approved' : 'Payment approval pending';
    }
    const summary = $('#profile-summary');
    if (summary) {
      const image = safeImageUrl(profile.photoUrls?.[0] || '');
      summary.innerHTML = `<div class="profile-summary-card">${image ? `<div class="profile-summary-image"><img src="${escapeHtml(image)}" alt="Your profile photo"></div>` : ''}<div><h3>${escapeHtml(profile.displayName || user.email)}</h3><p><strong>Age:</strong> ${Number(profile.age) || ''}</p><p><strong>Location:</strong> ${escapeHtml(profile.location || '')}</p><p><strong>Hobbies:</strong> ${escapeHtml(profile.hobbies || '')}</p><p><strong>Love language:</strong> ${escapeHtml(profile.loveLanguage || '')}</p><p><strong>Relationship goals:</strong> ${escapeHtml(profile.relationshipGoal || '')}</p><p>${escapeHtml(profile.bio || '')}</p></div></div>`;
    }
    const grid = $('#discover-grid');
    if (grid) {
      const profiles = allProfiles.docs
        .filter((item) => item.id !== user.uid && item.data().profileApproved === true)
        .map((item) => item.data());
      grid.innerHTML = profiles.length ? profiles.map(renderProfileCard).join('') : '<p>No other approved profiles are available yet.</p>';
    }
  } catch (error) {
    if (status) status.textContent = 'Could not load account data';
    console.error('Dashboard load failed:', error);
  }
}

async function submitManualPayment(form, user) {
  const formData = new FormData(form);
  const plan = formData.get('plan');
  const transactionCode = String(formData.get('transactionCode') || '').trim().toUpperCase();
  if (!PLAN_AMOUNTS[plan] || !/^[A-Z0-9]{6,20}$/.test(transactionCode)) {
    showMessage(form, 'Choose a plan and enter a valid M-Pesa transaction code (6–20 letters or numbers).', true);
    return;
  }
  setBusy(form, true);
  try {
    await addDoc(collection(db, 'payments'), {
      uid: user.uid,
      transactionCode,
      plan,
      amountKsh: PLAN_AMOUNTS[plan],
      status: 'pending',
      createdAt: serverTimestamp()
    });
    showMessage(form, 'Transaction code submitted for manual review. Messaging stays locked until the admin verifies your payment.');
    form.reset();
  } catch (error) {
    showMessage(form, error.message || 'Could not submit payment details. Please try again.', true);
  } finally {
    setBusy(form, false);
  }
}

async function loadAdmin(user) {
  const target = $('#admin-payments');
  if (!target) return;
  if (user.email?.toLowerCase() !== ADMIN_EMAIL || !user.emailVerified) {
    target.textContent = 'Access denied. Sign in with the verified administrator account.';
    return;
  }
  target.textContent = 'Loading profile and payment review…';
  try {
    const [profileSnap, paymentSnap] = await Promise.all([
      getDocs(collection(db, 'profiles')),
      getDocs(collection(db, 'payments'))
    ]);
    const profiles = profileSnap.docs.map((item) => ({ id: item.id, ...item.data() }));
    const payments = paymentSnap.docs.map((item) => ({ id: item.id, ...item.data() }));
    const pendingProfiles = profiles.filter((profile) => profile.profileApproved !== true);
    const pendingPayments = payments.filter((payment) => payment.status === 'pending');

    target.innerHTML = `
      <section class="admin-section-block"><h3>Profiles awaiting approval</h3>
        ${pendingProfiles.length ? `<table class="admin-table-inner"><thead><tr><th>Name</th><th>Age</th><th>Town</th><th>Action</th></tr></thead><tbody>${pendingProfiles.map((profile) => `<tr><td>${escapeHtml(profile.displayName || 'Member')}</td><td>${Number(profile.age) || '-'}</td><td>${escapeHtml(profile.location || '')}</td><td><button type="button" class="primary-btn small" data-profile-approve="${escapeHtml(profile.id)}">Approve profile</button></td></tr>`).join('')}</tbody></table>` : '<p>No profiles awaiting approval.</p>'}
      </section>
      <section class="admin-section-block"><h3>Payments awaiting manual verification</h3>
        <p>Compare every transaction code and amount with your official M-Pesa Buy Goods statement before approving.</p>
        ${pendingPayments.length ? `<table class="admin-table-inner"><thead><tr><th>Member UID</th><th>Plan</th><th>Amount</th><th>Transaction code</th><th>Action</th></tr></thead><tbody>${pendingPayments.map((payment) => `<tr><td>${escapeHtml(payment.uid || '')}</td><td>${escapeHtml(payment.plan || '')}</td><td>KSh ${Number(payment.amountKsh) || 0}</td><td>${escapeHtml(payment.transactionCode || '')}</td><td><button type="button" class="primary-btn small" data-payment-decision="approved" data-payment-id="${escapeHtml(payment.id)}" data-uid="${escapeHtml(payment.uid || '')}">Approve payment</button> <button type="button" class="secondary-btn small" data-payment-decision="rejected" data-payment-id="${escapeHtml(payment.id)}">Reject</button></td></tr>`).join('')}</tbody></table>` : '<p>No payments awaiting review.</p>'}
      </section>`;

    target.querySelectorAll('[data-profile-approve]').forEach((button) => {
      button.addEventListener('click', async () => {
        button.disabled = true;
        try {
          const batch = writeBatch(db);
          batch.update(doc(db, 'profiles', button.dataset.profileApprove), {
            profileApproved: true,
            approvedAt: serverTimestamp()
          });
          await batch.commit();
          await loadAdmin(user);
        } catch (error) {
          button.disabled = false;
          alert(error.message || 'Could not approve this profile.');
        }
      });
    });

    target.querySelectorAll('[data-payment-decision]').forEach((button) => {
      button.addEventListener('click', async () => {
        const paymentId = button.dataset.paymentId;
        const uid = button.dataset.uid;
        const decision = button.dataset.paymentDecision;
        if (!paymentId) return;
        button.disabled = true;
        try {
          const batch = writeBatch(db);
          batch.update(doc(db, 'payments', paymentId), {
            status: decision,
            reviewedAt: serverTimestamp()
          });
          if (decision === 'approved' && uid) {
            batch.update(doc(db, 'profiles', uid), { messagingApproved: true });
          }
          await batch.commit();
          await loadAdmin(user);
        } catch (error) {
          button.disabled = false;
          alert(error.message || 'Could not update this payment.');
        }
      });
    });
  } catch (error) {
    target.textContent = `Could not load approvals: ${error.message}`;
  }
}

function init() {
  const signupForm = $('#signup-form');
  if (signupForm) signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSignup(signupForm);
  });
  const loginForm = $('#login-form');
  if (loginForm) loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleLogin(loginForm);
  });

  onAuthStateChanged(auth, async (user) => {
    if ($('#dashboard-title')) {
      if (!user || !user.emailVerified) {
        window.location.href = 'login.html';
        return;
      }
      await loadDashboard(user);
      const paymentForm = $('#payment-form');
      if (paymentForm) paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        submitManualPayment(paymentForm, user);
      });
      const logout = $('.logout-btn');
      if (logout) logout.addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = 'login.html';
      });
    }
    if ($('#admin-payments')) {
      if (!user) {
        window.location.href = 'login.html';
        return;
      }
      await loadAdmin(user);
      const logout = $('.admin-logout');
      if (logout) logout.addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = 'login.html';
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
