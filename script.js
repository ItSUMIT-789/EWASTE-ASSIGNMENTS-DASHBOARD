/* Dashboard logic: render, search/filter, details modal, theme. Independent of background.js. */
(() => {
  'use strict';
  const BASE = 'assignments/';
  const TYPE_LABEL = { pdf:'PDF', xlsx:'Spreadsheet', image:'Image', video:'Video' };
  const data = window.ASSIGNMENTS || [];
  const $ = (id) => document.getElementById(id);
  const state = { q:'', cat:'', types:new Set() };

  const url = (a, f) => BASE + a.folder + '/' + encodeURIComponent(f.name);
  const el = (tag, props = {}, ...kids) => {
    const n = Object.assign(document.createElement(tag), props);
    kids.forEach((k) => n.append(k));
    return n;
  };

  /* ---------- stats & filters ---------- */
  const cats = [...new Set(data.map((a) => a.category))].sort();
  $('stat-assignments').textContent = data.length;
  $('stat-resources').textContent = data.reduce((n, a) => n + a.files.length, 0);
  $('stat-categories').textContent = cats.length;
  cats.forEach((c) => $('category').append(el('option', { value:c, textContent:c })));

  const typesPresent = Object.keys(TYPE_LABEL).filter((t) => data.some((a) => a.files.some((f) => f.type === t)));
  typesPresent.forEach((t) => {
    const b = el('button', { type:'button', className:'chip', textContent:TYPE_LABEL[t] });
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      state.types.has(t) ? state.types.delete(t) : state.types.add(t);
      b.setAttribute('aria-pressed', state.types.has(t));
      render();
    });
    $('types').append(b);
  });

  /* ---------- grid ---------- */
  function matches(a) {
    const q = state.q.trim().toLowerCase();
    if (q && !(`${a.id} assignment ${a.title} ${a.description}`.toLowerCase().includes(q))) return false;
    if (state.cat && a.category !== state.cat) return false;
    if (state.types.size && !a.files.some((f) => state.types.has(f.type))) return false;
    return true;
  }

  function card(a) {
    const open = el('button', { type:'button', className:'btn', textContent:'View resources' });
    open.setAttribute('aria-label', `View resources for assignment ${a.id}: ${a.title}`);
    open.addEventListener('click', () => openModal(a, open));
    return el('article', { className:'card' },
      el('div', { className:'card-top' }, el('span', { className:'num', textContent:a.id }), el('span', { className:'badge', textContent:a.category })),
      el('h3', { textContent:a.title }),
      el('p', { textContent:a.description }),
      a.verified ? '' : el('span', { className:'tbd', textContent:'Title to verify' }),
      el('div', { className:'card-foot' }, el('span', { textContent:`${a.files.length} resource${a.files.length === 1 ? '' : 's'}` }), open));
  }

  function render() {
    const list = data.filter(matches);
    $('grid').replaceChildren(...list.map(card));
    $('empty').hidden = list.length > 0;
    $('count').textContent = `Showing ${list.length} of ${data.length} assignments`;
  }

  function reset() {
    state.q = ''; state.cat = ''; state.types.clear();
    $('search').value = ''; $('category').value = '';
    document.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
    render();
  }
  $('search').addEventListener('input', (e) => { state.q = e.target.value; render(); });
  $('category').addEventListener('change', (e) => { state.cat = e.target.value; render(); });
  $('reset').addEventListener('click', reset);
  $('empty-reset').addEventListener('click', reset);

  /* ---------- details modal ---------- */
  const modal = $('modal');
  let opener = null;

  function markMissing(li, msg) {
    li.classList.add('unavailable');
    if (!li.querySelector('.missing')) li.append(el('p', { className:'missing', textContent:msg }));
  }

  function resource(a, f) {
    const href = url(a, f);
    const li = el('li', { className:'res' });
    const row = el('div', { className:'res-row' });
    row.append(el('span', { className:'res-name' }, el('strong', { textContent:f.label }), el('br'), f.name));
    const link = el('a', { className:'btn', href });
    if (f.type === 'pdf') { link.textContent = 'Open PDF'; link.target = '_blank'; link.rel = 'noopener'; }
    else if (f.type === 'xlsx') { link.textContent = 'Download spreadsheet'; link.setAttribute('download', f.name); }
    else if (f.type === 'image') { link.textContent = 'Open full size'; link.target = '_blank'; link.rel = 'noopener'; }
    else { link.textContent = 'Open video'; link.target = '_blank'; link.rel = 'noopener'; }
    link.setAttribute('aria-label', `${link.textContent}: ${f.label}`);
    row.append(link);
    li.append(row);

    const notFound = () => markMissing(li, 'This file could not be found. Check that it was copied into ' + BASE + a.folder + '/.');
    if (f.type === 'image') {
      const img = el('img', { src:href, alt:f.label, loading:'lazy' });
      img.addEventListener('error', () => { img.remove(); notFound(); });
      li.append(img);
    } else if (f.type === 'video') {
      const v = el('video', { src:href, controls:true, preload:'metadata' });
      v.setAttribute('aria-label', f.label);
      v.addEventListener('error', () => { v.remove(); notFound(); });
      li.append(v);
    } else if (location.protocol.startsWith('http')) {
      fetch(href, { method:'HEAD' }).then((r) => { if (!r.ok) notFound(); }).catch(() => {});
    }
    return li;
  }

  function openModal(a, trigger) {
    opener = trigger;
    $('m-title').textContent = `${a.id} · ${a.title}`;
    $('m-desc').textContent = a.description + (a.verified ? '' : ' (Title to verify.)');
    $('m-list').replaceChildren(...a.files.map((f) => resource(a, f)));
    modal.showModal();
  }
  const closeModal = () => modal.close();
  $('m-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  modal.addEventListener('close', () => {
    modal.querySelectorAll('video').forEach((v) => v.pause());
    if (opener) opener.focus();
  });

  /* ---------- theme ---------- */
  const root = document.documentElement, tbtn = $('theme');
  function setTheme(t) {
    root.dataset.theme = t;
    tbtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    try { localStorage.setItem('ah-theme', t); } catch (e) {}
  }
  try { const s = localStorage.getItem('ah-theme'); if (s) setTheme(s); } catch (e) {}
  tbtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  render();
})();
