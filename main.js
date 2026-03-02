/**
 * Corporate Template - Main JS
 * JSON設定ファイルからサイトを動的に構築
 */

(async function() {
  'use strict';

  // ========== JSON読み込み ==========
  const [config, content] = await Promise.all([
    fetch('config.json').then(r => r.json()),
    fetch('content.json').then(r => r.json())
  ]);

  // ========== テーマ適用 ==========
  applyTheme(config.theme);

  // ========== 各セクション描画 ==========
  renderHeader(config);
  renderHero(config, content.hero);
  renderNews(content.news);
  renderMessage(content.message);
  renderService(content.service);
  renderPhoto(content.photo);
  renderAccess(content.access);
  renderFooter(config);
  initInteractions();

  // ==========================================
  // テーマをCSS変数に適用
  // ==========================================
  function applyTheme(theme) {
    const root = document.documentElement;
    if (!theme) return;
    const mapping = {
      primaryColor: '--primary',
      primaryLight: '--primary-light',
      accentColor: '--accent',
      textColor: '--text',
      textLight: '--text-light',
      bgColor: '--bg',
      bgLight: '--bg-light',
      bgDark: '--bg-dark',
      headerBg: '--header-bg',
      fontFamily: '--font-ja',
      fontFamilyEn: '--font-en',
      borderRadius: '--radius'
    };
    Object.entries(mapping).forEach(([key, cssVar]) => {
      if (theme[key]) {
        root.style.setProperty(cssVar, theme[key]);
      }
    });

    // タイトル
    document.getElementById('siteTitle').textContent = config.site.title || '';
  }

  // ==========================================
  // ヘッダー
  // ==========================================
  function renderHeader(cfg) {
    const { site, nav } = cfg;

    document.getElementById('headerLogo').textContent = site.title;
    document.getElementById('phoneNumber').textContent = site.phone;
    document.getElementById('headerPhone').href = `tel:${site.phone.replace(/-/g, '')}`;
    document.getElementById('headerCta').href = site.contactUrl;
    document.getElementById('heroContact').href = site.contactUrl;

    if (site.recruitUrl) {
      document.getElementById('navRecruit').href = site.recruitUrl;
    }

    // ナビゲーション
    const navList = document.getElementById('navList');
    nav.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${item.href}">${item.label}</a>`;
      navList.appendChild(li);
    });
  }

  // ==========================================
  // ヒーロー
  // ==========================================
  function renderHero(cfg, hero) {
    document.getElementById('heroTagline').textContent = cfg.site.tagline;
    if (hero.image) {
      document.getElementById('heroImage').src = hero.image;
    }
  }

  // ==========================================
  // NEWS
  // ==========================================
  function renderNews(news) {
    document.getElementById('newsTitleEn').textContent = news.titleEn;
    document.getElementById('newsTitleJa').textContent = news.titleJa;
    document.getElementById('newsMore').href = news.listUrl;

    const list = document.getElementById('newsList');
    news.items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'news__item';
      div.innerHTML = `
        <dt class="news__date">${item.date}</dt>
        <dd class="news__item-title"><a href="${item.url}">${item.title}</a></dd>
      `;
      list.appendChild(div);
    });
  }

  // ==========================================
  // MESSAGE
  // ==========================================
  function renderMessage(msg) {
    document.getElementById('messageTitleEn').textContent = msg.titleEn;
    document.getElementById('messageTitleJa').textContent = msg.titleJa;
    document.getElementById('messageImage').src = msg.image;
    document.getElementById('messageHeading').textContent = msg.heading;

    // 本文（改行対応）
    const bodyEl = document.getElementById('messageBody');
    msg.body.split('\n').forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      bodyEl.appendChild(p);
    });

    // Vision / Mission カード
    const valuesEl = document.getElementById('messageValues');
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

    // ボタン
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
  // SERVICE
  // ==========================================
  function renderService(svc) {
    document.getElementById('serviceTitleEn').textContent = svc.titleEn;
    document.getElementById('serviceTitleJa').textContent = svc.titleJa;

    const grid = document.getElementById('serviceGrid');
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
          <a href="${item.url}" class="service__card-link">${item.linkText}</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // ==========================================
  // PHOTO
  // ==========================================
  function renderPhoto(photo) {
    document.getElementById('photoTitleEn').textContent = photo.titleEn;
    document.getElementById('photoTitleJa').textContent = photo.titleJa;

    const grid = document.getElementById('photoGrid');
    photo.images.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'photo__item';
      div.innerHTML = `<img src="${src}" alt="職場風景${i + 1}">`;
      grid.appendChild(div);
    });
  }

  // ==========================================
  // ACCESS
  // ==========================================
  function renderAccess(acc) {
    document.getElementById('accessTitleEn').textContent = acc.titleEn;
    document.getElementById('accessTitleJa').textContent = acc.titleJa;

    const container = document.getElementById('accessOffices');
    acc.offices.forEach(office => {
      const div = document.createElement('div');
      div.className = `access__office${office.isMain ? ' is-main' : ''}`;
      let html = `
        <h3>${office.name}</h3>
        <p class="access__office-address">${office.address}</p>
      `;
      if (office.mapUrl) {
        html += `<a href="${office.mapUrl}" target="_blank" rel="noopener" class="access__office-map">📍 Google Map</a>`;
      }
      div.innerHTML = html;
      container.appendChild(div);
    });

    // 注意書き
    const noteEl = document.getElementById('accessNote');
    noteEl.innerHTML = acc.note.replace(/\n/g, '<br>');
  }

  // ==========================================
  // FOOTER
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
  // インタラクション
  // ==========================================
  function initInteractions() {
    // ハンバーガーメニュー
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('headerNav');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('is-open');
      document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
    });

    // メニュー内リンクでメニュー閉じる
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        hamburger.classList.remove('active');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });

    // スクロールでヘッダー背景変化
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.style.background = 'rgba(26, 46, 90, 0.98)';
      } else {
        header.style.background = '';
      }
    });

    // Intersection Observer でフェードイン
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.section').forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    });
  }

})();
