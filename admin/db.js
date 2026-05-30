/* ============================================================
   שכבת נתונים — מערכת ניהול בתי כנסת ראש העין
   נשמר מקומית בדפדפן (localStorage) עם ייצוא/ייבוא JSON.
   המבנה מופרד מהממשק כדי שבעתיד אפשר יהיה לחבר שרת/API
   (להחליף את read/write בקריאות fetch) בלי לשנות את שאר הקוד.
   ============================================================ */
const DB = (function () {
  const KEYS = {
    syn: 'rh_synagogues',
    don: 'rh_donations',
    seeded: 'rh_seeded_v1',
  };

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (e) { return []; }
  }
  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /* ----- נתוני דמו ראשוניים (פעם אחת בלבד) ----- */
  function seed() {
    if (localStorage.getItem(KEYS.seeded)) return;
    const synagogues = [
      {
        id: uid(), name: 'בית כנסת היכל הרש"ש', nusach: 'תימן - בלאדי',
        neighborhood: 'מרכז העיר', address: 'רחוב שבזי, ראש העין',
        rabbi: 'הרב יוסף', gabbai: 'מר דוד', phone: '',
        shacharit: '06:15', mincha: '13:30', arvit: '19:45',
        notes: 'מניין ותיקין בשבת',
      },
      {
        id: uid(), name: 'בית כנסת אהל יצחק', nusach: 'תימן - שאמי',
        neighborhood: 'גבעת הסלעים', address: '',
        rabbi: '', gabbai: '', phone: '',
        shacharit: '06:30', mincha: '13:15', arvit: '20:00',
        notes: '',
      },
      {
        id: uid(), name: 'בית כנסת נהר שלום', nusach: 'ספרד',
        neighborhood: 'פסגות אפק', address: '',
        rabbi: '', gabbai: '', phone: '',
        shacharit: '07:00', mincha: '', arvit: '',
        notes: '',
      },
    ];
    write(KEYS.syn, synagogues);

    const today = new Date().toISOString().slice(0, 10);
    write(KEYS.don, [
      {
        id: uid(), synagogueId: synagogues[0].id, donor: 'משפחת כהן',
        amount: 500, date: today, purpose: 'אחזקת בית הכנסת',
        method: 'מזומן', receipt: '1001', notes: '',
      },
      {
        id: uid(), synagogueId: synagogues[0].id, donor: 'אלמוני',
        amount: 180, date: today, purpose: 'קופת חסד',
        method: 'העברה בנקאית', receipt: '1002', notes: '',
      },
    ]);

    localStorage.setItem(KEYS.seeded, '1');
  }

  /* ----- בתי כנסת ----- */
  const synagogues = {
    all() { return read(KEYS.syn); },
    get(id) { return read(KEYS.syn).find(s => s.id === id) || null; },
    save(obj) {
      const list = read(KEYS.syn);
      if (obj.id) {
        const i = list.findIndex(s => s.id === obj.id);
        if (i > -1) list[i] = obj;
      } else {
        obj.id = uid();
        list.push(obj);
      }
      write(KEYS.syn, list);
      return obj;
    },
    remove(id) {
      write(KEYS.syn, read(KEYS.syn).filter(s => s.id !== id));
      // השארת תרומות שמורות, אך ניתוק השיוך
      write(KEYS.don, read(KEYS.don).map(d =>
        d.synagogueId === id ? { ...d, synagogueId: '' } : d));
    },
  };

  /* ----- תרומות ----- */
  const donations = {
    all() { return read(KEYS.don); },
    get(id) { return read(KEYS.don).find(d => d.id === id) || null; },
    save(obj) {
      const list = read(KEYS.don);
      obj.amount = Number(obj.amount) || 0;
      if (obj.id) {
        const i = list.findIndex(d => d.id === obj.id);
        if (i > -1) list[i] = obj;
      } else {
        obj.id = uid();
        list.push(obj);
      }
      write(KEYS.don, list);
      return obj;
    },
    remove(id) {
      write(KEYS.don, read(KEYS.don).filter(d => d.id !== id));
    },
  };

  /* ----- ייצוא / ייבוא גיבוי מלא ----- */
  function exportAll() {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      synagogues: read(KEYS.syn),
      donations: read(KEYS.don),
    }, null, 2);
  }
  function importAll(json) {
    const data = JSON.parse(json);
    if (Array.isArray(data.synagogues)) write(KEYS.syn, data.synagogues);
    if (Array.isArray(data.donations)) write(KEYS.don, data.donations);
    localStorage.setItem(KEYS.seeded, '1');
  }

  seed();
  return { synagogues, donations, exportAll, importAll, uid };
})();

/* ----- כלי עזר משותפים ----- */
function ils(n) {
  return '₪' + (Number(n) || 0).toLocaleString('he-IL');
}
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function toggleMenu() {
  const el = document.getElementById('navLinks');
  if (el) el.classList.toggle('open');
}
