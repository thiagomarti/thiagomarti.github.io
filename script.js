(() => {
  /* ---------- Language toggle ---------- */
  let lang = localStorage.getItem('lang') === 'en' ? 'en' : 'es';
  const langToggle = document.getElementById('langToggle');
  const metaDesc = document.querySelector('meta[name="description"]');
  metaDesc.dataset.contentEs = metaDesc.getAttribute('content');

  function applyLang(){
    const en = lang === 'en';
    document.documentElement.lang = en ? 'en' : 'es-AR';
    langToggle.setAttribute('aria-label', en ? 'Cambiar a español' : 'Switch to English');
    metaDesc.setAttribute('content', en ? metaDesc.dataset.contentEn : metaDesc.dataset.contentEs);

    document.querySelectorAll('[data-aria-en]').forEach(el => {
      if (!el.dataset.ariaEs) el.dataset.ariaEs = el.getAttribute('aria-label');
      el.setAttribute('aria-label', en ? el.dataset.ariaEn : el.dataset.ariaEs);
    });
    document.querySelectorAll('[data-alt-en]').forEach(el => {
      if (!el.dataset.altEs) el.dataset.altEs = el.alt;
      el.alt = en ? el.dataset.altEn : el.dataset.altEs;
    });
    document.querySelectorAll('[data-en]').forEach(el => {
      if (!el.dataset.es) el.dataset.es = el.innerHTML;
      el.innerHTML = en ? el.dataset.en : el.dataset.es;
    });
  }

  langToggle.addEventListener('click', () => {
    lang = lang === 'en' ? 'es' : 'en';
    localStorage.setItem('lang', lang);
    applyLang();
  });

  applyLang();
})();
