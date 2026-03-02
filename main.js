/**
 * Corporate Template - Modern JS
 * JSON-driven rendering + rich scroll animations
 */

(async function () {
  'use strict';

  const [config, content] = await Promise.all([
    fetch('config.json').then(r => r.json()),
    fetch('content.json').then(r => r.json())
  ]);

  applyTheme(config.theme);
  renderHeader(config);
  renderHero(config, content.hero);
  renderNews(content.news);
  renderMessage(content.message);
  renderService(content.service);
  renderPhoto(content.photo);
  renderAccess(content.access);
  renderFooter(config);
  initAnimations();
  initInteractions();

  // ==========================================
  // Theme → CSS Variables
  // ==========================================
  function applyTheme(theme) {
    const root = document.documentElement;
    if (!theme) return;
    const map = {
      primaryColor: '--primary',
      primaryLight: '--primary-light',
      accentColor: '--accent',
      textColor: '--text',
      textLight: '--text-light',
      bgColor: '--bg',
      bgLight: '--bg-warm',
      bgDark: '--bg-dark',
      headerBg: '--header-bg',
      fontFamily: '--font-ja',
      fontFamilyEn: '--font-en',
      borderRadius: '--radius'
    };
    Object.entries(map).forEach(([key, cssVar]) => {
      if (theme[key]) root.style.setProperty(cssVar, theme[key]);
    });
    document.getElementById('siteTitle').textContent = config.site.title || '';
  }

  // ==========================================
  // Header
  // ==========================================
  function renderHeader(cfg) {
    const { site, nav } = cfg;
    document.querySelector('.header__logo-text').textContent = site.title;
    document.getElementById('phoneNumber').textContent = site.phone;
    document.getElementById('headerPhone').href = `tel:${site.phone.replace(/-/g, '')}`;
    document.getElementById('headerCta').href = site.contactUrl;
    document.getElementById('sideCta').href = site.contactUrl;

    if (site.recruitUrl) {
      document.getElementById('navRecruit').href = site.recruitUrl;
    }

    const navList = document.getElementById('navList');
    nav.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${item.href}">${item.label}</a>`;
      navList.appendChild(li);
    });

    // Footer logo
    document.getElementById('footerLogo').textContent = site.title;
  }

  // ==========================================
  // Hero
  // ==========================================
  function renderHero(cfg, hero) {
    document.getElementById('heroTagline').textContent = cfg.site.tagline;
    document.getElementById('heroCta').href = cfg.site.contactUrl;
    if (hero.image) {
      document.getElementById('heroImage').src = hero.image;
    }

    // Hero background image (parallax)
    const heroBg = document.querySelector('.hero__bg');
    const bgImage = cfg.theme.heroBackground;
    if (bgImage) {
      heroBg.classList.add('has-image');
      heroBg.style.backgroundImage = `url(${bgImage})`;
    }
  }

  // ==========================================
  // News
  // ==========================================
  function renderNews(news) {
    document.getElementById('newsTitleEn').textContent = news.titleEn;
    document.getElementById('newsTitleJa').textContent = news.titleJa;
    document.getElementById('newsMore').href = news.listUrl;

    const list = document.getElementById('newsList');
    list.setAttribute('data-stagger', '');
    news.items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'news__item';
      div.innerHTML = `
        <span class="news__date">${item.date}</span>
        <div class="news__item-title"><a href="${item.url}">${item.title}</a></div>
        <svg class="news__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      `;
      div.addEventListener('click', () => { if (item.url) window.location.href = item.url; });
      list.appendChild(div);
    });
  }

  // ==========================================
  // Message
  // ==========================================
  function renderMessage(msg) {
    document.getElementById('messageTitleEn').textContent = msg.titleEn;
    document.getElementById('messageTitleJa').textContent = msg.titleJa;
    document.getElementById('messageImage').src = msg.image;
    document.getElementById('messageHeading').textContent = msg.heading;

    const bodyEl = document.getElementById('messageBody');
    msg.body.split('\n').forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      bodyEl.appendChild(p);
    });

    const valuesEl = document.getElementById('messageValues');
    valuesEl.setAttribute('data-stagger', '');
    msg.values.forEach(v => {
      const card = document.createElement('div');
      card.className = 'message__value-card';
      card.innerHTML = `
        <h4>${v.titleEn}</h4>
        <p class="value-ja">${v.titleJa}</p>
        <p class="value-catch">${v.catch}</p>
        <p class="value-body">${v.body}</p>
      `;
      valuesEl.appendChild(card);
    });

    const btnsEl = document.getElementById('messageButtons');
    msg.buttons.forEach(btn => {
      const a = document.createElement('a');
      a.className = 'message__btn';
      a.href = btn.url;
      a.textContent = btn.label;
      btnsEl.appendChild(a);
    });
  }

  // ==========================================
  // Service
  // ==========================================
  function renderService(svc) {
    document.getElementById('serviceTitleEn').textContent = svc.titleEn;
    document.getElementById('serviceTitleJa').textContent = svc.titleJa;

    const grid = document.getElementById('serviceGrid');
    grid.setAttribute('data-stagger', '');
    svc.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'service__card';
      card.innerHTML = `
        <div class="service__card-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="service__card-body">
          <h3 class="service__card-title">${item.title}</h3>
          <p class="service__card-text">${item.body}</p>
          <a href="${item.url}" class="service__card-link">
            <span>${item.linkText}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // ==========================================
  // Photo
  // ==========================================
  function renderPhoto(photo) {
    document.getElementById('photoTitleEn').textContent = photo.titleEn;
    document.getElementById('photoTitleJa').textContent = photo.titleJa;

    const grid = document.getElementById('photoGrid');
    grid.setAttribute('data-stagger', '');
    photo.images.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'photo__item';
      div.innerHTML = `<img src="${src}" alt="職場風景${i + 1}" loading="lazy">`;
      grid.appendChild(div);
    });
  }

  // ==========================================
  // Access
  // ==========================================
  function renderAccess(acc) {
    document.getElementById('accessTitleEn').textContent = acc.titleEn;
    document.getElementById('accessTitleJa').textContent = acc.titleJa;

    const mainContainer = document.getElementById('accessMain');
    const branchContainer = document.getElementById('accessOffices');
    branchContainer.setAttribute('data-stagger', '');

    acc.offices.forEach(office => {
      if (office.isMain) {
        // Main office - large card with big map
        const div = document.createElement('div');
        div.className = 'access__office-main';
        div.setAttribute('data-anim', '');
        let html = `<div class="access__office-info">
          <h3>${office.name}</h3>
          <p class="access__office-address">${office.address}</p>
        </div>`;
        if (office.mapEmbed) {
          html += `<div class="access__map-embed">
            <iframe src="${office.mapEmbed}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>`;
        }
        div.innerHTML = html;
        mainContainer.appendChild(div);
      } else {
        // Branch offices - compact cards with smaller maps
        const div = document.createElement('div');
        div.className = 'access__office';
        let html = `<div class="access__office-info">
          <h3>${office.name}</h3>
          <p class="access__office-address">${office.address}</p>`;
        if (office.mapUrl) {
          html += `<a href="${office.mapUrl}" target="_blank" rel="noopener" class="access__office-maplink">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Google Mapで開く</span>
          </a>`;
        }
        html += `</div>`;
        if (office.mapEmbed) {
          html += `<div class="access__map-embed">
            <iframe src="${office.mapEmbed}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>`;
        }
        div.innerHTML = html;
        branchContainer.appendChild(div);
      }
    });

    const noteEl = document.getElementById('accessNote');
    noteEl.innerHTML = acc.note.replace(/\n/g, '<br>');
  }

  // ==========================================
  // Footer
  // ==========================================
  function renderFooter(cfg) {
    const linksEl = document.getElementById('footerLinks');
    cfg.footer.links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.label;
      linksEl.appendChild(a);
    });
    document.getElementById('footerCopyright').textContent = cfg.site.copyright;
  }

  // ==========================================
  // Scroll Animations
  // ==========================================
  function initAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-anim], [data-stagger]').forEach(el => {
      observer.observe(el);
    });
  }

  // ==========================================
  // Interactions
  // ==========================================
  function initInteractions() {
    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('headerNav');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('is-open');
      document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
    });

    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        hamburger.classList.remove('active');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });

    // Header scroll state
    const header = document.getElementById('header');
    const sideCta = document.getElementById('sideCta');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Header background
          if (scrollY > 60) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }

          // Side CTA visibility
          if (scrollY > 500) {
            sideCta.classList.add('is-visible');
          } else {
            sideCta.classList.remove('is-visible');
          }

          ticking = false;
        });
        ticking = true;
      }
    });

    // Parallax on hero decorations
    window.addEventListener('mousemove', (e) => {
      const deco1 = document.querySelector('.hero__image-deco');
      const deco2 = document.querySelector('.hero__image-deco2');
      if (!deco1 || !deco2) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      deco1.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
      deco2.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
    });
  }

})();
