function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

async function loadRss() {
  const list = document.getElementById('rss-list');
  if (!list) return;
  list.innerHTML = '<li>Loading latest PUBG news feed...</li>';

  const targetFeed = encodeURIComponent('https://www.pubg.com/en/feed/');
  const url = `https://api.allorigins.win/raw?url=${targetFeed}`;

  try {
    const xmlText = await fetch(url).then((res) => res.text());
    const xml = new DOMParser().parseFromString(xmlText, 'text/xml');
    const items = Array.from(xml.querySelectorAll('item')).slice(0, 8);

    if (items.length === 0) {
      list.innerHTML = '<li>No news entries found. Use the official link below.</li>';
      return;
    }

    list.innerHTML = items
      .map((item) => {
        const title = item.querySelector('title')?.textContent || 'Untitled';
        const link = item.querySelector('link')?.textContent || '#';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        return `<li><a href="${link}" target="_blank" rel="noreferrer">${title}</a><br><small>${pubDate}</small></li>`;
      })
      .join('');
  } catch (err) {
    list.innerHTML = '<li>Feed unavailable right now. Please use official PUBG News below.</li>';
  }
}

function setupReportLink() {
  const form = document.getElementById('report-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('pubg-user').value.trim();
    const output = document.getElementById('report-output');
    if (!user) {
      output.textContent = 'Enter a PUBG username to jump to report results.';
      return;
    }
    const reportUrl = `https://pubg.report/streams?player=${encodeURIComponent(user)}`;
    output.innerHTML = `Open player stream kills: <a href="${reportUrl}" target="_blank" rel="noreferrer">${reportUrl}</a>`;
  });
}

function setupXboxSso() {
  const button = document.getElementById('xbox-login');
  if (!button) return;
  button.addEventListener('click', () => {
    const clientId = 'YOUR_MICROSOFT_APP_CLIENT_ID';
    const redirect = encodeURIComponent(window.location.origin + '/sso.html');
    const scopes = encodeURIComponent('XboxLive.signin offline_access openid profile');
    const url = `https://login.live.com/oauth20_authorize.srf?client_id=${clientId}&response_type=token&redirect_uri=${redirect}&scope=${scopes}`;
    window.location.href = url;
  });
}

function parseToken() {
  const out = document.getElementById('token-status');
  if (!out) return;
  const hash = window.location.hash;
  if (hash.includes('access_token=')) {
    out.textContent = 'Xbox sign-in token received. Exchange and verify token on your secure backend.';
  }
}

setActiveNav();
loadRss();
setupReportLink();
setupXboxSso();
parseToken();
