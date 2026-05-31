/* ===== כולל הרש"ש ראש העין — Header/Footer משותפים (מקור אמת אחד) ===== */
(function () {
  var NAV = [
    ['index.html',    'בית'],
    ['calendar.html', 'לוח שנה'],
    ['luach.html',    'לוח זמנים'],
    ['judaism.html',  'בתי כנסת'],
    ['newcity.html',  'ראש העין החדשה'],
    ['library.html',  'ספרייה'],
    ['rashash.html',  'הרש"ש'],
    ['sippurim.html', 'סיפורי הרש"ש'],
    ['about.html',    'צור קשר']
  ];

  var here = location.pathname.split('/').pop() || 'index.html';

  var navItems = NAV.map(function (n) {
    var active = (n[0] === here) ? ' class="active"' : '';
    return '<li><a href="' + n[0] + '"' + active + '>' + n[1] + '</a></li>';
  }).join('');

  var header =
    '<header class="site-header"><div class="container nav">' +
      '<a class="brand" href="index.html"><span class="logo">ש</span>' +
        '<div><b>כולל הרש"ש</b><br><span>ראש העין</span></div></a>' +
      '<button class="nav-toggle" onclick="toggleMenu()" aria-label="תפריט">☰</button>' +
      '<ul class="nav-links" id="navLinks">' + navItems + '</ul>' +
    '</div></header>';

  var year = new Date().getFullYear();
  var footer =
    '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
        '<div><h4>כולל הרש"ש ראש העין</h4>' +
          '<p>עמותה לתורה, חסד ומורשת יהדות תימן בעיר ראש העין.</p></div>' +
        '<div><h4>שירותי יהדות</h4>' +
          '<a href="calendar.html">לוח שנה יהודי</a>' +
          '<a href="luach.html">לוח זמנים</a>' +
          '<a href="judaism.html">בתי כנסת ומקוואות</a>' +
          '<a href="newcity.html">ראש העין החדשה</a>' +
          '<a href="library.html">ספרייה תורנית</a></div>' +
        '<div><h4>מורשת וקהילה</h4>' +
          '<a href="rashash.html">הרש"ש הקדוש</a>' +
          '<a href="sippurim.html">סיפורי הרש"ש</a>' +
          '<a href="teimanim.html">יהדות תימן</a>' +
          '<a href="news.html">חדשות</a>' +
          '<a href="about.html">צור קשר</a></div>' +
      '</div>' +
      '<div class="footer-bottom">© ' + year + ' עמותת כולל הרש"ש ראש העין · כל הזכויות שמורות</div>' +
    '</div></footer>';

  function inject() {
    var h = document.getElementById('app-header');
    var f = document.getElementById('app-footer');
    if (h) h.outerHTML = header;
    if (f) f.outerHTML = footer;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();

// תפריט נייד
window.toggleMenu = function () {
  var el = document.getElementById('navLinks');
  if (el) el.classList.toggle('open');
};
