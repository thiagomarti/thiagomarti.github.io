(() => {
  const main = document.getElementById('main');
  const allSections = Array.from(document.querySelectorAll('.section'));

  /* ---------- Persona orders ---------- */
  const orders = {
    default:    ['sec-hero','sec-about','sec-stats','sec-experience','sec-stack','sec-craft','sec-unlock','sec-education','sec-contact'],
    reclutador: ['sec-hero','sec-stats','sec-experience','sec-education','sec-unlock','sec-about','sec-stack','sec-craft','sec-contact'],
    developer:  ['sec-hero','sec-stack','sec-craft','sec-experience','sec-stats','sec-unlock','sec-about','sec-education','sec-contact'],
    curioso:    ['sec-hero','sec-about','sec-experience','sec-unlock','sec-craft','sec-stats','sec-stack','sec-education','sec-contact'],
  };

  function applyOrder(order){
    order.forEach(id => {
      const el = document.getElementById(id);
      if (el) main.appendChild(el);
    });
    buildRail();
  }

  function applyPersonaText(persona){
    document.querySelectorAll('[data-persona-text]').forEach(el => {
      const val = el.getAttribute(`data-${persona}`);
      if (val) el.textContent = val;
    });
  }

  /* ---------- Persona chooser ---------- */
  const cards = document.querySelectorAll('.persona-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const persona = card.dataset.persona;
      applyPersonaText(persona);
      applyOrder(orders[persona] || orders.default);
      setTimeout(() => {
        document.getElementById('sec-about') && window.scrollTo({
          top: main.children[1].offsetTop - 20,
          behavior: 'smooth'
        });
      }, 80);
    });
  });

  document.getElementById('skipChooser').addEventListener('click', () => {
    applyOrder(orders.default);
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  });

  /* ---------- Scroll hint on hero ---------- */
  const scrollHint = document.getElementById('scrollHint');
  setTimeout(() => scrollHint.classList.add('visible'), 900);
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) scrollHint.classList.remove('visible');
    else scrollHint.classList.add('visible');
  });

  /* ---------- Rail (progress spine) ---------- */
  const rail = document.getElementById('rail');
  const railNodes = document.getElementById('railNodes');
  const railFill = document.getElementById('railFill');
  let observedSections = [];

  function buildRail(){
    railNodes.innerHTML = '';
    const order = Array.from(main.children).filter(el => el.classList.contains('section'));
    const usable = order.filter(el => el.id !== 'sec-hero');
    const total = usable.length;
    usable.forEach((el, i) => {
      const li = document.createElement('li');
      li.className = 'rail-node';
      li.dataset.target = el.id;
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');
      li.setAttribute('aria-label', `Ir a ${el.dataset.title || el.id}`);
      const pct = total > 1 ? i / (total - 1) : 0;
      li.style.top = `calc(40px + (100% - 80px) * ${pct})`;
      const label = document.createElement('span');
      label.className = 'rail-node-label';
      label.textContent = el.dataset.title || el.id;
      li.appendChild(label);
      const goTo = () => el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      li.addEventListener('click', goTo);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          goTo();
        }
      });
      railNodes.appendChild(li);
    });
    observedSections = usable;
    setupObserver();
  }

  let io;
  function setupObserver(){
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const idx = observedSections.findIndex(s => s.id === entry.target.id);
        const node = railNodes.children[idx];
        if (!node) return;
        if (entry.isIntersecting){
          Array.from(railNodes.children).forEach(n => n.classList.remove('current'));
          node.classList.add('current');
          Array.from(railNodes.children).forEach((n, i) => {
            n.classList.toggle('done', i <= idx);
          });
          const pct = observedSections.length > 1 ? idx / (observedSections.length - 1) : 0;
          railFill.style.height = `calc((100% - 80px) * ${pct})`;
        }
      });
    }, { threshold: 0.35, rootMargin: '-10% 0px -10% 0px' });
    observedSections.forEach(s => io.observe(s));
  }

  window.addEventListener('scroll', () => {
    rail.classList.toggle('active', window.scrollY > window.innerHeight * 0.6);
  });

  /* ---------- Experience card toggles ---------- */
  document.querySelectorAll('[data-exp]').forEach(card => {
    const head = card.querySelector('.exp-head');
    const toggle = () => {
      const open = card.classList.toggle('open');
      head.setAttribute('aria-expanded', open);
    };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.done) return;
      el.dataset.done = '1';
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 900;
      const start = performance.now();
      function tick(now){
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterIO.observe(c));

  /* ---------- Phone mock assembly ---------- */
  const phoneMock = document.getElementById('phoneMock');
  const craftReplay = document.getElementById('craftReplay');

  function playAssembly(){
    phoneMock.classList.remove('assembled');
    // two rAFs guarantee the browser paints the "reset" frame before
    // re-adding the class, otherwise the transitions/animations never restart
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        phoneMock.classList.add('assembled');
      });
    });
  }

  const phoneIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        playAssembly();
        phoneIO.unobserve(phoneMock);
      }
    });
  }, { threshold: 0.4 });
  phoneIO.observe(phoneMock);

  craftReplay.addEventListener('click', playAssembly);

  /* ---------- Unlock reveal ---------- */
  const unlockLock = document.getElementById('unlockLock');
  const unlockContent = document.getElementById('unlockContent');
  const unlockIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        unlockLock.classList.add('opened');
        unlockContent.classList.add('revealed');
        unlockIO.disconnect();
      }
    });
  }, { threshold: 0.5 });
  unlockIO.observe(document.getElementById('unlockCard'));

  /* ---------- Init ---------- */
  buildRail();
})();
