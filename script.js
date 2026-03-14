const RSS_URL = 'https://v2.velog.io/rss/@yujintak';
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&count=6`;
const DEFAULT_THUMBNAIL = 'https://velog.velcdn.com/images/velog.png';

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function createCard(post) {
  const thumbnail = post.thumbnail || DEFAULT_THUMBNAIL;
  const summary = stripHtml(post.description).slice(0, 80).trim();
  const displaySummary = summary.length >= 80 ? summary + '...' : summary;

  const card = document.createElement('a');
  card.className = 'blog-card';
  card.href = post.link;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.innerHTML = `
    <div class="blog-card-thumb">
      <img src="${thumbnail}" alt="${post.title}" onerror="this.src='${DEFAULT_THUMBNAIL}'">
    </div>
    <div class="blog-card-body">
      <p class="blog-card-date">${formatDate(post.pubDate)}</p>
      <h3 class="blog-card-title">${post.title}</h3>
      <p class="blog-card-summary">${displaySummary}</p>
    </div>
  `;
  return card;
}

async function loadBlogPosts() {
  const container = document.getElementById('blog-cards');
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (data.status !== 'ok' || !data.items.length) {
      container.innerHTML = '<p class="blog-error">글을 불러오지 못했습니다.</p>';
      return;
    }

    container.innerHTML = '';
    data.items.forEach(post => container.appendChild(createCard(post)));
  } catch {
    container.innerHTML = '<p class="blog-error">글을 불러오지 못했습니다.</p>';
  }
}

loadBlogPosts();
