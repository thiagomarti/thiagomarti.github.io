(() => {
  const root = document.documentElement;
  const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const load = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* ---------- Language toggle ---------- */
  let lang = load('lang') === 'en' ? 'en' : 'es';
  const langBtn = document.getElementById('langBtn');
  const metaDesc = document.querySelector('meta[name="description"]');
  metaDesc.dataset.contentEs = metaDesc.getAttribute('content');

  function applyLang(){
    const en = lang === 'en';
    root.lang = en ? 'en' : 'es-AR';
    langBtn.querySelector('.lang-cur').className = `flag ${en ? 'us' : 'ar'} lang-cur`;
    langBtn.querySelector('.lang-next').className = `flag ${en ? 'ar' : 'us'} lang-next`;
    langBtn.setAttribute('aria-label', en ? 'Cambiar a español' : 'Switch to English');
    metaDesc.setAttribute('content', en ? metaDesc.dataset.contentEn : metaDesc.dataset.contentEs);
    document.querySelectorAll('[data-aria-en]').forEach(el => {
      if (!el.dataset.ariaEs) el.dataset.ariaEs = el.getAttribute('aria-label');
      el.setAttribute('aria-label', en ? el.dataset.ariaEn : el.dataset.ariaEs);
    });
    document.querySelectorAll('[data-alt-en]').forEach(el => {
      if (!el.dataset.altEs) el.dataset.altEs = el.alt;
      el.alt = en ? el.dataset.altEn : el.dataset.altEs;
    });
    // data-en values are authored markup, so swap innerHTML
    document.querySelectorAll('[data-en]').forEach(el => {
      if (!el.dataset.es) el.dataset.es = el.innerHTML;
      el.innerHTML = en ? el.dataset.en : el.dataset.es;
    });
  }

  langBtn.addEventListener('click', () => {
    lang = lang === 'en' ? 'es' : 'en';
    store('lang', lang);
    applyLang();
  });

  /* ---------- Reading progress bar ---------- */
  const prog = document.getElementById('prog');
  const onScroll = () => {
    const max = root.scrollHeight - root.clientHeight;
    prog.style.transform = `scaleX(${max > 0 ? root.scrollTop / max : 0})`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Scroll reveal ---------- */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
    root.classList.add('js');
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');
      io.unobserve(el);
      // drop the reveal styles once done so each element's own hover transform works again
      el.addEventListener('transitionend', () => {
        el.classList.remove('reveal', 'in');
        el.style.transitionDelay = '';
      }, { once: true });
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
  }

  /* ---------- Tab bar: highlight the section in view ---------- */
  const tabs = [...document.querySelectorAll('.tabbar a')];
  const spy = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    tabs.forEach(t => t.classList.toggle('on', t.dataset.tab.split(' ').includes(e.target.id)));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['top', 'a-hist', 'a-skills', 'a-work', 'a-contact'].forEach(id => spy.observe(document.getElementById(id)));

  /* ---------- Desktop / mobile switch on website cases ---------- */
  document.querySelectorAll('.view-toggle').forEach(toggle => {
    const group = toggle.closest('.group');
    toggle.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      toggle.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === btn));
      group.querySelectorAll('.gallery').forEach(g => {
        g.hidden = g.dataset.view !== btn.dataset.view;
        g.classList.remove('swap');
        if (!g.hidden){ void g.offsetWidth; g.classList.add('swap'); g.scrollLeft = 0; }
      });
    });
  });

  /* ---------- Lightbox (native <dialog>: Esc closes it for free) ---------- */
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const prev = lb.querySelector('.lb-prev');
  const next = lb.querySelector('.lb-next');
  let set = [], at = 0;
  const show = i => {
    at = (i + set.length) % set.length; // wraps around
    lbImg.src = set[at].src;
    lbImg.alt = set[at].alt;
  };
  // browse within the gallery the shot came from
  document.querySelectorAll('.shot').forEach(btn => btn.addEventListener('click', () => {
    set = [...btn.closest('.gallery').querySelectorAll('.shot img')];
    show(set.indexOf(btn.querySelector('img')));
    lb.showModal();
  }));
  prev.addEventListener('click', e => { e.stopPropagation(); show(at - 1); });
  next.addEventListener('click', e => { e.stopPropagation(); show(at + 1); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(at - 1);
    if (e.key === 'ArrowRight') show(at + 1);
  });
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1));
  });
  lb.addEventListener('click', () => lb.close());

  applyLang();
  onScroll();
})();
