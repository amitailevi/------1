/* ===== כולל הרש"ש ראש העין — סקריפט משותף (זמני שבת + אנימציות) ===== */

document.addEventListener('DOMContentLoaded', function () {
  loadShabbatTimes();
  initReveal();
});

// אנימציית חשיפה עדינה בעת גלילה
function initReveal() {
  var items = document.querySelectorAll('.card, .section-title, .shabbat-box, .prose, .verse-band');
  items.forEach(function (el) { el.classList.add('reveal'); });

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { obs.observe(el); });
}

/* ===== זמני כניסת ויציאת שבת לראש העין (Hebcal API) ===== */
async function loadShabbatTimes() {
  var box = document.getElementById('shabbatTimes');
  if (!box) return;

  var url = 'https://www.hebcal.com/shabbat?cfg=json' +
    '&latitude=32.0956&longitude=34.9568&tzid=Asia/Jerusalem&b=30&M=on&lg=h&geo=pos';

  try {
    var res = await fetch(url);
    var data = await res.json();

    var candles = null, havdalah = null, parasha = null;
    (data.items || []).forEach(function (item) {
      if (item.category === 'candles' && !candles) candles = item;
      if (item.category === 'havdalah' && !havdalah) havdalah = item;
      if (item.category === 'parashat' && !parasha) parasha = item;
    });

    var fmt = function (iso) {
      if (!iso) return '--:--';
      return new Date(iso).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    };
    var dayName = function (iso) {
      if (!iso) return '';
      return new Date(iso).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    var par = document.getElementById('shabbatParasha');
    if (par && parasha) par.textContent = parasha.hebrew || parasha.title;

    box.innerHTML =
      '<div class="time-pill"><div class="label">🕯️ כניסת השבת</div>' +
        '<div class="val">' + fmt(candles && candles.date) + '</div>' +
        '<div class="day">' + dayName(candles && candles.date) + '</div></div>' +
      '<div class="time-pill"><div class="label">✨ צאת השבת</div>' +
        '<div class="val">' + fmt(havdalah && havdalah.date) + '</div>' +
        '<div class="day">' + dayName(havdalah && havdalah.date) + '</div></div>';
  } catch (e) {
    box.innerHTML = '<p style="opacity:.8">לא ניתן לטעון את זמני השבת כעת. נסו לרענן את העמוד.</p>';
  }
}
