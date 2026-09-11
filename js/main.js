(() => {
  /* ---------- consentimento de cookies (Google Analytics) ----------
     GA só é carregado depois que a pessoa aceita o aviso; a escolha
     fica salva no localStorage pra não perguntar de novo. */
  const GA_ID = 'G-HZSSQKC5LS';
  const CONSENT_KEY = 'fg-cookie-consent';
  const loadGA = () => {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  };
  try {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      loadGA();
    } else if (consent !== 'declined') {
      const banner = document.getElementById('cookieBanner');
      if (banner) {
        banner.hidden = false;
        document.getElementById('cookieAccept')?.addEventListener('click', () => {
          try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch (e) {}
          banner.hidden = true;
          loadGA();
        });
        document.getElementById('cookieDecline')?.addEventListener('click', () => {
          try { localStorage.setItem(CONSENT_KEY, 'declined'); } catch (e) {}
          banner.hidden = true;
        });
      }
    }
  } catch (e) {
    // localStorage indisponível (modo privado etc.): não bloqueia o resto do site.
  }

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

  /* ---------- contador de visitas: contagem real vinda de /api/visits,
     mostrador estilo LED com dígitos rolando (odômetro) ---------- */
  const visitCounter = document.querySelector('[data-visit-counter]');
  const visitDigits = document.querySelector('[data-visit-counter-digits]');
  if (visitCounter && visitDigits) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const buildOdometer = (numberStr) => {
      visitDigits.innerHTML = '';
      const columns = [];
      for (const ch of numberStr) {
        if (ch < '0' || ch > '9') {
          const staticEl = document.createElement('span');
          staticEl.className = 'odometer-col is-static';
          staticEl.textContent = ch;
          visitDigits.appendChild(staticEl);
          continue;
        }
        const col = document.createElement('span');
        col.className = 'odometer-col';
        const strip = document.createElement('span');
        strip.className = 'odometer-strip';
        for (let d = 0; d <= 9; d++) {
          const digitSpan = document.createElement('span');
          digitSpan.textContent = String(d);
          strip.appendChild(digitSpan);
        }
        col.appendChild(strip);
        visitDigits.appendChild(col);
        columns.push({ strip, target: Number(ch) });
      }
      return columns;
    };

    fetch('/api/visits', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('bad response');
        return res.json();
      })
      .then((data) => {
        const value = data && typeof data.value === 'number' ? data.value : null;
        if (value === null) throw new Error('no value');

        const columns = buildOdometer(value.toLocaleString('pt-BR'));
        visitCounter.classList.add('is-visible');

        if (typeof window.anime === 'function' && !prefersReducedMotion) {
          columns.forEach(({ strip, target }, i) => {
            window.anime({
              targets: strip,
              translateY: ['0%', `-${target * 10}%`],
              duration: 900,
              delay: 200 + i * 90,
              easing: 'easeOutExpo',
            });
          });
        } else {
          columns.forEach(({ strip, target }) => {
            strip.style.transform = `translateY(-${target * 10}%)`;
          });
        }
      })
      .catch(() => {
        // Serviço de contagem indisponível: esconde o contador em vez de mostrar número falso ou travado.
        visitCounter.remove();
      });
  }

  const reviewsTrack = document.getElementById('reviewsTrack');
  if (reviewsTrack) {
    const cards = Array.from(reviewsTrack.querySelectorAll('.review-card'));
    const prevBtn = document.getElementById('reviewsPrev');
    const nextBtn = document.getElementById('reviewsNext');
    const dotsWrap = document.getElementById('reviewsDots');

    const dots = cards.map((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'reviews-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ir para avaliação ${i + 1}`);
      dot.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
      return dot;
    });
    if (dots.length) dots[0].classList.add('is-active');

    const setActiveDot = (index) => {
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    };

    const updateActiveDotFromScroll = () => {
      const pos = reviewsTrack.scrollLeft;
      let closest = 0;
      let closestGap = Infinity;
      cards.forEach((card, i) => {
        const gap = Math.abs(card.offsetLeft - reviewsTrack.offsetLeft - pos);
        if (gap < closestGap) {
          closestGap = gap;
          closest = i;
        }
      });
      setActiveDot(closest);
    };

    const scrollByCard = (dir) => {
      const card = cards[0];
      const gap = 20;
      const amount = (card.getBoundingClientRect().width + gap) * dir;
      reviewsTrack.scrollBy({ left: amount, behavior: 'smooth' });
    };
    if (prevBtn) prevBtn.addEventListener('click', () => scrollByCard(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => scrollByCard(1));

    const updateArrows = () => {
      if (!prevBtn || !nextBtn) return;
      const max = reviewsTrack.scrollWidth - reviewsTrack.clientWidth - 4;
      prevBtn.disabled = reviewsTrack.scrollLeft <= 4;
      nextBtn.disabled = reviewsTrack.scrollLeft >= max;
    };
    const onReviewsScroll = () => {
      updateArrows();
      updateActiveDotFromScroll();
    };
    reviewsTrack.addEventListener('scroll', onReviewsScroll, { passive: true });
    window.addEventListener('resize', updateActiveDotFromScroll, { passive: true });
    updateArrows();
    updateActiveDotFromScroll();
  }
})();
