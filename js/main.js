(() => {
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const navToggle = document.getElementById('navToggle');
  const navDrawer = document.getElementById('navDrawer');
  navToggle.addEventListener('click', () => {
    const open = navDrawer.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navDrawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navDrawer.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  const radar = document.getElementById('radar');
  if (radar) {
    const cities = radar.querySelectorAll('.radar-city');
    const radarIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cities.forEach(city => {
            const delay = Number(city.dataset.delay || 0);
            setTimeout(() => city.classList.add('is-visible'), delay);
          });
          radarIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    radarIO.observe(radar);
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#catalogGrid .feed-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });
})();
