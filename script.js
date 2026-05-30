/* ===== כולל הרש"ש ראש העין - סקריפט משותף ===== */

// תפריט נייד
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// סימון הקישור הפעיל בתפריט לפי העמוד הנוכחי
document.addEventListener('DOMContentLoaded', function () {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  loadShabbatTimes();
  initReveal();
});

// אנימציית חשיפה עדינה בעת גלילה
function initReveal() {
  const items = document.querySelectorAll('.card, .section-title, .shabbat-box, .prose');
  items.forEach(function (el) { el.classList.add('reveal'); });

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { obs.observe(el); });
}

/* ===== זמני כניסת ויציאת שבת לראש העין (Hebcal API) ===== */
async function loadShabbatTimes() {
  const box = document.getElementById('shabbatTimes');
  if (!box) return;

  // ראש העין: קו רוחב 32.0956, קו אורך 34.9568
  // b=30 -> הדלקת נרות 30 דק' לפני השקיעה | M=on -> צאת שבת לפי 3 כוכבים
  const url = 'https://www.hebcal.com/shabbat?cfg=json' +
    '&latitude=32.0956&longitude=34.9568&tzid=Asia/Jerusalem' +
    '&b=30&M=on&lg=h&geo=pos';

  try {
    const res = await fetch(url);
    const data = await res.json();

    let candles = null, havdalah = null, parasha = null;
    (data.items || []).forEach(function (item) {
      if (item.category === 'candles' && !candles) candles = item;
      if (item.category === 'havdalah' && !havdalah) havdalah = item;
      if (item.category === 'parashat' && !parasha) parasha = item;
    });

    const fmt = function (iso) {
      if (!iso) return '--:--';
      const d = new Date(iso);
      return d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    };
    const dayName = function (iso) {
      if (!iso) return '';
      return new Date(iso).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    const par = document.getElementById('shabbatParasha');
    if (par && parasha) par.textContent = parasha.hebrew || parasha.title;

    box.innerHTML =
      '<div class="time-pill">' +
        '<div class="label">🕯️ כניסת השבת</div>' +
        '<div class="val">' + fmt(candles && candles.date) + '</div>' +
        '<div class="day">' + dayName(candles && candles.date) + '</div>' +
      '</div>' +
      '<div class="time-pill">' +
        '<div class="label">✨ צאת השבת</div>' +
        '<div class="val">' + fmt(havdalah && havdalah.date) + '</div>' +
        '<div class="day">' + dayName(havdalah && havdalah.date) + '</div>' +
      '</div>';
  } catch (e) {
    box.innerHTML = '<p style="opacity:.8">לא ניתן לטעון את זמני השבת כעת. נסו לרענן את העמוד.</p>';
  }
}
