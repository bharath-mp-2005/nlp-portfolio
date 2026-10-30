(function () {
  /* ---------- hero: rotating word sphere ---------- */
  var WORDS = [
    { t: 'மொழி', l: 'ta' }, { t: 'language', l: 'en' }, { t: 'ഭാഷ', l: 'ml' }, { t: 'भाषा', l: 'hi' },
    { t: 'சொல்', l: 'ta' }, { t: 'word', l: 'en' }, { t: 'വാക്ക്', l: 'ml' }, { t: 'शब्द', l: 'hi' },
    { t: 'Viterbi', l: 'algo', term: 1 }, { t: 'பொருள்', l: 'ta' }, { t: 'meaning', l: 'en' }, { t: 'അർത്ഥം', l: 'ml' },
    { t: 'morphotactics', l: 'fst', term: 1 }, { t: 'இலக்கணம்', l: 'ta' }, { t: 'grammar', l: 'en' }, { t: 'व्याकरण', l: 'hi' },
    { t: 'edit distance', l: 'dp', term: 1 }, { t: 'வாக்கியம்', l: 'ta' },
    { t: 'cosine', l: 'sim', term: 1 }, { t: 'Naive Bayes', l: 'clf', term: 1 }
  ];
  var GOLDEN = 2.399963;
  var stage = document.getElementById('stage');
  var layer = document.getElementById('words');
  var els = WORDS.map(function (w) {
    var d = document.createElement('div');
    d.className = 'w' + (w.term ? ' term' : '');
    var a = document.createElement('span'); a.textContent = w.t;
    var b = document.createElement('i'); b.textContent = w.l;
    d.appendChild(a); d.appendChild(b);
    layer.appendChild(d);
    return d;
  });
  var rot = 0, dragging = false, lx = 0, W = 640, H = 760, visible = true;
  var reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    W = stage.clientWidth || 640; H = stage.clientHeight || 760;
    stage.style.setProperty('--k', (W / 640).toFixed(3));
    stage.classList.toggle('compact', W < 520);
  }
  function draw() {
    var n = WORDS.length, cx = W * 0.5, cy = H * 0.63, rx = W * 0.38, ry = H * 0.27;
    for (var i = 0; i < n; i++) {
      var ly = -0.7 + (1.6 * (i + 0.5)) / n;
      var r = Math.sqrt(1 - ly * ly);
      var phi = i * GOLDEN + rot;
      var x = cx + rx * r * Math.cos(phi);
      var y = cy + ry * ly;
      var z = r * Math.sin(phi);
      var s = 0.82 + 0.26 * (z + 1) / 2;
      var o = 0.5 + 0.5 * (z + 1) / 2;
      var e = els[i];
      e.style.left = x.toFixed(1) + 'px';
      e.style.top = y.toFixed(1) + 'px';
      e.style.transform = 'translate(-50%,-50%) scale(' + s.toFixed(3) + ')';
      e.style.opacity = o.toFixed(2);
      e.style.zIndex = z > 0 ? 300 + Math.round(z * 50) : 100 + Math.round(z * 50);
    }
  }
  size(); draw();
  window.addEventListener('resize', function () { size(); draw(); });
  if (typeof ResizeObserver === 'function') new ResizeObserver(function () { size(); draw(); }).observe(stage);
  if (typeof IntersectionObserver === 'function') {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(stage);
  }
  function tick() {
    if (!dragging && visible && !reduce) { rot = (rot + 0.004) % 6.283185; draw(); }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  stage.addEventListener('pointerdown', function (e) {
    dragging = true; lx = e.clientX; stage.classList.add('drag');
    try { stage.setPointerCapture(e.pointerId); } catch (x) {}
  });
  stage.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    rot += (e.clientX - lx) * 0.008; lx = e.clientX; draw();
  });
  function up() { dragging = false; stage.classList.remove('drag'); }
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { rot -= 0.2; draw(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { rot += 0.2; draw(); e.preventDefault(); }
  });

  /* ---------- Viterbi (tagging: A adjective, N noun) ---------- */
  var HMM = { S: ['A', 'N'], pi: [0.25, 0.75], A: [[0, 1], [0.5, 0.5]], B: { clown: [0, 0.4], killer: [0, 0.3], problem: [0, 0.3], crazy: [1, 0] } };
  function viterbi(o) {
    var T = o.length, v = [], bp = [], cand = [], e = function (t, s) { return HMM.B[o[t]][s]; };
    v[0] = [HMM.pi[0] * e(0, 0), HMM.pi[1] * e(0, 1)]; bp[0] = [-1, -1]; cand[0] = [null, null];
    for (var t = 1; t < T; t++) {
      v[t] = []; bp[t] = []; cand[t] = [];
      for (var s = 0; s < 2; s++) {
        var c = [v[t - 1][0] * HMM.A[0][s], v[t - 1][1] * HMM.A[1][s]];
        var b = c[1] > c[0] ? 1 : 0;
        v[t][s] = c[b] * e(t, s); bp[t][s] = b; cand[t][s] = c;
      }
    }
    var last = v[T - 1][1] > v[T - 1][0] ? 1 : 0, path = [last];
    for (var k = T - 1; k > 0; k--) { last = bp[k][last]; path.unshift(last); }
    return { v: v, bp: bp, cand: cand, path: path, best: Math.max(v[T - 1][0], v[T - 1][1]) };
  }
  function fmt(n) { return String(Number(n.toPrecision(3))); }
  var vObs = document.getElementById('vObs'), vSvg = document.getElementById('vSvg');
  var vNote = document.getElementById('vNote'), vRes = document.getElementById('vRes'), vErr = document.getElementById('vErr');
  var vStep = 0;
  function parseObs() {
    var w = vObs.value.toLowerCase().split(/\s+/).filter(Boolean);
    if (w.length < 1 || w.length > 5 || w.some(function (x) { return !HMM.B[x]; })) return null;
    return w;
  }
  function renderV() {
    var o = parseObs();
    if (!o) { vErr.textContent = 'Enter 1 to 5 words from: killer, crazy, clown, problem.'; return; }
    vErr.textContent = '';
    var R = viterbi(o), T = o.length;
    if (vStep > T) vStep = T;
    var colW = 150, left = 44, top = 52, rowH = 96, W2 = left + T * colW, H2 = top + 2 * rowH + 6;
    var onPath = function (t, s) { return vStep === T && R.best > 0 && R.path[t] === s; };
    var g = '';
    for (var t = 0; t < T; t++) {
      g += '<text x="' + (left + t * colW + colW / 2) + '" y="24" text-anchor="middle" font-size="13">' + (t + 1) + ' · ' + o[t] + '</text>';
    }
    g += '<text x="4" y="' + (top + 44) + '" font-size="13">A</text><text x="4" y="' + (top + 44 + rowH) + '" font-size="13">N</text>';
    for (var t2 = 1; t2 < T; t2++) {
      if (t2 >= vStep) break;
      for (var s = 0; s < 2; s++) {
        var p = R.bp[t2][s];
        var x1 = left + (t2 - 1) * colW + colW / 2 + 55, y1 = top + 40 + p * rowH;
        var x2 = left + t2 * colW + colW / 2 - 55, y2 = top + 40 + s * rowH;
        var best = vStep === T && R.best > 0 && R.path[t2] === s && R.path[t2 - 1] === p;
        g += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (best ? '#FF5A00' : 'rgba(17,17,17,.45)') + '" stroke-width="' + (best ? 4 : 1.5) + '"/>';
      }
    }
    for (var t3 = 0; t3 < T; t3++) {
      if (t3 >= vStep) break;
      for (var s2 = 0; s2 < 2; s2++) {
        var cx2 = left + t3 * colW + colW / 2, cy = top + 40 + s2 * rowH;
        g += '<g class="' + (onPath(t3, s2) ? 'on' : '') + '"><rect class="nd" x="' + (cx2 - 55) + '" y="' + (cy - 27) + '" width="110" height="54" rx="10"/>' +
          '<text x="' + cx2 + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="12">' + HMM.S[s2] + '</text>' +
          '<text x="' + cx2 + '" y="' + (cy + 15) + '" text-anchor="middle" font-size="14" font-weight="500">' + fmt(R.v[t3][s2]) + '</text></g>';
      }
    }
    vSvg.innerHTML = '<svg class="trellis" viewBox="0 0 ' + W2 + ' ' + H2 + '" role="img" aria-label="Viterbi trellis">' + g + '</svg>';
    if (vStep === 0) {
      vNote.textContent = 'Press Next step to fill the first column.';
    } else if (vStep === 1) {
      vNote.textContent = 'Word 1 (' + o[0] + '): start probability × emission. A: ' + HMM.pi[0] + ' × ' + HMM.B[o[0]][0] + ' = ' + fmt(R.v[0][0]) + '. N: ' + HMM.pi[1] + ' × ' + HMM.B[o[0]][1] + ' = ' + fmt(R.v[0][1]) + '.';
    } else {
      var t4 = vStep - 1, parts = [];
      for (var s3 = 0; s3 < 2; s3++) {
        var c = R.cand[t4][s3];
        parts.push(HMM.S[s3] + ' = max(' + fmt(c[0]) + ' from A, ' + fmt(c[1]) + ' from N) × ' + HMM.B[o[t4]][s3] + ' = ' + fmt(R.v[t4][s3]) + ', from ' + HMM.S[R.bp[t4][s3]]);
      }
      vNote.textContent = 'Word ' + vStep + ' (' + o[t4] + '): ' + parts.join('. ') + '.';
    }
    vRes.textContent = vStep === T ? (R.best > 0 ? 'Best tag sequence: ' + R.path.map(function (i) { return HMM.S[i]; }).join(' → ') + ' (score ' + fmt(R.best) + ').' : 'This word sequence is impossible under the model (score 0).') : '';
  }
  document.getElementById('vNext').addEventListener('click', function () { var o = parseObs(); if (o && vStep < o.length) vStep++; renderV(); });
  document.getElementById('vAll').addEventListener('click', function () { var o = parseObs(); if (o) vStep = o.length; renderV(); });
  document.getElementById('vReset').addEventListener('click', function () { vStep = 0; renderV(); });
  vObs.addEventListener('input', function () { vStep = 0; renderV(); });
  vStep = 4; renderV();

  /* ---------- Tamil morphotactics ---------- */
  var STEM = 'வீடு';
  var CASES = [
    { id: 'none', name: 'no case', suf: '', sg: STEM, pl: 'வீடுகள்', g: '' },
    { id: 'acc', name: 'accusative', suf: 'ஐ', sg: 'வீட்டை', pl: 'வீடுகளை', g: 'ACC' },
    { id: 'ins', name: 'instrumental', suf: 'ஆல்', sg: 'வீட்டால்', pl: 'வீடுகளால்', g: 'INS' },
    { id: 'loc', name: 'locative', suf: 'இல்', sg: 'வீட்டில்', pl: 'வீடுகளில்', g: 'LOC' },
    { id: 'dat', name: 'dative', suf: 'க்கு', sg: 'வீட்டுக்கு', pl: 'வீடுகளுக்கு', g: 'DAT' }
  ];
  var mCase = document.getElementById('mCase'), mPl = document.getElementById('mPl'), mOrd = document.getElementById('mOrd');
  var mChosen = 'acc';
  CASES.forEach(function (c) {
    var lab = document.createElement('label');
    var inp = document.createElement('input');
    inp.type = 'radio'; inp.name = 'mcase'; inp.value = c.id; inp.checked = c.id === mChosen;
    inp.addEventListener('change', function () { mChosen = c.id; renderM(); });
    var sp = document.createElement('span');
    sp.textContent = c.id === 'none' ? 'none' : c.suf + ' ' + c.name;
    lab.appendChild(inp); lab.appendChild(sp); mCase.appendChild(lab);
  });
  function chip(big, small, cls) { return '<div class="chip ' + (cls || '') + '"><b>' + big + '</b><span>' + small + '</span></div>'; }
  function renderM() {
    var pl = mPl.value === '1', c = CASES.filter(function (x) { return x.id === mChosen; })[0], bad = mOrd.value === 'bad';
    var both = pl && c.id !== 'none';
    var chips = chip(STEM, 'stem', 'stem');
    var gloss = 'house';
    var surf, state, ok = true;
    if (both && bad) {
      chips += chip(c.suf, c.g) + chip('கள்', 'PL');
      gloss += '-' + c.g + '-PL';
      surf = '*' + c.sg + 'கள்';
      ok = false;
    } else {
      if (pl) { chips += chip('கள்', 'PL'); gloss += '-PL'; }
      if (c.id !== 'none') { chips += chip(c.suf, c.g); gloss += '-' + c.g; }
      surf = pl ? c.pl : c.sg;
    }
    document.getElementById('mChips').innerHTML = chips;
    document.getElementById('mSurf').textContent = surf;
    document.getElementById('mGloss').textContent = gloss;
    var st = document.getElementById('mState');
    st.className = 'state ' + (ok ? 'ok' : 'no');
    st.textContent = ok ? (both ? 'Accepted: plural comes before case' : 'Accepted') : 'Rejected: a case suffix cannot come before the plural';
    var fst = document.getElementById('mFst');
    var used = [true, pl, c.id !== 'none', ok];
    var names = ['Stem', 'Plural', 'Case', 'Word'];
    var h = '';
    for (var i = 0; i < 4; i++) {
      h += '<span class="s ' + (used[i] ? 'on' : '') + '">' + names[i] + (i === 1 || i === 2 ? ' (optional)' : '') + '</span>';
      if (i < 3) h += '<span class="a" aria-hidden="true">→</span>';
    }
    fst.innerHTML = h;
  }
  mPl.addEventListener('change', renderM); mOrd.addEventListener('change', renderM);
  renderM();

  /* ---------- Edit distance ---------- */
  var eA = document.getElementById('eA'), eB = document.getElementById('eB');
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function renderE() {
    var a = Array.from(eA.value.trim()), b = Array.from(eB.value.trim());
    var n = a.length, m = b.length, d = [], i, j;
    for (i = 0; i <= n; i++) { d[i] = []; for (j = 0; j <= m; j++) d[i][j] = i === 0 ? j : (j === 0 ? i : 0); }
    for (i = 1; i <= n; i++) for (j = 1; j <= m; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    var path = {}, ops = [];
    i = n; j = m; path[i + ',' + j] = 1;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
        ops.unshift(a[i - 1] === b[j - 1] ? { k: 'e', t: a[i - 1] + ' kept' } : { k: 's', t: a[i - 1] + ' → ' + b[j - 1] });
        i--; j--;
      } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
        ops.unshift({ k: 'd', t: 'delete ' + a[i - 1] }); i--;
      } else {
        ops.unshift({ k: 'i', t: 'insert ' + b[j - 1] }); j--;
      }
      path[i + ',' + j] = 1;
    }
    var h = '<table class="dp" aria-label="Edit distance table"><tr><th></th><th></th>';
    for (j = 0; j < m; j++) h += '<th>' + esc(b[j]) + '</th>';
    h += '</tr>';
    for (i = 0; i <= n; i++) {
      h += '<tr><th>' + (i === 0 ? '' : esc(a[i - 1])) + '</th>';
      for (j = 0; j <= m; j++) h += '<td class="' + (path[i + ',' + j] ? 'p' : '') + '">' + d[i][j] + '</td>';
      h += '</tr>';
    }
    h += '</table>';
    document.getElementById('eTable').innerHTML = h;
    document.getElementById('eRes').textContent = 'Edit distance: ' + d[n][m];
    document.getElementById('eOps').innerHTML = ops.map(function (o) { return '<span class="' + (o.k === 'e' ? 'e' : '') + '">' + esc(o.t) + '</span>'; }).join('');
  }
  eA.addEventListener('input', renderE); eB.addEventListener('input', renderE);
  renderE();

  /* ---------- Inaugural addresses (results from the 31 Jul 2026 notebook) ---------- */
  var USE = {
    'Washington 1789': { freedom: 0, government: 8, nation: 2, people: 4, america: 0 },
    'Lincoln 1865': { freedom: 0, government: 1, nation: 3, people: 0, america: 0 },
    'Roosevelt 1933': { freedom: 0, government: 3, nation: 6, people: 8, america: 0 },
    'Kennedy 1961': { freedom: 4, government: 0, nation: 2, people: 1, america: 2 },
    'Obama 2009': { freedom: 3, government: 3, nation: 12, people: 7, america: 10 }
  };
  var LONG = [
    ['1825 Adams', 305, 22.46], ['1789 Washington', 144, 22.22], ['1809 Madison', 113, 21.65], ['1929 Hoover', 364, 21.25],
    ['1829 Jackson', 111, 21.14], ['1849 Taylor', 110, 21.03], ['1893 Cleveland', 205, 20.77], ['1833 Jackson', 109, 20.00],
    ['1845 Polk', 453, 19.94], ['1885 Cleveland', 159, 19.73], ['1853 Pierce', 310, 19.68], ['1901 McKinley', 207, 19.53],
    ['1797 Adams', 202, 18.95], ['1837 Van Buren', 357, 18.91], ['1921 Harding', 318, 18.51], ['1841 Harrison', 700, 18.36],
    ['1909 Taft', 462, 17.94], ['1881 Garfield', 255, 17.81], ['1877 Hayes', 212, 17.76], ['1925 Coolidge', 330, 17.65],
    ['1813 Madison', 96, 17.58], ['1817 Monroe', 275, 17.56], ['1889 Harrison', 357, 17.05], ['1897 McKinley', 326, 16.93],
    ['1861 Lincoln', 270, 16.69], ['1793 Washington', 10, 16.67], ['1857 Buchanan', 218, 15.95], ['1805 Jefferson', 160, 15.92],
    ['1821 Monroe', 317, 15.64], ['1801 Jefferson', 126, 15.37], ['1873 Grant', 86, 14.08], ['1949 Truman', 158, 13.91],
    ['1933 Roosevelt', 118, 12.85], ['1937 Roosevelt', 116, 12.62], ['1905 Roosevelt', 55, 12.33], ['1869 Grant', 64, 11.90],
    ['1913 Wilson', 94, 11.68], ['1973 Nixon', 97, 11.66], ['1941 Roosevelt', 70, 11.16], ['1981 Reagan', 121, 10.63],
    ['1977 Carter', 59, 10.23], ['1917 Wilson', 65, 9.77], ['1985 Reagan', 115, 8.94], ['1865 Lincoln', 30, 8.77],
    ['1953 Eisenhower', 106, 8.72], ['2005 Bush', 91, 8.72], ['2025 Trump', 125, 8.70], ['2013 Obama', 87, 8.40],
    ['1993 Clinton', 66, 8.34], ['2009 Obama', 95, 8.15], ['2001 Bush', 63, 8.13], ['1997 Clinton', 86, 7.75],
    ['1989 Bush', 82, 7.59], ['2017 Trump', 54, 7.58], ['1945 Roosevelt', 18, 7.14], ['1969 Nixon', 66, 6.55],
    ['1957 Eisenhower', 46, 5.69], ['1961 Kennedy', 39, 5.64], ['1965 Johnson', 36, 5.25], ['2021 Biden', 60, 5.06]
  ];
  function bars(rows, max) {
    return rows.map(function (r) {
      var w = max ? Math.max(0, r[1] / max * 100) : 0;
      return '<div class="bar"><span class="l">' + esc(r[0]) + '</span><div class="t"><i style="width:' + w.toFixed(1) + '%"></i></div><span class="v">' + esc(r[2]) + '</span></div>';
    }).join('');
  }
  var iWord = document.getElementById('iWord');
  function renderI() {
    var w = iWord.value;
    var rows = Object.keys(USE).map(function (k) { return [k, USE[k][w], String(USE[k][w])]; });
    var max = Math.max.apply(null, rows.map(function (r) { return r[1]; }));
    document.getElementById('iBars').innerHTML = bars(rows, max);
  }
  iWord.addEventListener('change', renderI);
  renderI();
  var lAll = false, lBtn = document.getElementById('lToggle');
  function renderL() {
    var list = lAll ? LONG : LONG.slice(0, 10);
    document.getElementById('lBars').innerHTML = bars(list.map(function (r) { return [r[0], r[2], r[2].toFixed(2) + '%']; }), LONG[0][2]);
    lBtn.textContent = lAll ? 'Show top 10' : 'Show all ' + LONG.length;
  }
  lBtn.addEventListener('click', function () { lAll = !lAll; renderL(); });
  renderL();

  /* ---------- Bag of words (21 Aug 2026 notebook) ---------- */
  var VOCAB = ['character', 'engine', 'good', 'is', 'optical', 'recognition', 'significant', 'tessaract'];
  var bA = document.getElementById('bA'), bB = document.getElementById('bB');
  function bvec(s) {
    var toks = s.toLowerCase().match(/\b\w\w+\b/g) || [];
    return VOCAB.map(function (w) { return toks.indexOf(w) >= 0 ? 1 : 0; });
  }
  function renderB() {
    var a = bvec(bA.value), b = bvec(bB.value), dot = 0, na = 0, nb = 0, i;
    for (i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i]; nb += b[i]; }
    var h = '<table class="dp vt" aria-label="Binary word vectors"><tr><th></th>';
    VOCAB.forEach(function (w) { h += '<th>' + w + '</th>'; });
    h += '</tr>';
    [['A', a], ['B', b]].forEach(function (row) {
      h += '<tr><th>' + row[0] + '</th>';
      row[1].forEach(function (x) { h += '<td class="' + (x ? 'p' : '') + '">' + x + '</td>'; });
      h += '</tr>';
    });
    h += '</table>';
    document.getElementById('bTable').innerHTML = h;
    document.getElementById('bRes').textContent = (na === 0 || nb === 0)
      ? 'Cosine similarity: undefined, because one sentence has no words from the vocabulary.'
      : 'Cosine similarity: ' + (dot / (Math.sqrt(na) * Math.sqrt(nb))).toFixed(3);
  }
  bA.addEventListener('input', renderB); bB.addEventListener('input', renderB);
  renderB();
})();
