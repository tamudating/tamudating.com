const demoProfiles = [
  {
    id: 'p1',
    name: 'Jasmine',
    age: 38,
    location: 'Nairobi',
    loveLanguage: 'Words of affirmation',
    hobbies: 'Travel, wine nights, fine dining',
    bio: 'Warm, confident, and adventurous. Looking for a younger man who is mature, respectful, and fun to be around.',
    seeking: 'younger-men',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    verified: true,
    approved: true,
    relationshipGoal: 'Long-term connection'
  },
  {
    id: 'p2',
    name: 'Naomi',
    age: 41,
    location: 'Mombasa',
    loveLanguage: 'Quality time',
    hobbies: 'Beach drives, music, good food',
    bio: 'I like easy conversations, good laughs, and real chemistry. Looking for a younger man with ambition and charm.',
    seeking: 'younger-men',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    verified: true,
    approved: true,
    relationshipGoal: 'Serious relationship'
  },
  {
    id: 'p3',
    name: 'Kevin',
    age: 26,
    location: 'Kiambu',
    loveLanguage: 'Quality time',
    hobbies: 'Gym, road trips, music',
    bio: 'Confident, ambitious, and looking for a mature woman who knows what she wants and enjoys a good connection.',
    seeking: 'older-women',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    verified: false,
    approved: true,
    relationshipGoal: 'Mutually fulfilling connection'
  },
  {
    id: 'p4',
    name: 'Brian',
    age: 29,
    location: 'Kisumu',
    loveLanguage: 'Acts of service',
    hobbies: 'Cooking, fitness, travel',
    bio: 'Looking for a classy, mature woman who enjoys confidence, good energy, and a deep connection.',
    seeking: 'older-women',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    verified: false,
    approved: true,
    relationshipGoal: 'Open to dating and more'
  }
];

const demoMatches = [
  { id: 'm1', name: 'Jasmine', lastMessage: 'Would love to meet for dinner this weekend.', time: '2m ago' },
  { id: 'm2', name: 'Naomi', lastMessage: 'I love your profile energy.', time: '21m ago' }
];

const demoMessages = {
  m1: [
    { sender: 'them', text: 'You seem really easy to talk to.' },
    { sender: 'me', text: 'That means a lot. Want to grab coffee?' }
  ],
  m2: [
    { sender: 'them', text: 'I like your vibe. We should connect.' },
    { sender: 'me', text: 'I agree. Would love to hear more.' }
  ]
};

const ADMIN_EMAIL = 'tamudating1@gmail.com';

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('tamuCurrentUser') || 'null');
}

function saveCurrentUser(user) {
  localStorage.setItem('tamuCurrentUser', JSON.stringify(user));
}

function ensureSeedData() {
  if (!localStorage.getItem('tamuProfiles')) {
    localStorage.setItem('tamuProfiles', JSON.stringify(demoProfiles));
  }

  if (!localStorage.getItem('tamuPayments')) {
    localStorage.setItem('tamuPayments', JSON.stringify([
      { id: 'pay_1', user: 'demo@user.com', amount: 1000, plan: 'intro', transactionCode: 'QJ4K7Q7G9P', status: 'pending', createdAt: Date.now() }
    ]));
  }
}

function getProfiles() {
  return JSON.parse(localStorage.getItem('tamuProfiles') || '[]');
}

function setProfiles(list) {
  localStorage.setItem('tamuProfiles', JSON.stringify(list));
}

function getPayments() {
  return JSON.parse(localStorage.getItem('tamuPayments') || '[]');
}

function setPayments(list) {
  localStorage.setItem('tamuPayments', JSON.stringify(list));
}

function isAdminView() {
  return window.location.pathname.includes('admin.html');
}

function renderDiscover() {
  const grid = document.getElementById('discover-grid');
  if (!grid) return;

  const profiles = getProfiles().filter((profile) => profile.approved);
  grid.innerHTML = profiles.map((profile) => `
    <article class="profile-card">
      <img src="${profile.photo}" alt="${profile.name}" />
      <div class="profile-body">
        <div class="profile-header">
          <h3>${profile.name}, ${profile.age}</h3>
          ${profile.verified ? '<span class="verified-pill">Verified</span>' : ''}
        </div>
        <p class="meta">${profile.location}</p>
        <p>${profile.bio}</p>
        <div class="chips">
          <span>${profile.loveLanguage}</span>
          <span>${profile.relationshipGoal}</span>
        </div>
        <button class="primary-btn small" data-profile-id="${profile.id}">View profile</button>
      </div>
    </article>
  `).join('');
}

function renderProfileSummary() {
  const target = document.getElementById('profile-summary');
  if (!target) return;

  const user = getCurrentUser();
  if (!user) return;

  const profile = getProfiles().find((item) => item.id === user.profileId) || user;
  target.innerHTML = `
    <div class="profile-summary-card">
      <div class="profile-summary-image">
        <img src="${profile.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'}" alt="${profile.name}" />
      </div>
      <div>
        <h3>${profile.name}, ${profile.age}</h3>
        <p><strong>Location:</strong> ${profile.location}</p>
        <p><strong>Hobbies:</strong> ${profile.hobbies}</p>
        <p><strong>Love language:</strong> ${profile.loveLanguage}</p>
        <p><strong>Relationship goals:</strong> ${profile.relationshipGoal}</p>
        <p><strong>Bio:</strong> ${profile.bio}</p>
      </div>
    </div>
  `;
}

function renderMatches() {
  const list = document.getElementById('matches-list');
  if (!list) return;

  list.innerHTML = demoMatches.map((match) => `
    <div class="match-item">
      <div class="match-avatar"></div>
      <div class="match-copy">
        <strong>${match.name}</strong>
        <small>${match.lastMessage}</small>
      </div>
      <span>${match.time}</span>
    </div>
  `).join('');
}

