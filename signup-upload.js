import { auth, db, firebaseApp } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
  doc,
  serverTimestamp,
  writeBatch
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

const storage = getStorage(firebaseApp);
const form = document.querySelector('#signup-form');

function showUploadMessage(message, isError = false) {
  let element = form.querySelector('[data-form-message]');
  if (!element) {
    element = document.createElement('p');
    element.dataset.formMessage = 'true';
    element.setAttribute('role', 'status');
    element.className = 'full-width';
    form.append(element);
  }
  element.textContent = message;
  element.classList.toggle('form-error', isError);
}

if (form) {
  // Run in capture phase so this upload-aware handler replaces the legacy URL-based signup handler.
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const data = new FormData(form);
    const photo = data.get('profilePhoto');
    const age = Number(data.get('age'));
    if (!photo || !(photo instanceof File) || photo.size === 0) {
      showUploadMessage('Choose a profile picture to continue.', true);
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(photo.type) || photo.size > 5 * 1024 * 1024) {
      showUploadMessage('Choose a JPG, PNG, or WebP image no larger than 5 MB.', true);
      return;
    }
    if (!Number.isInteger(age) || age < 18) {
      showUploadMessage('You must be at least 18 years old to create an account.', true);
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    try {
      const credential = await createUserWithEmailAndPassword(auth, String(data.get('email')).trim(), String(data.get('password')));
      const user = credential.user;
      const extension = photo.type === 'image/png' ? 'png' : photo.type === 'image/webp' ? 'webp' : 'jpg';
      const imageRef = ref(storage, `profiles/${user.uid}/profile-picture.${extension}`);
      await uploadBytes(imageRef, photo, { contentType: photo.type });
      const photoUrl = await getDownloadURL(imageRef);
      const batch = writeBatch(db);
      batch.set(doc(db, 'profiles', user.uid), {
        displayName: String(data.get('fullName') || '').trim(),
        age,
        location: String(data.get('location') || '').trim(),
        seeking: String(data.get('seeking') || ''),
        bio: String(data.get('bio') || '').trim(),
        hobbies: String(data.get('hobbies') || '').trim(),
        loveLanguage: String(data.get('loveLanguage') || '').trim(),
        relationshipGoal: String(data.get('goals') || '').trim(),
        photoUrls: [photoUrl],
        createdAt: serverTimestamp()
      });
      batch.set(doc(db, 'privateUsers', user.uid), {
        email: user.email,
        createdAt: serverTimestamp()
      });
      await batch.commit();
      await sendEmailVerification(user);
      await signOut(auth);
      showUploadMessage('Account created. Check your email and verify it, then sign in. Your profile will need admin approval before discovery.');
      form.reset();
    } catch (error) {
      showUploadMessage(error.message || 'Could not create your account. Please try again.', true);
    } finally {
      if (button) button.disabled = false;
    }
  }, true);
}
