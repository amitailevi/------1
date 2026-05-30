/* ===== עזרי ממשק משותפים — ניווט, toast, מודאל ===== */

// בניית סרגל הניווט בכל עמודי הניהול
function renderNav(active) {
  const links = [
    { href: 'index.html', label: 'דשבורד', key: 'home' },
    { href: 'synagogues.html', label: 'בתי כנסת', key: 'syn' },
    { href: 'donations.html', label: 'תרומות וכספים', key: 'don' },
  ];
  const items = links.map(l =>
    `<li><a href="${l.href}" class="${l.key === active ? 'active' : ''}">${l.label}</a></li>`
  ).join('');
  document.getElementById('siteHeader').innerHTML = `
    <div class="container nav">
      <a class="brand" href="index.html">
        <span class="logo">ש</span>
        <div><b>מערכת ניהול</b><br><span>בתי כנסת ראש העין</span></div>
      </a>
      <button class="nav-toggle" onclick="toggleMenu()" aria-label="תפריט">☰</button>
      <ul class="nav-links" id="navLinks">
        ${items}
        <li><a href="../index.html" class="site-link">↩ לאתר</a></li>
      </ul>
    </div>`;
}

// הודעת אישור קצרה
let _toastTimer;
function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast'; el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

// פתיחה/סגירה של מודאל
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// סגירה בלחיצה על הרקע
document.addEventListener('click', e => {
  if (e.target.classList && e.target.classList.contains('modal-bg')) {
    e.target.classList.remove('open');
  }
});
