(() => {
  // ---------- Icons ----------

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    io.observe(el);
  });

  // ---------- Count-up ----------
  const num = document.querySelector('[data-count]');
  if (num) {
    const target = +num.dataset.count;
    const cio = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let n = 0; num.textContent = 0;
      const t = setInterval(() => { n++; num.textContent = n; if (n >= target) clearInterval(t); }, 120);
      cio.disconnect();
    }, { threshold: 0.5 });
    cio.observe(num);
  }

  // ---------- Leitfaden ----------
  const phases = [
    { t: 'Einstieg', goal: 'Begrüßung, Ablauf erklären und Einverständnis zur Aufzeichnung einholen.' },
    { t: 'Warm-up', goal: 'Eine entspannte Gesprächsatmosphäre schaffen und ins Erzählen kommen.' },
    { t: 'Biografischer Hintergrund', goal: 'Den persönlichen Weg ins BWL-Studium und den Studienkontext verstehen.' },
    { t: 'Leistungs­erfahrungen', goal: 'Erlebnisse mit Prüfungen, Noten und Leistungsdruck erzählen lassen.' },
    { t: 'Konkurrenz­wahrnehmung', goal: 'Situationen, in denen Konkurrenz spürbar wird – ohne die Forschungsfrage direkt zu stellen.', key: true },
    { t: 'Persönliche Reflexion', goal: 'Bedeutung und Umgang mit Konkurrenz aus eigener Sicht einordnen.' },
    { t: 'Abschluss', goal: 'Offene Punkte sammeln, bedanken und das Gespräch abrunden.' },
  ];
  const tl = document.getElementById('timeline');
  const detail = document.getElementById('phaseDetail');
  phases.forEach((p, i) => {
    const b = document.createElement('button');
    b.className = 'phase' + (p.key ? ' key' : '');
    b.setAttribute('role', 'tab');
    b.innerHTML = `<span class="n">${i + 1}</span><span class="t">${p.t}</span>`;
    b.addEventListener('click', () => selectPhase(i));
    tl.appendChild(b);
  });
  function selectPhase(i) {
    [...tl.children].forEach((c, j) => {
      c.classList.toggle('active', j === i);
      c.setAttribute('aria-selected', j === i);
    });
    const p = phases[i];
    detail.innerHTML = `
      <div>
        <h4>Phase ${i + 1} · ${p.t.replace('­', '')}</h4>
        <p>${p.goal}</p>
        <p style="margin-top:12px">Die Forschungsfrage wird nie direkt gestellt. Offene Erzählfragen lassen Erfahrungen und Deutungen der Befragten im Mittelpunkt stehen.</p>
      </div>
      <div>
        <h4>Typische Nachfragen</h4>
        <div class="prompt">„Kannst du dafür ein Beispiel nennen?“</div>
        <div class="prompt">„Wie hast du dich dabei gefühlt?“</div>
      </div>`;
  }
  selectPhase(4);

  // ---------- Theorie-Modell ----------
  const wett = document.getElementById('wett');
  const sup = document.getElementById('sup');
  const feel = document.getElementById('feel');
  const feelVal = document.getElementById('feelVal');
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  function updateModel() {
    const W = +wett.value, S = +sup.value;
    document.getElementById('wettOut').textContent = W;
    document.getElementById('supOut').textContent = S;
    const v = Math.max(0, Math.min(100, 50 + 0.65 * (W - 50) - 0.55 * (S - 50)));
    const size = 120 + v * 1.4;
    const [r, g, b] = mix([42, 157, 143], [232, 85, 59], v / 100);
    feel.style.width = feel.style.height = size + 'px';
    feel.style.background = `rgb(${r},${g},${b})`;
    feel.style.boxShadow = `0 0 0 ${8 + v / 6}px rgba(${r},${g},${b},.18)`;
    feel.style.fontSize = (0.85 + v / 250) + 'rem';
    feelVal.textContent = v < 33 ? 'gering' : v < 66 ? 'spürbar' : 'stark';
  }
  wett.addEventListener('input', updateModel);
  sup.addEventListener('input', updateModel);
  updateModel();

  // ---------- Selbstcheck ----------
  const items = [
    { a: 'w', q: 'Bei Praktikumsplätzen will ich unbedingt die besseren Stellen bekommen.' },
    { a: 's', q: 'In meiner Lerngruppe teilen wir Unterlagen und Tipps ganz selbstverständlich.' },
    { a: 'w', q: 'Ich vergleiche meine Noten regelmäßig mit denen anderer.' },
    { a: 's', q: 'Es gibt Kommilitonen, denen ich im Studium wirklich vertraue.' },
    { a: 'w', q: 'Ich sehe Kommilitonen oft als Mitbewerber um begrenzte Chancen.' },
    { a: 's', q: 'Wir lernen eher miteinander als gegeneinander.' },
  ];
  const form = document.getElementById('quiz');
  form.innerHTML = items.map((it, i) => `
    <fieldset class="item" style="border:none">
      <p>${i + 1}. ${it.q}</p>
      <div class="scale">
        ${[1, 2, 3, 4, 5].map((v) => `<label><input type="radio" name="q${i}" value="${v}" aria-label="${v}"><span>${v}</span></label>`).join('')}
      </div>
      <div class="scale-legend"><span>trifft nicht zu</span><span>trifft voll zu</span></div>
    </fieldset>`).join('');

  const results = {
    tr: ['Teamplayer mit Ehrgeiz', 'Du willst vorne mitspielen – hast aber ein starkes Netz. Genau das Zusammenspiel, das unsere Annahme beschreibt: Wettbewerb wird durch Rückhalt abgefedert.'],
    tl: ['Gelassen kooperativ', 'Konkurrenz spielt für dich eine kleine Rolle, Zusammenarbeit eine große. So beschreiben viele Befragte ihren Freundes- und Lerngruppenkreis.'],
    bl: ['Unberührt', 'Weder Wettbewerb noch Gruppe prägen deinen Alltag stark. Wie bei einigen Befragten bleibt Konkurrenz für dich eher am Rand.'],
    br: ['Einzelkämpfer', 'Hoher Wettbewerbsfokus bei wenig Rückhalt – laut unserer vorläufigen Theorie die Konstellation, in der Konkurrenz am stärksten empfunden wird.'],
  };
  const me = document.getElementById('me');
  const resTitle = document.getElementById('resTitle');
  const resText = document.getElementById('resText');
  const resultBox = document.getElementById('result');

  function evaluate() {
    const vals = items.map((_, i) => form.querySelector(`input[name=q${i}]:checked`));
    const done = vals.filter(Boolean).length;
    if (done < items.length) {
      resTitle.textContent = `${done} von ${items.length} beantwortet`;
      resText.textContent = 'Dein Punkt erscheint im Kompass, sobald du alle Aussagen bewertet hast.';
      me.classList.remove('show');
      return;
    }
    const avg = (axis) => {
      const xs = items.map((it, i) => (it.a === axis ? +vals[i].value : null)).filter((v) => v !== null);
      return (xs.reduce((a, b) => a + b, 0) / xs.length - 1) / 4; // 0..1
    };
    const w = avg('w'), s = avg('s');
    me.style.left = (8 + w * 84) + '%';
    me.style.top = (92 - s * 84) + '%';
    me.classList.add('show');
    const key = (s >= 0.5 ? 't' : 'b') + (w >= 0.5 ? 'r' : 'l');
    resTitle.textContent = results[key][0];
    resText.textContent = results[key][1];
    if (!resultBox.querySelector('.reset')) {
      const btn = document.createElement('button');
      btn.className = 'reset'; btn.type = 'button'; btn.textContent = 'Nochmal';
      btn.addEventListener('click', () => { form.reset(); evaluate(); form.scrollIntoView({ behavior: 'smooth' }); btn.remove(); });
      resultBox.appendChild(btn);
    }
  }
  form.addEventListener('change', evaluate);
})();
