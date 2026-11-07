// This front-end prototype does not connect to Firebase. Do not enter real payment
// transaction codes until a secure Firestore submission flow is implemented.
const demoProfiles = [
  { id: 'p1', name: 'Jasmine', age: 38, location: 'Nairobi', loveLanguage: 'Words of affirmation', hobbies: 'Travel, fine dining', bio: 'Warm, confident, and adventurous. Looking for a respectful younger man and genuine chemistry.', verified: true, approved: true, relationshipGoal: 'Long-term connection', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80' },
  { id: 'p2', name: 'Naomi', age: 41, location: 'Mombasa', loveLanguage: 'Quality time', hobbies: 'Beach drives, music', bio: 'I enjoy easy conversations, good laughs, and real chemistry.', verified: true, approved: true, relationshipGoal: 'Serious relationship', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80' },
  { id: 'p3', name: 'Kevin', age: 26, location: 'Kiambu', loveLanguage: 'Quality time', hobbies: 'Gym, road trips', bio: 'Confident and ambitious, looking to meet a mature woman who enjoys good energy.', verified: false, approved: true, relationshipGoal: 'Meaningful connection', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80' }
];
const demoMatches = [
  { id: 'm1', name: 'Jasmine', lastMessage: 'Would love to meet for dinner this weekend.', time: '2m ago' },
  { id: 'm2', name: 'Naomi', lastMessage: 'I love your profile energy.', time: '21m ago' }
];
const demoMessages = {
  m1: [{ sender: 'them', text: 'You seem really easy to talk to.' }, { sender: 'me', text: 'That means a lot. Want to grab coffee?' }],
  m2: [{ sender: 'them', text: 'I like your vibe. We should connect.' }, { sender: 'me', text: 'I agree. Would love to hear more.' }]
};

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('tamuCurrentUser') || 'null'); }
  catch { return null; }
}
function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function renderDiscover() {
  const grid = document.getElementById('discover-grid');
  if (!grid) return;
  grid.innerHTML = demoProfiles.map((profile) => `
    <article class="profile-card"><img src="${profile.photo}" alt="Profile of ${escapeHtml(profile.name)}" />
      <div class="profile-body"><div class="profile-header"><h3>${escapeHtml(profile.name)}, ${profile.age}</h3>${profile.verified ? '<span class="verified-pill">Verified</span>' : ''}</div>
      <p class="meta">${escapeHtml(profile.location)}</p><p>${escapeHtml(profile.bio)}</p>
      <div class="chips"><span>${escapeHtml(profile.loveLanguage)}</span><span>${escapeHtml(profile.relationshipGoal)}</span></div>
      <button class="primary-btn small" type="button">View profile</button></div></article>`).join('');
}
function renderMatches() {
  const list = document.getElementById('matches-list');
  if (list) list.innerHTML = demoMatches.map((match) => `<div class="match-item"><div class="match-avatar"></div><div class="match-copy"><strong>${escapeHtml(match.name)}</strong><small>${escapeHtml(match.lastMessage)}</small></div><span>${escapeHtml(match.time)}</span></div>`).join('');
}
function renderChatList() {
  const list = document.getElementById('chat-list');
  if (!list) return;
  list.innerHTML = demoMatches.map((match) => `<button class="chat-item" type="button" data-match-id="${match.id}"><div class="match-avatar small"></div><div><strong>${escapeHtml(match.name)}</strong><small>${escapeHtml(match.lastMessage)}</small></div></button>`).join('');
  list.querySelectorAll('.chat-item').forEach((button) => button.addEventListener('click', () => {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = (demoMessages[button.dataset.matchId] || []).map((msg) => `<div class="message ${msg.sender === 'me' ? 'mine' : 'theirs'}">${escapeHtml(msg.text)}</div>`).join('');
  }));
}
function renderProfileSummary() {
  const target = document.getElementById('profile-summary');
  if (!target) return;
  const user = getCurrentUser();
  target.innerHTML = user ? `<p>Signed in as ${escapeHtml(user.email || 'demo member')}.</p><p>Profile editing and secure profile storage will be connected with Firebase in a later step.</p>` : '<p>Demo profile preview. Sign-in is not connected yet.</p>';
}
function updateAmount() {
  const select = document.getElementById('payment-plan');
  const amount = document.getElementById('payment-amount');
  if (!select || !amount) return;
  const option = select.options[select.selectedIndex];
  amount.textContent = `Amount to pay: KSh ${Number(option.dataset.amount).toLocaleString('en-KE')}${select.value === 'vip' ? ' per month' : ' one-time'}`;
}
function init() {
  renderDiscover();
  renderMatches();
  renderChatList();
  renderProfileSummary();
  const plan = document.getElementById('payment-plan');
  if (plan) { plan.addEventListener('change', updateAmount); updateAmount(); }
  const form = document.getElementById('payment-form');
  if (form) form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Manual payment instructions are a preview only. Firebase is not connected, so your transaction code has not been submitted or saved. Please do not enter a real payment code yet.');
  });
  const logout = document.querySelector('.logout-btn');
  if (logout) logout.addEventListener('click', () => { localStorage.removeItem('tamuCurrentUser'); window.location.href = 'login.html'; });
  const title = document.getElementById('dashboard-title');
  const user = getCurrentUser();
  if (title && user) title.textContent = `${escapeHtml(user.name || 'Member')} dashboard`;
  document.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
    if (button.textContent.trim() === 'Join now' || button.textContent.includes('Create your free profile')) window.location.href = 'signup.html';
    if (button.textContent.trim() === 'Sign in') window.location.href = 'login.html';
  }));
}
document.addEventListener('DOMContentLoaded', init);
