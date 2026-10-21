(() => {
  const root = document.documentElement;
  const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const load = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* ---------- Language + theme toggles ---------- */
  let lang = load('lang') === 'en' ? 'en' : 'es';
  const langBtn = document.getElementById('langBtn');
  const themeBtn = document.getElementById('themeBtn');
  const metaDesc = document.querySelector('meta[name="description"]');
  metaDesc.dataset.contentEs = metaDesc.getAttribute('content');

  function labelTheme(){
    const en = lang === 'en', dark = root.dataset.theme === 'dark';
    const txt = dark ? (en ? 'light' : 'claro') : (en ? 'dark' : 'oscuro');
    // mobile hides .theme-txt and shows only the icon, so the label goes to aria-label too
    themeBtn.querySelector('.theme-ico').textContent = dark ? '☀' : '☾';
    themeBtn.querySelector('.theme-txt').textContent = ' ' + txt;
    themeBtn.setAttribute('aria-label', txt);
  }

  function applyLang(){
    const en = lang === 'en';
    root.lang = en ? 'en' : 'es-AR';
    langBtn.querySelector('.lang-cur').textContent = en ? 'EN' : 'ES';
    langBtn.querySelector('.lang-next').textContent = en ? ' → ES' : ' → EN';
    langBtn.setAttribute('aria-label', en ? 'Cambiar a español' : 'Switch to English');
    metaDesc.setAttribute('content', en ? metaDesc.dataset.contentEn : metaDesc.dataset.contentEs);
    document.querySelectorAll('[data-alt-en]').forEach(el => {
      if (!el.dataset.altEs) el.dataset.altEs = el.alt;
      el.alt = en ? el.dataset.altEn : el.dataset.altEs;
    });
    // data-en values are authored markup, so swap innerHTML
    document.querySelectorAll('[data-en]').forEach(el => {
      if (!el.dataset.es) el.dataset.es = el.innerHTML;
      el.innerHTML = en ? el.dataset.en : el.dataset.es;
    });
    labelTheme();
  }

  langBtn.addEventListener('click', () => {
    lang = lang === 'en' ? 'es' : 'en';
    store('lang', lang);
    applyLang();
  });
  themeBtn.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    if (dark) root.dataset.theme = 'dark'; else delete root.dataset.theme;
    store('theme', dark ? 'dark' : 'light');
    labelTheme();
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

  /* ---------- Lightbox (native <dialog>: Esc closes it for free) ---------- */
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  document.querySelectorAll('.shot').forEach(btn => btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lb.showModal();
  }));
  lb.addEventListener('click', () => lb.close());

  applyLang();
  onScroll();
})();
