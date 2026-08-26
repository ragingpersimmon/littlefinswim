// Little Fin Swim - minimal, restrained interaction only.
// Fades journal entries in as they enter view. No-ops entirely
// if the visitor has requested reduced motion.

(function () {
  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  var entries = document.querySelectorAll('.entry');

  if (entries.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      entries.forEach(function (el) {
        el.style.opacity = '1';
      });
    } else {
      entries.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(14px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      });

      var observer = new IntersectionObserver(
        function (records) {
          records.forEach(function (record) {
            if (record.isIntersecting) {
              record.target.style.opacity = '1';
              record.target.style.transform = 'translateY(0)';
              observer.unobserve(record.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      entries.forEach(function (el) {
        observer.observe(el);
      });
    }
  }

  renderProductPlugins();

  function renderProductPlugins() {
    var productModules = {
      'lighting-timer': {
        title: 'Lighting timer',
        intro: 'A timer helps keep the aquarium light cycle regular without relying on manual switching.',
        products: [
          {
            name: 'Coralife Digital Power Center',
            meta: '$69.00 · Amazon CA',
            detail: 'A simple way to keep a dependable lighting schedule for planted tanks.'
          }
        ]
      },
      'shrimp-habitat': {
        title: 'Shrimp habitat',
        intro: 'These habitat products can help create a more natural, stable shrimp environment without overpromising treatment claims.',
        products: [
          {
            name: 'Fluval Plant & Shrimp Stratum',
            meta: '$23.99 · Dyno.ca',
            detail: 'A soft substrate option that can support a planted, shrimp-friendly setup.'
          },
          {
            name: 'Indian almond leaves',
            meta: '30-piece set · varied retailers',
            detail: 'A classic shrimp-habitat addition that can influence the tank microenvironment.'
          },
          {
            name: 'Cholla wood',
            meta: 'Varies by seller',
            detail: 'A natural-looking anchor for hiding spaces and grazing areas.'
          }
        ]
      },
      'water-parameters': {
        title: 'Water parameters',
        intro: 'A reliable test kit makes it easier to understand GH, KH, pH, and temperature before making changes.',
        products: [
          {
            name: 'API GH & KH Test Kit',
            meta: '$19.99 · La Niche & Moi + others',
            detail: 'A practical tool for checking the mineral stability that matters for shrimp and plants.'
          }
        ]
      },
      'filtration-setup': {
        title: 'Filtration setup',
        intro: 'For gentle, low-stress circulation, a small sponge filter can be a good backup or primary setup in a smaller tank.',
        products: [
          {
            name: 'Hikari Bacto-Surge Sponge Filter Small',
            meta: '$9.55 · angelfins.ca',
            detail: 'A compact option for supplemental filtration and gentle aeration.'
          },
          {
            name: 'Pawfly Aquarium Check Valves',
            meta: '$7.99 · Amazon CA',
            detail: 'A simple safeguard that helps keep water movement predictable when using air-driven setups.'
          }
        ]
      }
    };

    var anchors = document.querySelectorAll('[data-product-plugin-id]');
    if (!anchors.length) return;

    anchors.forEach(function (anchor) {
      var moduleId = anchor.getAttribute('data-product-plugin-id');
      var module = productModules[moduleId];
      if (!module) return;

      var html = [
        '<aside class="product-module" aria-label="' + escapeHtml(module.title) + '">',
        '  <div class="product-module__header">',
        '    <p class="eyebrow">Recommended products</p>',
        '    <h4 class="product-module__title">' + escapeHtml(module.title) + '</h4>',
        '    <p class="product-module__intro">' + escapeHtml(module.intro) + '</p>',
        '  </div>',
        '  <div class="product-module__grid">'
      ];

      module.products.forEach(function (item) {
        html.push(
          '    <article class="product-card">',
          '      <p class="product-card__eyebrow">Suggested item</p>',
          '      <h5 class="product-card__name">' + escapeHtml(item.name) + '</h5>',
          '      <p class="product-card__meta">' + escapeHtml(item.meta) + '</p>',
          '      <p class="product-card__detail">' + escapeHtml(item.detail) + '</p>',
          '    </article>'
        );
      });

      html.push(
        '  </div>',
        '</aside>'
      );

      anchor.insertAdjacentHTML('afterend', html.join(''));
      anchor.classList.add('is-rendered');
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();