function renderChatList() {
  const list = document.getElementById('chat-list');
  if (!list) return;

  list.innerHTML = demoMatches.map((match) => `
    <button class="chat-item" data-match-id="${match.id}">
      <div class="match-avatar small"></div>
      <div>
        <strong>${match.name}</strong>
        <small>${match.lastMessage}</small>
      </div>
    </button>
  `).join('');

  document.querySelectorAll('.chat-item').forEach((button) => {
    button.addEventListener('click', () => {
      const matchId = button.dataset.matchId;
      const chatBox = document.getElementById('chat-box');
      const messages = demoMessages[matchId] || [];
      chatBox.innerHTML = messages.map((msg) => `
        <div class="message ${msg.sender === 'me' ? 'mine' : 'theirs'}">
          ${msg.text}
        </div>
      `).join('');
    });
  });
}

function renderAdminPayments() {
  const target = document.getElementById('admin-payments');
  if (!target) return;

  const payments = getPayments();
  target.innerHTML = `
    <table class="admin-table-inner">
      <thead>
        <tr>
          <th>User</th>
          <th>Plan</th>
          <th>Amount</th>
          <th>Transaction</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${payments.map((payment) => `
          <tr>
            <td>${payment.user}</td>
            <td>${payment.plan}</td>
            <td>KSh ${payment.amount}</td>
            <td>${payment.transactionCode}</td>
            <td><span class="status-badge ${payment.status}">${payment.status}</span></td>
            <td>
              <button class="primary-btn small" data-payment-id="${payment.id}">${payment.status === 'pending' ? 'Approve' : 'Approved'}</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  document.querySelectorAll('[data-payment-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const paymentId = button.dataset.paymentId;
      const payments = getPayments();
      const updated = payments.map((payment) => payment.id === paymentId ? { ...payment, status: 'approved' } : payment);
      setPayments(updated);
      renderAdminPayments();
      updateStatusText();
    });
  });
}

function updateStatusText() {
  const memberStatus = document.getElementById('member-status');
  if (!memberStatus) return;

  const user = getCurrentUser();
  const payments = getPayments();
  const hasApproved = payments.some((payment) => payment.user === user?.email && payment.status === 'approved');

  memberStatus.textContent = hasApproved ? 'Approved to chat' : 'Approval pending';
}

function bindDashboardPage() {
  const paymentForm = document.getElementById('payment-form');
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  if (signatureForms()) {
    // no-op placeholder when a page is not using the form
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const email = formData.get('email');
      const password = formData.get('password');

      if (!email || !password) return;

      const user = {
        email,
        profileId: 'p3',
        name: 'Kevin',
        approved: false,
        profileComplete: true,
        role: 'member'
      };

      saveCurrentUser(user);
      window.location.href = 'dashboard.html';
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(signupForm).entries());
      const photoLinks = data.photos.split(',').map((item) => item.trim()).filter(Boolean);
      const profile = {
        id: 'profile_' + Date.now(),
        name: data.fullName,
        age: Number(data.age),
        location: data.location,
        email: data.email,
        bio: data.bio,
        hobbies: data.hobbies,
        loveLanguage: data.loveLanguage,
        relationshipGoal: data.goals,
        seeking: data.seeking,
        photo: photoLinks[0] || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
        verified: false,
        approved: false,
        role: 'member'
      };

      const profiles = getProfiles();
      profiles.unshift(profile);
      setProfiles(profiles);

      saveCurrentUser({
        email: data.email,
        name: data.fullName,
        profileId: profile.id,
        approved: false,
        role: 'member'
      });

      window.location.href = 'dashboard.html';
    });
  }

  if (paymentForm) {
    paymentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(paymentForm);
      const user = getCurrentUser();
      const currentPayments = getPayments();
      currentPayments.unshift({
        id: 'pay_' + Date.now(),
        user: user?.email || 'member@demo.com',
        amount: 1000,
        plan: formData.get('plan'),
        transactionCode: formData.get('transactionCode'),
        status: 'pending',
        createdAt: Date.now()
      });
      setPayments(currentPayments);

      alert('Payment submitted. Please wait for admin approval before your chat unlocks.');
      paymentForm.reset();
    });
  }

  const logoutButton = document.querySelector('.logout-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('tamuCurrentUser');
      window.location.href = 'login.html';
    });
  }

  const dashboardTitle = document.getElementById('dashboard-title');
  const user = getCurrentUser();
  if (dashboardTitle && user) {
    dashboardTitle.textContent = `${user.name || 'Member'} dashboard`;
  }

  renderDiscover();
  renderMatches();
  renderChatList();
  renderProfileSummary();
  updateStatusText();
}

function signatureForms() {
  return !window.location.pathname.includes('dashboard.html') && !window.location.pathname.includes('admin.html');
}

function init() {
  ensureSeedData();

  if (window.location.pathname.includes('dashboard.html')) {
    bindDashboardPage();
    return;
  }

  if (window.location.pathname.includes('admin.html')) {
    renderAdminPayments();
    return;
  }

  if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
    // auth page behavior handled by form submissions above through bindDashboardPage only if dashboard; no-op for auth pages
    return;
  }

  const heroButtons = document.querySelectorAll('.primary-btn, .secondary-btn');
  heroButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.textContent.includes('Create your free profile') || button.textContent.includes('Join now') || button.textContent.includes('Join VIP')) {
        window.location.href = 'signup.html';
      }
      if (button.textContent.includes('Login') || button.textContent.includes('View membership') || button.textContent.includes('Pay with M-Pesa')) {
        window.location.href = 'login.html';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
