/* DişSeansım v2 modülleri (2026-10): takvim, onam, laboratuvar, tahsilat/taksit, hekim primi, ikonlar, mobil alt menü.
   app.html'deki global yardımcıları kullanır: api, B, authH, USER, MEM, escH, toast, openM, closeM, nav, ymd, waPhone, waRemind, openPtDetail, pdSearch. */
(function () {
  'use strict';
  var E = function (v) { return escH(v); };
  var TL = function (n) { return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(+n || 0); };
  var dTR = function (s) { if (!s) return '—'; var d = new Date(String(s).length === 10 ? s + 'T12:00:00' : s); return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }); };
  var hm = function (d) { return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }); };
  var el = function (html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  var STAFF = [], CHAIRS = [];
  async function refs() {
    var s = await api('GET', '/api/clinic/staff'); if (Array.isArray(s)) STAFF = s;
    var c = await api('GET', '/api/clinic/chairs'); if (Array.isArray(c)) CHAIRS = c;
  }

  // ── İkonlar (emoji yerine çizgi ikon) ──────────────────────────────────
  var P = {
    dashboard: 'M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z',
    appointments: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
    patients: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8',
    odontogram: 'M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7 .6 3 1 6.5 2.5 6.5S9.5 17 12 17s3 4 4.5 4S18.4 17.5 19 14.5c.5-2.5 2-4 2-7C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z',
    xrays: 'M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2zM8 8v8M12 7v10M16 8v8',
    notes: 'M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9zM14 3v6h6M8 13h8M8 17h5',
    prescriptions: 'M10.5 20.5l10-10a4.95 4.95 0 10-7-7l-10 10a4.95 4.95 0 107 7zM8.5 8.5l7 7',
    plans: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2 2 2 0 00-2-2h-2a2 2 0 00-2 2zM9 12h6M9 16h4',
    consents: 'M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z',
    labs: 'M9 3h6M10 3v6l-5 9a2 2 0 001.7 3h10.6a2 2 0 001.7-3l-5-9V3M7 14h10',
    billing: 'M14 2H6a2 2 0 00-2 2v16l3-2 3 2 3-2 3 2V8zM14 2v6h6M8 12h6M8 16h4',
    collections: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
    inventory: 'M21 16V8a2 2 0 00-1-1.7l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.7l7 4a2 2 0 002 0l7-4a2 2 0 001-1.7zM3.3 7L12 12l8.7-5M12 22V12',
    sms: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
    sterilization: 'M12 2.7l5.7 5.6a8 8 0 11-11.3 0z',
    reports: 'M3 3v18h18M7 15l4-4 3 3 6-6',
    commission: 'M19 5L5 19M6.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM17.5 20a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
    referral: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z',
    settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-2.7 1.17V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-2.7-1.17l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15 1.65 1.65 0 003 14H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6 1.65 1.65 0 0010 3.09V3a2 2 0 114 0v.09a1.65 1.65 0 002.7 1.17l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.2.6.8 1 1.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z',
    menu: 'M3 6h18M3 12h18M3 18h18',
  };
  var svg = function (k) { return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (P[k] || P.notes) + '"/></svg>'; };

  function addNav(after, v, label) {
    var ref = document.querySelector('.ni[data-v="' + after + '"]'); if (!ref || document.querySelector('.ni[data-v="' + v + '"]')) return;
    ref.insertAdjacentHTML('afterend', '<div class="ni" data-v="' + v + '" onclick="nav(\'' + v + '\')"><span class="ico"></span><span>' + label + '</span></div>');
  }
  function addView(v, inner) {
    if (document.getElementById('view-' + v)) return;
    document.getElementById('view-appointments').parentElement.insertAdjacentHTML('beforeend', '<div class="view" id="view-' + v + '">' + inner + '</div>');
  }

  // ── Mobil alt menü ─────────────────────────────────────────────────────
  function mobileNav() {
    if (document.getElementById('bnav')) return;
    var items = [['dashboard', 'Bugün'], ['appointments', 'Takvim'], ['patients', 'Hastalar'], ['collections', 'Tahsilat']];
    document.body.appendChild(el('<nav id="bnav" aria-label="Alt menü">' + items.map(function (x) { return '<button type="button" data-v="' + x[0] + '" onclick="nav(\'' + x[0] + '\')">' + svg(x[0]) + '<span>' + x[1] + '</span></button>'; }).join('') +
      '<button type="button" id="bnav-more">' + svg('menu') + '<span>Menü</span></button></nav>'));
    document.getElementById('bnav-more').onclick = function () { document.body.classList.toggle('sb-open'); };
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.ni')) document.body.classList.remove('sb-open'); });
    document.body.insertAdjacentHTML('beforeend', '<div id="sb-veil" onclick="document.body.classList.remove(\'sb-open\')"></div>');
    var ni = document.querySelector('.ni'); var sb = ni && ni.closest('aside, .sb, .sidebar'); if (sb) sb.classList.add('v2-sb');
  }

  // ── Nav sarmalayıcı ────────────────────────────────────────────────────
  var LOADERS = {}, TITLES = { consents: 'Onam formları', labs: 'Laboratuvar', collections: 'Tahsilat ve taksit', commission: 'Hekim primi', dashboard: 'Bugün' };
  var baseNav = window.nav;
  window.nav = function (v) {
    baseNav(v);
    if (TITLES[v]) document.getElementById('tb-title').textContent = TITLES[v];
    document.querySelectorAll('#bnav button[data-v]').forEach(function (b) { b.classList.toggle('on', b.dataset.v === v); });
    if (LOADERS[v]) LOADERS[v]();
  };

  // ── Takvim ─────────────────────────────────────────────────────────────
  var ls = function (k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } };
  var CAL = { mode: ls('ds_cal_mode', 'cal'), span: ls('ds_cal_span', 'day'), by: ls('ds_cal_by', 'doctor'), start: 8, end: 20, px: 1.4 };
  function listCard() { var t = document.getElementById('apts-tb').closest('table'); return t.closest('.card') || t.parentElement; }
  function calShell() {
    var head = document.querySelector('#view-appointments .sh .fl'); if (!head || document.getElementById('cal-ctl')) return;
    head.insertAdjacentHTML('afterbegin',
      '<div id="cal-ctl" class="seg"><button type="button" data-k="mode" data-v="cal">Takvim</button><button type="button" data-k="mode" data-v="list">Liste</button></div>' +
      '<div id="cal-ctl2" class="seg"><button type="button" data-k="span" data-v="day">Gün</button><button type="button" data-k="span" data-v="week">Hafta</button></div>' +
      '<div id="cal-ctl3" class="seg"><button type="button" data-k="by" data-v="doctor">Hekim</button><button type="button" data-k="by" data-v="chair">Koltuk</button></div>');
    listCard().insertAdjacentHTML('beforebegin', '<div id="cal" class="cal"></div>');
    document.querySelectorAll('#view-appointments .seg button').forEach(function (b) {
      b.onclick = function () { CAL[b.dataset.k] = b.dataset.v; try { localStorage.setItem('ds_cal_' + b.dataset.k, b.dataset.v); } catch (e) {} window.loadApts(); };
    });
  }
  function weekDays(base) { var d = new Date(base + 'T12:00:00'); d.setDate(d.getDate() - (d.getDay() + 6) % 7); var out = []; for (var i = 0; i < 7; i++) { out.push(ymd(d)); d.setDate(d.getDate() + 1); } return out; }
  var baseLoadApts = window.loadApts;
  window.loadApts = async function () {
    calShell();
    document.querySelectorAll('#view-appointments .seg button').forEach(function (b) { b.classList.toggle('on', CAL[b.dataset.k] === b.dataset.v); });
    var cal = CAL.mode === 'cal';
    document.getElementById('cal-ctl2').style.display = cal ? '' : 'none';
    document.getElementById('cal-ctl3').style.display = cal && CAL.span === 'day' ? '' : 'none';
    listCard().style.display = cal ? 'none' : '';
    document.getElementById('view-appointments').classList.toggle('is-cal', cal);
    document.getElementById('cal').style.display = cal ? '' : 'none';
    await baseLoadApts();
    if (cal) await renderCal();
  };
  async function renderCal() {
    if (!STAFF.length) await refs();
    var base = document.getElementById('apt-date-f').value || ymd();
    var days = CAL.span === 'week' ? weekDays(base) : [base];
    var apts = await api('GET', '/api/appointments?from=' + days[0] + '&to=' + days[days.length - 1]);
    apts = (Array.isArray(apts) ? apts : []).filter(function (a) { return a.status !== 'cancelled'; });
    window._aptCache = apts; // waRemind bu önbelleği kullanır
    var cols;
    if (CAL.span === 'week') cols = days.map(function (d) { return { key: d, day: d, label: new Date(d + 'T12:00:00').toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' }), today: d === ymd() }; });
    else if (CAL.by === 'chair') cols = CHAIRS.map(function (c) { return { key: c.id, day: base, chair_id: c.id, label: c.name, color: c.color }; }).concat([{ key: 'none', day: base, chair_id: null, label: CHAIRS.length ? 'Koltuk atanmamış' : 'Koltuk tanımlı değil (Ayarlar)' }]);
    else {
      var docs = STAFF.filter(function (s) { return ['owner', 'dentist', 'admin'].indexOf(s.role) >= 0 || apts.some(function (a) { return a.doctor_id === s.id; }); });
      cols = docs.map(function (s) { return { key: s.id, day: base, doctor_id: s.id, label: s.name }; });
    }
    if (!cols.length) cols = [{ key: 'all', day: base, label: 'Randevular' }];
    var colOf = function (a) {
      if (CAL.span === 'week') return ymd(new Date(a.starts_at));
      if (CAL.by === 'chair') return a.chair_id && CHAIRS.some(function (c) { return c.id === a.chair_id; }) ? a.chair_id : 'none';
      return cols.some(function (c) { return c.key === a.doctor_id; }) ? a.doctor_id : cols[0].key;
    };
    CAL.start = 8; CAL.end = 20;
    apts.forEach(function (a) { var s = new Date(a.starts_at), e = new Date(a.ends_at); CAL.start = Math.min(CAL.start, s.getHours()); CAL.end = Math.max(CAL.end, e.getHours() + (e.getMinutes() ? 1 : 0)); });
    var H = (CAL.end - CAL.start) * 60 * CAL.px, hours = '';
    for (var h = CAL.start; h < CAL.end; h++) hours += '<div class="cal-h" style="height:' + 60 * CAL.px + 'px">' + String(h).padStart(2, '0') + ':00</div>';
    var html = '<div class="cal-scroll"><div class="cal-grid" style="--cols:' + cols.length + '"><div class="cal-hd cal-corner"></div>' +
      cols.map(function (c) { return '<div class="cal-hd' + (c.today ? ' today' : '') + '">' + (c.color ? '<i style="background:' + E(c.color) + '"></i>' : '') + E(c.label) + '</div>'; }).join('') +
      '<div class="cal-times">' + hours + '</div>' +
      cols.map(function (c, ci) {
        var items = apts.filter(function (a) { return colOf(a) === c.key && (CAL.span === 'week' || ymd(new Date(a.starts_at)) === c.day); });
        return '<div class="cal-col" data-ci="' + ci + '" style="height:' + H + 'px;--slot:' + 15 * CAL.px + 'px">' + items.map(block).join('') + nowLine(c.day) + '</div>';
      }).join('') + '</div></div>';
    if (!apts.length) html += '<p class="cal-empty">Bu ' + (CAL.span === 'week' ? 'hafta' : 'gün') + ' randevu yok. Takvimde boş bir saate dokunarak randevu ekleyin.</p>';
    var box = document.getElementById('cal'); box.innerHTML = html;
    box.querySelectorAll('.cal-col').forEach(function (colEl) {
      colEl.addEventListener('click', function (ev) {
        if (ev.target.closest('.ev')) return;
        var c = cols[+colEl.dataset.ci], r = colEl.getBoundingClientRect();
        var min = Math.floor(((ev.clientY - r.top) / CAL.px) / 15) * 15 + CAL.start * 60;
        var st = new Date(c.day + 'T00:00:00'); st.setMinutes(min);
        window._calPreset = { start: st, doctor_id: c.doctor_id || null, chair_id: c.chair_id || null };
        openAptModal();
      });
    });
    box.querySelectorAll('.ev').forEach(function (b) { dragify(b, cols, apts); });
    function block(a) {
      var s = new Date(a.starts_at), e = new Date(a.ends_at);
      var top = ((s.getHours() - CAL.start) * 60 + s.getMinutes()) * CAL.px, h = Math.max(24, (e - s) / 60000 * CAL.px);
      var ch = CHAIRS.find(function (c) { return c.id === a.chair_id; });
      return '<div class="ev st-' + E(a.status) + '" data-id="' + E(a.id) + '" style="top:' + top + 'px;height:' + h + 'px;' + (ch ? '--chc:' + E(ch.color) : '') + '" tabindex="0">' +
        '<b>' + hm(s) + ' · ' + E(a.first_name) + ' ' + E(a.last_name) + '</b><span>' + E(a.type || '') + (a.tooth_numbers ? ' · ' + E(a.tooth_numbers) : '') + (CAL.span === 'week' && a.doctor_name ? ' · ' + E(a.doctor_name) : '') + '</span><i class="rz" aria-hidden="true"></i></div>';
    }
    function nowLine(day) {
      if (day !== ymd()) return ''; var n = new Date(), m = (n.getHours() - CAL.start) * 60 + n.getMinutes(); if (m < 0 || m > (CAL.end - CAL.start) * 60) return '';
      return '<div class="cal-now" style="top:' + m * CAL.px + 'px"></div>';
    }
  }
  // Sürükle = taşı, alt kenardan çek = süre, dokun = işlemler
  function dragify(b, cols, apts) {
    var a = apts.find(function (x) { return x.id === b.dataset.id; }); if (!a) return;
    var sx, sy, moved = false, resize = false, top0, h0, colEls = Array.prototype.slice.call(document.querySelectorAll('#cal .cal-col'));
    b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); evMenu(a, b); } });
    b.addEventListener('pointerdown', function (ev) {
      if (ev.button !== 0) return; resize = ev.target.classList.contains('rz'); sx = ev.clientX; sy = ev.clientY; moved = false; top0 = b.offsetTop; h0 = b.offsetHeight;
      b.setPointerCapture(ev.pointerId);
    });
    b.addEventListener('pointermove', function (ev) {
      if (!b.hasPointerCapture(ev.pointerId)) return; var dy = ev.clientY - sy, dx = ev.clientX - sx;
      if (!moved && Math.abs(dy) < 6 && Math.abs(dx) < 6) return; moved = true; b.classList.add('drag');
      var snap = 15 * CAL.px;
      if (resize) b.style.height = Math.max(snap, Math.round((h0 + dy) / snap) * snap) + 'px';
      else { b.style.top = Math.max(0, Math.round((top0 + dy) / snap) * snap) + 'px'; b.style.transform = 'translateX(' + dx + 'px)'; }
    });
    b.addEventListener('pointerup', async function (ev) {
      if (!b.hasPointerCapture(ev.pointerId)) return; b.releasePointerCapture(ev.pointerId);
      if (!moved) return evMenu(a, b);
      var target = colEls.find(function (c) { var r = c.getBoundingClientRect(); return ev.clientX >= r.left && ev.clientX <= r.right; });
      var col = cols[target ? +target.dataset.ci : +b.parentElement.dataset.ci];
      var startMin = Math.round(parseFloat(b.style.top) / CAL.px) + CAL.start * 60;
      var durMin = resize ? Math.max(15, Math.round(b.offsetHeight / CAL.px / 15) * 15) : Math.round((new Date(a.ends_at) - new Date(a.starts_at)) / 60000);
      if (resize) { var s0 = new Date(a.starts_at); startMin = s0.getHours() * 60 + s0.getMinutes(); col = { day: ymd(s0) }; }
      var st = new Date(col.day + 'T00:00:00'); st.setMinutes(startMin); var en = new Date(st.getTime() + durMin * 60000);
      var body = { starts_at: st.toISOString(), ends_at: en.toISOString() };
      if (!resize && col.doctor_id) body.doctor_id = col.doctor_id;
      if (!resize && CAL.by === 'chair' && CAL.span === 'day') body.chair_id = col.chair_id;
      var r = await api('PUT', '/api/appointments/' + a.id, body);
      if (r && r.error) toast(r.error, 'e'); else toast('Randevu güncellendi: ' + hm(st) + '–' + hm(en));
      renderCal();
    });
  }
  function evMenu(a, b) {
    document.querySelectorAll('.ev-menu').forEach(function (m) { m.remove(); });
    var s = new Date(a.starts_at);
    var m = el('<div class="ev-menu" role="dialog" aria-label="Randevu işlemleri"><div class="evm-h"><b>' + E(a.first_name + ' ' + a.last_name) + '</b><span>' + s.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + hm(s) + '–' + hm(new Date(a.ends_at)) + '</span><span>' + E(a.type || '') + (a.doctor_name ? ' · ' + E(a.doctor_name) : '') + '</span></div>' +
      '<div class="evm-b">' +
      (a.status === 'scheduled' ? '<button data-a="arrived">Geldi</button><button data-a="no-show">Gelmedi</button>' : '') +
      (a.status === 'scheduled' || a.status === 'arrived' ? '<button data-a="completed" class="pri">Tamamla</button>' : '') +
      (a.phone ? '<button data-a="wa">WhatsApp ile hatırlat</button>' : '') +
      '<button data-a="pt">Hasta kartı</button>' +
      (a.status !== 'completed' ? '<button data-a="cancel" class="dan">İptal et</button>' : '') + '</div></div>');
    document.body.appendChild(m);
    var r = b.getBoundingClientRect();
    m.style.top = Math.max(8, Math.min(innerHeight - m.offsetHeight - 8, r.top)) + 'px';
    m.style.left = Math.max(8, Math.min(innerWidth - m.offsetWidth - 8, r.right + 6)) + 'px';
    m.addEventListener('click', async function (ev) {
      var k = ev.target.dataset.a; if (!k) return; m.remove();
      if (k === 'wa') return waRemind(a.id);
      if (k === 'pt') return openPtDetail(a.patient_id);
      if (k === 'cancel') { if (!confirm('Randevu iptal edilsin mi?')) return; await api('DELETE', '/api/appointments/' + a.id); toast('Randevu iptal edildi'); return renderCal(); }
      var res = await api('PUT', '/api/appointments/' + a.id, { status: k }); if (res && res.error) toast(res.error, 'e'); else toast('Güncellendi'); renderCal();
    });
    setTimeout(function () { document.addEventListener('click', function off(e) { if (!m.contains(e.target)) { m.remove(); document.removeEventListener('click', off); } }); }, 0);
  }

  // Randevu penceresi: hekim + koltuk seçimi, takvimden gelen saat
  function patchAptModal() {
    var chairIn = document.getElementById('apt-chair'); if (!chairIn || document.getElementById('apt-doc')) return;
    var wrap = chairIn.parentElement;
    wrap.innerHTML = '<label>Koltuk</label><select id="apt-chair"><option value="">—</option></select>';
    wrap.parentElement.insertAdjacentHTML('afterend', '<div class="fr"><label>Hekim</label><select id="apt-doc"></select></div>');
  }
  var baseOpenApt = window.openAptModal;
  window.openAptModal = async function (pt) {
    var pre = window._calPreset; window._calPreset = null;
    patchAptModal(); if (!STAFF.length) await refs();
    baseOpenApt(pt);
    document.getElementById('apt-doc').innerHTML = STAFF.map(function (s) { return '<option value="' + E(s.id) + '">' + E(s.name) + '</option>'; }).join('');
    document.getElementById('apt-chair').innerHTML = '<option value="">—</option>' + CHAIRS.map(function (c) { return '<option value="' + E(c.id) + '">' + E(c.name) + '</option>'; }).join('');
    document.getElementById('apt-doc').value = (pre && pre.doctor_id) || USER.id;
    if (pre) {
      if (pre.chair_id) document.getElementById('apt-chair').value = pre.chair_id;
      var toLocal = function (d) { return ymd(d) + 'T' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
      document.getElementById('apt-start').value = toLocal(pre.start);
      document.getElementById('apt-end').value = toLocal(new Date(pre.start.getTime() + 30 * 60000));
    }
  };
  window.saveApt = async function () {
    var ptName = document.getElementById('apt-pt-in').value.trim(); if (!ptName) { toast('Hasta adı zorunlu', 'e'); return; }
    var ptId = window._aptPtId;
    if (!ptId) { var pts = await api('GET', '/api/patients?q=' + encodeURIComponent(ptName) + '&limit=1'); ptId = pts && pts.patients && pts.patients[0] && pts.patients[0].id; if (!ptId) { toast('Hasta bulunamadı, önce kaydedin', 'e'); return; } }
    var body = { patient_id: ptId, doctor_id: (document.getElementById('apt-doc') || {}).value || USER.id, chair_id: (document.getElementById('apt-chair') || {}).value || null,
      starts_at: new Date(document.getElementById('apt-start').value).toISOString(), ends_at: new Date(document.getElementById('apt-end').value).toISOString(),
      type: document.getElementById('apt-type').value, tooth_numbers: document.getElementById('apt-teeth').value || null, notes: document.getElementById('apt-notes').value };
    var r = await api('POST', '/api/appointments', body);
    if (r && !r.error) { toast('Randevu kaydedildi'); closeM('m-apt'); window.loadApts(); if (window.markOB) markOB('appointment'); }
    else if (r) toast(r.error, 'e');
  };

  // ── Onam formları ──────────────────────────────────────────────────────
  var TPL = [];
  addView('consents', '<div class="sh"><div class="st">Onam formları</div><div class="fl aic g8"><button class="btn btn-p" onclick="v2NewConsent()">+ Yeni onam</button></div></div>' +
    '<p class="v2-lead">Hazır şablonları (implant, kanal, çekim, ortodonti, KVKK açık rıza…) klinikte tablette imzalatın ya da hastaya WhatsApp ile imza linki gönderin. İmzalı form tarih, saat ve IP bilgisiyle saklanır.</p>' +
    '<div class="card v2-card"><div class="tw"><table class="tbl"><thead><tr><th>Hasta</th><th>Form</th><th>Durum</th><th>Tarih</th><th></th></tr></thead><tbody id="cons-tb"></tbody></table></div></div>');
  LOADERS.consents = async function () {
    var rows = await api('GET', '/api/clinic/consents' + (window._gPtId ? '?patient_id=' + _gPtId : '')); rows = Array.isArray(rows) ? rows : [];
    document.getElementById('cons-tb').innerHTML = rows.length ? rows.map(function (c) {
      var st = c.signed_at ? '<span class="bdg bg2">İmzalandı</span>' : c.pending ? '<span class="bdg ba2">İmza bekliyor</span>' : '<span class="bdg bk">Süresi doldu</span>';
      return '<tr><td><b>' + E(c.first_name + ' ' + c.last_name) + '</b></td><td>' + E(c.title) + '</td><td>' + st + '</td><td>' + dTR(c.signed_at || c.created_at) + '</td><td class="r">' + (c.signed_at ? '<button class="btn btn-s btn-xs" onclick="v2ShowConsent(\'' + c.id + '\')">Görüntüle / yazdır</button>' : '') + '</td></tr>';
    }).join('') : '<tr><td colspan="5"><div class="v2-empty">Henüz onam formu yok.</div></td></tr>';
  };
  document.body.insertAdjacentHTML('beforeend',
    '<div class="mbg" id="m-cons"><div class="mbox mlg"><div class="mhd"><div class="mt">Yeni onam formu</div><button class="mx" onclick="closeM(\'m-cons\')">✕</button></div><div class="mb">' +
    '<div class="fr fc2"><div><label>Hasta *</label><div class="pr"><input id="cons-pt" placeholder="Hasta adı yazın…" autocomplete="off" oninput="pdSearch(this,\'cons-dd\',function(p){window._v2Pt=p})"><div class="pt-dd" id="cons-dd"></div></div></div>' +
    '<div><label>Şablon</label><select id="cons-tpl" onchange="v2TplPick()"></select></div></div>' +
    '<div class="fr"><label>Başlık</label><input id="cons-title"></div><div class="fr"><label>Metin <span class="xs c3">(göndermeden önce düzenleyebilirsiniz)</span></label><textarea id="cons-body" rows="9"></textarea></div></div>' +
    '<div class="mft"><button class="btn btn-s" onclick="v2SendConsent()">WhatsApp ile imza linki gönder</button><button class="btn btn-p" onclick="v2SignHere()">Klinikte imzalat</button></div></div></div>' +
    '<div class="mbg" id="m-sign"><div class="mbox mlg"><div class="mhd"><div class="mt" id="sign-t">İmza</div><button class="mx" onclick="closeM(\'m-sign\')">✕</button></div><div class="mb">' +
    '<div id="sign-body" class="sign-text"></div><label class="v2-check"><input type="checkbox" id="sign-ok"> Metni okudum, anladım ve onaylıyorum.</label>' +
    '<div class="fr"><label>Ad soyad</label><input id="sign-name"></div><label>İmza</label><canvas id="sign-pad" class="sign-pad"></canvas><button class="btn btn-s btn-xs" onclick="v2PadClear()">Temizle</button></div>' +
    '<div class="mft"><button class="btn btn-s" onclick="closeM(\'m-sign\')">Vazgeç</button><button class="btn btn-p" onclick="v2SaveSigned()">İmzayı kaydet</button></div></div></div>');
  window.v2NewConsent = async function () {
    if (!TPL.length) TPL = (await api('GET', '/api/clinic/consent-templates')) || [];
    document.getElementById('cons-tpl').innerHTML = TPL.map(function (t) { return '<option value="' + t.key + '">' + E(t.title) + '</option>'; }).join('');
    window._v2Pt = window._gPt || null; document.getElementById('cons-pt').value = window._v2Pt ? _v2Pt.first_name + ' ' + _v2Pt.last_name : '';
    v2TplPick(); openM('m-cons');
  };
  window.v2TplPick = function () { var t = TPL.find(function (x) { return x.key === document.getElementById('cons-tpl').value; }) || {}; document.getElementById('cons-title').value = t.title || ''; document.getElementById('cons-body').value = t.body || ''; };
  function consBody() {
    if (!window._v2Pt) { toast('Önce hastayı seçin', 'e'); return null; }
    return { patient_id: _v2Pt.id, template_key: document.getElementById('cons-tpl').value, title: document.getElementById('cons-title').value, body: document.getElementById('cons-body').value };
  }
  window.v2SendConsent = async function () {
    var b = consBody(); if (!b) return;
    var r = await api('POST', '/api/clinic/consents', b); if (!r || r.error) return toast((r && r.error) || 'Kaydedilemedi', 'e');
    var link = location.origin + location.pathname.replace(/[^/]*$/, '') + 'onam.html?t=' + r.token;
    var ph = waPhone(r.phone || (_v2Pt && _v2Pt.phone));
    var msg = 'Merhaba, ' + (MEM && MEM.tenantName ? MEM.tenantName : 'kliniğimiz') + ' olarak "' + b.title + '" formunu bilginize sunuyoruz. Okuyup telefonunuzdan imzalayabilirsiniz (72 saat geçerli): ' + link;
    closeM('m-cons'); nav('consents');
    if (ph) window.open('https://wa.me/' + ph + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    else { if (navigator.clipboard) navigator.clipboard.writeText(link); toast('Hastanın telefonu kayıtlı değil; imza linki kopyalandı'); }
  };
  var pad = { drawn: false };
  function initPad() {
    var c = document.getElementById('sign-pad'), r = c.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    c.width = r.width * dpr; c.height = r.height * dpr; var x = c.getContext('2d'); x.scale(dpr, dpr); x.lineWidth = 2.2; x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = '#111';
    var on = false; pad.drawn = false;
    var pt = function (e) { var q = c.getBoundingClientRect(); return [e.clientX - q.left, e.clientY - q.top]; };
    c.onpointerdown = function (e) { on = true; c.setPointerCapture(e.pointerId); var p = pt(e); x.beginPath(); x.moveTo(p[0], p[1]); };
    c.onpointermove = function (e) { if (!on) return; var p = pt(e); x.lineTo(p[0], p[1]); x.stroke(); pad.drawn = true; };
    c.onpointerup = c.onpointercancel = function () { on = false; };
  }
  window.v2PadClear = function () { var c = document.getElementById('sign-pad'); c.getContext('2d').clearRect(0, 0, c.width, c.height); pad.drawn = false; };
  window.v2SignHere = function () {
    var b = consBody(); if (!b) return; pad.body = b;
    document.getElementById('sign-t').textContent = b.title; document.getElementById('sign-body').textContent = b.body;
    document.getElementById('sign-name').value = _v2Pt.first_name + ' ' + _v2Pt.last_name; document.getElementById('sign-ok').checked = false;
    closeM('m-cons'); openM('m-sign'); setTimeout(initPad, 60);
  };
  window.v2SaveSigned = async function () {
    if (!document.getElementById('sign-ok').checked) return toast('Onay kutusunu işaretleyin', 'e');
    if (!pad.drawn) return toast('İmza alanına imza atın', 'e');
    var b = Object.assign({}, pad.body, { signature: document.getElementById('sign-pad').toDataURL('image/png'), signer_name: document.getElementById('sign-name').value });
    var r = await api('POST', '/api/clinic/consents', b); if (!r || r.error) return toast((r && r.error) || 'Kaydedilemedi', 'e');
    closeM('m-sign'); toast('İmzalı onam kaydedildi'); nav('consents');
  };
  window.v2ShowConsent = async function (id) {
    var c = await api('GET', '/api/clinic/consents/' + id); if (!c || c.error) return;
    var w = window.open('', '_blank'); if (!w) return toast('Açılır pencereye izin verin', 'e');
    w.document.write('<!doctype html><meta charset="utf-8"><title>' + E(c.title) + '</title><style>body{font:15px/1.6 system-ui,sans-serif;max-width:760px;margin:32px auto;padding:0 20px;color:#111}h1{font-size:22px}pre{white-space:pre-wrap;font:inherit}.m{color:#666;font-size:13px}img{max-width:320px;border-bottom:1px solid #999}</style>' +
      '<p class="m">' + E(c.tenant_name) + '</p><h1>' + E(c.title) + '</h1><p><b>Hasta:</b> ' + E(c.first_name + ' ' + c.last_name) + '</p><pre>' + E(c.body) + '</pre>' +
      '<p><b>İmzalayan:</b> ' + E(c.signer_name) + '<br><b>Tarih:</b> ' + new Date(c.signed_at).toLocaleString('tr-TR') + '<br><span class="m">IP: ' + E(c.signed_ip || '') + '</span></p><img alt="İmza" src="' + E(c.signature) + '"><script>setTimeout(print,300)<\/script>');
    w.document.close();
  };

  // ── Laboratuvar ────────────────────────────────────────────────────────
  var LAB_LBL = { sent: 'Laboratuvarda', tryin: 'Provada', received: 'Klinikte (geldi)', delivered: 'Hastaya teslim', cancelled: 'İptal' };
  addView('labs', '<div class="sh"><div class="st">Laboratuvar işleri</div><div class="fl aic g8"><div class="seg" id="lab-seg"><button type="button" data-v="1" class="on">Açık işler</button><button type="button" data-v="0">Tümü</button></div><button class="btn btn-p" onclick="v2NewLab()">+ Yeni iş</button></div></div>' +
    '<div class="card v2-card"><div class="tw"><table class="tbl"><thead><tr><th>Hasta</th><th>İş</th><th>Laboratuvar</th><th>Gönderim</th><th>Teslim</th><th>Durum</th><th class="r">Ücret</th></tr></thead><tbody id="lab-tb"></tbody></table></div></div>');
  var labOpen = '1';
  document.querySelectorAll('#lab-seg button').forEach(function (b) { b.onclick = function () { labOpen = b.dataset.v; document.querySelectorAll('#lab-seg button').forEach(function (x) { x.classList.toggle('on', x === b); }); LOADERS.labs(); }; });
  LOADERS.labs = async function () {
    var rows = await api('GET', '/api/clinic/labs' + (labOpen === '1' ? '?open=1' : '')); rows = Array.isArray(rows) ? rows : [];
    window._labs = rows;
    document.getElementById('lab-tb').innerHTML = rows.length ? rows.map(function (l) {
      var late = ['sent', 'tryin'].indexOf(l.status) >= 0 && l.days_left != null;
      var due = l.due_on ? dTR(String(l.due_on).slice(0, 10)) + (late ? (l.days_left < 0 ? ' <span class="bdg br2">' + (-l.days_left) + ' gün gecikti</span>' : l.days_left <= 1 ? ' <span class="bdg ba2">' + (l.days_left ? 'Yarın' : 'Bugün') + '</span>' : '') : '') : '—';
      return '<tr><td><b>' + E(l.first_name + ' ' + l.last_name) + '</b></td><td>' + E(l.work_type) + (l.teeth || l.shade ? '<div class="xs c3">' + (l.teeth ? 'Diş ' + E(l.teeth) : '') + (l.shade ? ' · renk ' + E(l.shade) : '') + '</div>' : '') + '</td><td>' + E(l.lab_name) + '</td><td class="nowrap">' + dTR(String(l.sent_on).slice(0, 10)) + '</td><td class="nowrap">' + due + '</td>' +
        '<td><select class="lab-st" aria-label="Durum" data-id="' + l.id + '">' + Object.keys(LAB_LBL).map(function (k) { return '<option value="' + k + '"' + (k === l.status ? ' selected' : '') + '>' + LAB_LBL[k] + '</option>'; }).join('') + '</select>' +
        (l.status === 'received' && l.phone ? ' <button class="btn btn-s btn-xs" onclick="v2LabWa(\'' + l.id + '\')">Hastaya haber ver</button>' : '') + '</td><td class="r">' + TL(l.cost) + '</td></tr>';
    }).join('') : '<tr><td colspan="7"><div class="v2-empty">' + (labOpen === '1' ? 'Açık laboratuvar işi yok.' : 'Henüz laboratuvar işi yok.') + '</div></td></tr>';
    document.querySelectorAll('.lab-st').forEach(function (s) { s.onchange = async function () { var r = await api('PUT', '/api/clinic/labs/' + s.dataset.id, { status: s.value }); if (r && r.error) toast(r.error, 'e'); else { toast('Durum güncellendi'); LOADERS.labs(); } }; });
  };
  window.v2LabWa = function (id) {
    var l = (window._labs || []).find(function (x) { return x.id === id; }); if (!l) return;
    var msg = 'Merhaba ' + l.first_name + ', ' + l.work_type.toLocaleLowerCase('tr') + ' çalışmanız laboratuvardan kliniğimize ulaştı. Size uygun bir gün için randevu oluşturalım mı?';
    window.open('https://wa.me/' + waPhone(l.phone) + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  };
  document.body.insertAdjacentHTML('beforeend',
    '<div class="mbg" id="m-lab"><div class="mbox"><div class="mhd"><div class="mt">Yeni laboratuvar işi</div><button class="mx" onclick="closeM(\'m-lab\')">✕</button></div><div class="mb">' +
    '<div class="fr"><label>Hasta *</label><div class="pr"><input id="lab-pt" placeholder="Hasta adı yazın…" autocomplete="off" oninput="pdSearch(this,\'lab-dd\',function(p){window._v2Pt=p})"><div class="pt-dd" id="lab-dd"></div></div></div>' +
    '<div class="fr fc2"><div><label>İş türü *</label><input id="lab-work" list="lab-works" placeholder="Zirkonyum kuron"></div><div><label>Laboratuvar *</label><input id="lab-name" list="lab-names"></div></div>' +
    '<datalist id="lab-works"><option>Zirkonyum kuron</option><option>Metal destekli porselen</option><option>E-max kuron</option><option>İmplant üstü kuron</option><option>Köprü</option><option>Total protez</option><option>Parsiyel protez</option><option>Gece plağı</option><option>Şeffaf plak</option><option>Geçici kuron</option><option>Lamina</option></datalist><datalist id="lab-names"></datalist>' +
    '<div class="fr fc3"><div><label>Diş no</label><input id="lab-teeth" placeholder="11, 21"></div><div><label>Renk</label><input id="lab-shade" placeholder="A2"></div><div><label>Ücret (TL)</label><input id="lab-cost" type="number" min="0" value="0"></div></div>' +
    '<div class="fr fc2"><div><label>Gönderim</label><input id="lab-sent" type="date"></div><div><label>Beklenen teslim</label><input id="lab-due" type="date"></div></div>' +
    '<div class="fr"><label>Not</label><textarea id="lab-notes" rows="2"></textarea></div></div>' +
    '<div class="mft"><button class="btn btn-s" onclick="closeM(\'m-lab\')">Vazgeç</button><button class="btn btn-p" onclick="v2SaveLab()">Kaydet</button></div></div></div>');
  window.v2NewLab = function () {
    window._v2Pt = window._gPt || null; document.getElementById('lab-pt').value = window._v2Pt ? _v2Pt.first_name + ' ' + _v2Pt.last_name : '';
    ['lab-work', 'lab-teeth', 'lab-shade', 'lab-notes', 'lab-due'].forEach(function (i) { document.getElementById(i).value = ''; });
    document.getElementById('lab-sent').value = ymd(); document.getElementById('lab-cost').value = 0;
    var names = Array.from(new Set((window._labs || []).map(function (l) { return l.lab_name; })));
    document.getElementById('lab-names').innerHTML = names.map(function (n) { return '<option>' + E(n) + '</option>'; }).join('');
    openM('m-lab');
  };
  window.v2SaveLab = async function () {
    if (!window._v2Pt) return toast('Hastayı seçin', 'e');
    var g = function (i) { return document.getElementById(i).value; };
    var r = await api('POST', '/api/clinic/labs', { patient_id: _v2Pt.id, work_type: g('lab-work'), lab_name: g('lab-name'), teeth: g('lab-teeth'), shade: g('lab-shade'), cost: g('lab-cost'), sent_on: g('lab-sent'), due_on: g('lab-due'), notes: g('lab-notes') });
    if (!r || r.error) return toast((r && r.error) || 'Kaydedilemedi', 'e');
    closeM('m-lab'); toast('Laboratuvar işi kaydedildi'); nav('labs');
  };

  // ── Tahsilat ve taksit ─────────────────────────────────────────────────
  addView('collections', '<div class="sh"><div class="st">Tahsilat ve taksit</div></div>' +
    '<div class="v2-kpis" id="col-kpi"></div>' +
    '<div class="card v2-card"><div class="v2-ch">Vadesi gelen ve geçen taksitler <span class="xs c3">önümüzdeki 7 gün dahil</span></div><div class="tw"><table class="tbl"><thead><tr><th>Hasta</th><th>Fatura</th><th>Taksit</th><th>Vade</th><th class="r">Tutar</th><th></th></tr></thead><tbody id="inst-tb"></tbody></table></div></div>' +
    '<div class="card v2-card"><div class="v2-ch">Açık bakiyeler</div><div class="tw"><table class="tbl"><thead><tr><th>Hasta</th><th>Fatura</th><th>Tarih</th><th class="r">Toplam</th><th class="r">Kalan</th><th></th></tr></thead><tbody id="open-tb"></tbody></table></div></div>');
  LOADERS.collections = async function () {
    var inst = await api('GET', '/api/clinic/installments?days=7'); inst = Array.isArray(inst) ? inst : [];
    var inv = await api('GET', '/api/invoices?limit=100'); inv = Array.isArray(inv) ? inv : (inv && inv.invoices) || [];
    var open = inv.filter(function (i) { return i.status === 'draft' || i.status === 'partial'; });
    var overdue = inst.filter(function (s) { return s.days_left < 0; });
    var sum = function (a, f) { return a.reduce(function (t, x) { return t + (+f(x) || 0); }, 0); };
    document.getElementById('col-kpi').innerHTML = [['Toplam açık bakiye', TL(sum(open, function (i) { return i.total - i.amount_paid; }))], ['Geciken taksit', overdue.length + ' adet · ' + TL(sum(overdue, function (s) { return s.amount; }))], ['7 gün içinde vadesi gelen', TL(sum(inst.filter(function (s) { return s.days_left >= 0; }), function (s) { return s.amount; }))], ['Açık fatura', open.length + ' adet']]
      .map(function (k) { return '<div class="v2-kpi"><span>' + k[0] + '</span><b>' + k[1] + '</b></div>'; }).join('');
    window._inst = inst;
    document.getElementById('inst-tb').innerHTML = inst.length ? inst.map(function (s) {
      var b = s.days_left < 0 ? '<span class="bdg br2">' + (-s.days_left) + ' gün gecikti</span>' : s.days_left === 0 ? '<span class="bdg ba2">Bugün</span>' : '<span class="bdg bk">' + s.days_left + ' gün kaldı</span>';
      return '<tr><td><b>' + E(s.first_name + ' ' + s.last_name) + '</b></td><td>' + E(s.inv_no || '') + '</td><td>' + s.no + '. taksit</td><td class="nowrap">' + dTR(String(s.due_on).slice(0, 10)) + ' ' + b + '</td><td class="r">' + TL(s.amount) + '</td>' +
        '<td class="r nowrap">' + (s.phone ? '<button class="btn btn-s btn-xs" onclick="v2InstWa(\'' + s.id + '\')">Hatırlat</button> ' : '') + '<button class="btn btn-g btn-xs" onclick="v2Pay(\'' + s.invoice_id + '\',' + (+s.amount) + ')">Ödeme al</button></td></tr>';
    }).join('') : '<tr><td colspan="6"><div class="v2-empty">Vadesi gelen taksit yok.</div></td></tr>';
    document.getElementById('open-tb').innerHTML = open.length ? open.map(function (i) {
      var rest = (+i.total) - (+i.amount_paid);
      return '<tr><td><b>' + E((i.first_name || '') + ' ' + (i.last_name || '')) + '</b></td><td>' + E(i.inv_no || '') + '</td><td class="nowrap">' + dTR(String(i.inv_date).slice(0, 10)) + '</td><td class="r">' + TL(i.total) + '</td><td class="r"><b>' + TL(rest) + '</b></td><td class="r"><button class="btn btn-g btn-xs" onclick="v2Pay(\'' + i.id + '\',' + rest.toFixed(2) + ')">Ödeme al</button></td></tr>';
    }).join('') : '<tr><td colspan="6"><div class="v2-empty">Açık bakiye yok.</div></td></tr>';
  };
  window.v2InstWa = function (id) {
    var s = (window._inst || []).find(function (x) { return x.id === id; }); if (!s) return;
    var msg = 'Merhaba ' + s.first_name + ', ' + (MEM && MEM.tenantName ? MEM.tenantName + ' ' : '') + 'tedavi ödemenizin ' + s.no + '. taksiti (' + TL(s.amount) + ') ' + dTR(String(s.due_on).slice(0, 10)) + ' tarihinde. Bilginize sunarız.';
    window.open('https://wa.me/' + waPhone(s.phone) + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  };
  document.body.insertAdjacentHTML('beforeend',
    '<div class="mbg" id="m-pay"><div class="mbox"><div class="mhd"><div class="mt">Ödeme al</div><button class="mx" onclick="closeM(\'m-pay\')">✕</button></div><div class="mb">' +
    '<div class="fr fc2"><div><label>Tutar (TL)</label><input id="pay-amt" type="number" min="0" step="0.01"></div><div><label>Yöntem</label><select id="pay-meth"><option value="nakit">Nakit</option><option value="kredi">Kredi kartı</option><option value="havale">Havale / EFT</option><option value="sigorta">Sigorta</option></select></div></div>' +
    '<div class="fr"><label>Not</label><input id="pay-note"></div></div><div class="mft"><button class="btn btn-s" onclick="closeM(\'m-pay\')">Vazgeç</button><button class="btn btn-p" onclick="v2PaySave()">Kaydet</button></div></div></div>');
  var payInv = null;
  window.v2Pay = function (invId, amt) { payInv = invId; document.getElementById('pay-amt').value = amt; document.getElementById('pay-note').value = ''; openM('m-pay'); };
  window.v2PaySave = async function () {
    var r = await api('POST', '/api/clinic/invoices/' + payInv + '/pay', { amount: document.getElementById('pay-amt').value, method: document.getElementById('pay-meth').value, notes: document.getElementById('pay-note').value });
    if (!r || r.error) return toast((r && r.error) || 'Kaydedilemedi', 'e');
    closeM('m-pay'); toast('Ödeme kaydedildi'); LOADERS.collections();
  };
  (function () {
    var paid = document.getElementById('inv-paid'); if (!paid) return;
    paid.closest('.fr').insertAdjacentHTML('afterend', '<div class="fr fc2"><div><label>Kalan tutar için taksit</label><select id="inv-inst"><option value="0">Taksit yok</option>' +
      [2, 3, 4, 5, 6, 8, 10, 12].map(function (n) { return '<option value="' + n + '">' + n + ' taksit</option>'; }).join('') + '</select></div><div><label>İlk taksit tarihi</label><input id="inv-first" type="date"></div></div>');
  })();
  window.saveInv = async function () {
    var ptId = window._invPtId;
    if (!ptId) { var pn = document.getElementById('inv-pt-in').value.trim(); if (!pn) { toast('Hasta seçin', 'e'); return; } var pts = await api('GET', '/api/patients?q=' + encodeURIComponent(pn) + '&limit=1'); ptId = pts && pts.patients && pts.patients[0] && pts.patients[0].id; if (!ptId) { toast('Hasta bulunamadı', 'e'); return; } }
    var items = []; document.querySelectorAll('[id^="ii-d-"]').forEach(function (x, i) { var d = x.value.trim(); if (d) items.push({ description: d, quantity: parseFloat((document.getElementById('ii-q-' + i) || {}).value || 1), unit_price: parseFloat((document.getElementById('ii-p-' + i) || {}).value || 0) }); });
    var g = function (i) { return document.getElementById(i).value; };
    var disc = parseFloat(g('inv-disc') || 0);
    var body = { patient_id: ptId, doctor_id: USER.id, inv_date: g('inv-date'), items: items, subtotal: parseFloat(g('inv-sub') || 0), discount: disc, discount_amount: disc, tax_rate: parseFloat(g('inv-tax') || 0),
      amount_paid: parseFloat(g('inv-paid') || 0), payment_method: g('inv-meth'), installments: +((document.getElementById('inv-inst') || {}).value || 0), first_due: (document.getElementById('inv-first') || {}).value || null };
    var r = await api('POST', '/api/invoices', body);
    if (r && !r.error) { toast(body.installments ? 'Fatura ve ' + body.installments + ' taksit kaydedildi' : 'Fatura kaydedildi'); closeM('m-inv'); if (window.loadBilling) loadBilling(); }
    else if (r) toast(r.error, 'e');
  };

  // ── Hekim primi ────────────────────────────────────────────────────────
  addView('commission', '<div class="sh"><div class="st">Hekim primi (hakediş)</div><div class="fl aic g8"><input type="date" id="com-from" aria-label="Başlangıç"><input type="date" id="com-to" aria-label="Bitiş"><label class="v2-check"><input type="checkbox" id="com-lab" checked> Laboratuvar giderini düş</label><button class="btn btn-s" onclick="v2Com()">Hesapla</button></div></div>' +
    '<p class="v2-lead">Prim, dönem içinde tahsil edilen tutar üzerinden hesaplanır. Oranları bu tablodan düzenleyebilirsiniz.</p>' +
    '<div class="card v2-card"><div class="tw"><table class="tbl"><thead><tr><th>Hekim</th><th class="r">Tahsilat</th><th class="r">Laboratuvar</th><th class="r">Prim matrahı</th><th>Oran</th><th class="r">Prim</th></tr></thead><tbody id="com-tb"></tbody></table></div></div>');
  LOADERS.commission = function () { var f = document.getElementById('com-from'); if (!f.value) { f.value = ymd().slice(0, 8) + '01'; document.getElementById('com-to').value = ymd(); } v2Com(); };
  window.v2Com = async function () {
    var q = '?from=' + document.getElementById('com-from').value + '&to=' + document.getElementById('com-to').value + '&lab=' + (document.getElementById('com-lab').checked ? 1 : 0);
    var d = await api('GET', '/api/clinic/commission' + q);
    if (!d || d.error) { document.getElementById('com-tb').innerHTML = '<tr><td colspan="6"><div class="v2-empty">' + E((d && d.error) || 'Bu raporu görme yetkiniz yok.') + '</div></td></tr>'; return; }
    var canEdit = ['owner', 'admin'].indexOf(MEM && MEM.role) >= 0;
    var tot = d.rows.reduce(function (t, r) { return t + r.commission; }, 0);
    document.getElementById('com-tb').innerHTML = d.rows.map(function (r) {
      return '<tr><td><b>' + E(r.name) + '</b></td><td class="r">' + TL(r.collected) + '</td><td class="r">' + TL(r.lab_cost) + '</td><td class="r">' + TL(r.base) + '</td><td class="nowrap">' +
        (canEdit ? '<input class="com-pct" aria-label="Prim oranı" data-id="' + r.id + '" type="number" min="0" max="100" step="0.5" value="' + (+r.commission_pct) + '" style="width:80px"> %' : '%' + (+r.commission_pct)) + '</td><td class="r"><b>' + TL(r.commission) + '</b></td></tr>';
    }).join('') + '<tr class="tot"><td>Toplam</td><td></td><td></td><td></td><td></td><td class="r"><b>' + TL(tot) + '</b></td></tr>';
    document.querySelectorAll('.com-pct').forEach(function (i) { i.onchange = async function () { var r = await api('PUT', '/api/clinic/staff/' + i.dataset.id + '/commission', { commission_pct: +i.value }); if (r && r.error) toast(r.error, 'e'); else { toast('Oran kaydedildi'); v2Com(); } }; });
  };

  // ── Raporlar: e-Nabız / MBYS dışa aktarım ─────────────────────────────
  (function () {
    var rep = document.getElementById('view-reports'); if (!rep || document.getElementById('mbys-box')) return;
    var sh = rep.querySelector('.sh');
    (sh || rep.firstElementChild).insertAdjacentHTML(sh ? 'afterend' : 'beforebegin', '<div class="card v2-card" id="mbys-box"><div class="v2-ch">e-Nabız (MBYS) için muayene listesi</div><p class="v2-lead" style="margin:0 0 10px">e-Nabız (USS) entegrasyonu geliştirme aşamasında. Bu süreçte tamamlanan muayeneleri Excel uyumlu dosya olarak indirip Bakanlığın MBYS ekranına aktarabilirsiniz.</p>' +
      '<div class="fl aic g8"><input type="date" id="mbys-from" aria-label="Başlangıç"><input type="date" id="mbys-to" aria-label="Bitiş"><button class="btn btn-s" onclick="v2Mbys()">Dosyayı indir</button></div></div>');
    document.getElementById('mbys-from').value = ymd().slice(0, 8) + '01'; document.getElementById('mbys-to').value = ymd();
  })();
  window.v2Mbys = async function () {
    var r = await fetch(B + '/api/clinic/export/visits.csv?from=' + document.getElementById('mbys-from').value + '&to=' + document.getElementById('mbys-to').value, { headers: authH() });
    if (!r.ok) return toast('İndirme yetkiniz yok ya da bir hata oluştu', 'e');
    var a = document.createElement('a'); a.href = URL.createObjectURL(await r.blob()); a.download = 'muayeneler.csv'; a.click();
  };

  // ── Ayarlar: koltuklar ─────────────────────────────────────────────────
  (function () {
    var st = document.getElementById('view-settings'); if (!st || document.getElementById('chair-box')) return;
    st.insertAdjacentHTML('beforeend', '<div class="card v2-card" id="chair-box"><div class="v2-ch">Koltuklar</div><p class="v2-lead" style="margin:0 0 10px">Takvimi koltuk bazında görmek için ünitlerinizi ekleyin.</p><div id="chair-list" class="chair-list"></div>' +
      '<div class="fl aic g8"><input id="chair-name" placeholder="ör. Ünit 2" style="max-width:220px"><input id="chair-color" type="color" value="#0f766e" aria-label="Renk" style="width:48px;padding:2px"><button class="btn btn-s" onclick="v2AddChair()">Ekle</button></div></div>');
  })();
  LOADERS.settings = async function () {
    await refs(); var l = document.getElementById('chair-list'); if (!l) return;
    l.innerHTML = CHAIRS.length ? CHAIRS.map(function (c) { return '<span class="chip"><i style="background:' + E(c.color) + '"></i>' + E(c.name) + ' <button aria-label="Kaldır" onclick="v2DelChair(\'' + c.id + '\')">✕</button></span>'; }).join('') : '<span class="xs c3">Henüz koltuk eklenmedi.</span>';
  };
  window.v2AddChair = async function () {
    var r = await api('POST', '/api/clinic/chairs', { name: document.getElementById('chair-name').value, color: document.getElementById('chair-color').value });
    if (!r || r.error) return toast((r && r.error) || 'Eklenemedi', 'e'); document.getElementById('chair-name').value = ''; toast('Koltuk eklendi'); LOADERS.settings();
  };
  window.v2DelChair = async function (id) { await api('DELETE', '/api/clinic/chairs/' + id); LOADERS.settings(); };

  // ── Kurulum ────────────────────────────────────────────────────────────
  addNav('plans', 'consents', 'Onam formları');
  addNav('consents', 'labs', 'Laboratuvar');
  addNav('billing', 'collections', 'Tahsilat ve taksit');
  addNav('reports', 'commission', 'Hekim primi');
  var dashLbl = document.querySelector('.ni[data-v="dashboard"] span:not(.ico)'); if (dashLbl) dashLbl.textContent = 'Bugün';
  document.querySelectorAll('.ni[data-v] .ico').forEach(function (i) { i.innerHTML = svg(i.parentElement.dataset.v); });
  mobileNav();
})();
