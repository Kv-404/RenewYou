/* ============================================
   RenewYou — Core App JS (Simplified)
   Product DB, Cart, Badge, Event Delegation,
   Product Page, Cart Page, Quiz
   ============================================ */
(function () {
  'use strict';

  /* ============================
     PRODUCT DATABASE
     ============================ */
  const PRODUCTS = [
    { id: 'journal', type: 'item', name: 'Mindfulness Journal', price: 799, image: 'assets/journal.png', desc: 'Linen-bound, 200 pages of therapist-designed daily prompts.', details: ['200 Pages', 'Archival Grade Paper', 'Therapist Vetted'] },
    { id: 'lavender-oil', type: 'item', name: 'French Lavender Oil', price: 599, image: 'assets/oils.png', desc: 'Clinical-grade relaxation oil. Ethically sourced from Provence.', details: ['15ml Bottle', 'UV-Protective Glass', '100% Pure'] },
    { id: 'eucalyptus-oil', type: 'item', name: 'Eucalyptus Focus Oil', price: 599, image: 'assets/eucalyptus_oil.png', desc: 'Cognitive-boosting blend from Australian Eucalyptus leaves.', details: ['15ml Bottle', 'Stimulating Profile', '100% Pure'] },
    { id: 'candle', type: 'item', name: 'Sandalwood Soy Candle', price: 499, image: 'assets/sandalwood_candle.png', desc: 'Hand-poured, 40-hour burn time. Natural soy wax and cotton wick.', details: ['40 Hr Burn Time', 'Natural Soy', 'Cotton Wick'] },
    { id: 'sleep-mask', type: 'item', name: 'Silk Sleep Mask', price: 699, image: 'assets/sleep_mask.png', desc: '100% Grade 6A mulberry silk. Adjustable, breathable, travel-ready.', details: ['Grade 6A Silk', 'Zero Light Leak', 'Adjustable'] },
    { id: 'worry-stone', type: 'item', name: 'Polished Worry Stone', price: 399, image: 'assets/grounding_box.png', desc: 'Smooth jade grounding stone for tactile anxiety relief.', details: ['Natural Jade', 'Pocket Sized', 'Geometrically Perfect'] },
    { id: 'calm-box', type: 'box', name: 'The Calm Protocol Box', price: 2499, image: 'assets/calm_box.png', desc: 'A complete system for nervous system regulation. Lavender oil, chamomile tea, and a mindfulness journal delivered monthly.', details: ['Monthly Supply', 'Curated by Therapists', 'Gift Ready'], perks: ['Expert-curated contents each cycle', 'RenewYou Community Forum access', 'Digital Companion App (iOS & Android)', 'Early access to new drops'] },
    { id: 'rest-box', type: 'box', name: 'The Rest Box', price: 2499, image: 'assets/rest_box.png', desc: 'Engineered for REM latency reduction. Silk mask, sleep tincture, and soy candle.', details: ['Clinical Sleep Aid', '3 Item Kit', 'Gift Ready'], perks: ['Expert-curated contents each cycle', 'RenewYou Community Forum access', 'Digital Companion App (iOS & Android)', 'Early access to new drops'] },
    { id: 'clarity-box', type: 'box', name: 'The Clarity Box', price: 2499, image: 'assets/clarity_box.png', desc: 'Mental focus optimization. Ceremonial matcha, eucalyptus oil, and deep-work planner.', details: ['Flow State Trigger', '3 Item Kit', 'Gift Ready'], perks: ['Expert-curated contents each cycle', 'RenewYou Community Forum access', 'Digital Companion App (iOS & Android)', 'Early access to new drops'] },
    { id: 'grounding-box', type: 'box', name: 'The Grounding Box', price: 2499, image: 'assets/grounding_box.png', desc: 'Acute stress relief protocol. Worry stone, palo santo, and mineral bath salts.', details: ['Sensory Anchoring', '3 Item Kit', 'Gift Ready'], perks: ['Expert-curated contents each cycle', 'RenewYou Community Forum access', 'Digital Companion App (iOS & Android)', 'Early access to new drops'] },
    { id: 'weighted-blanket', type: 'item', name: 'Deep Pressure Blanket', price: 12900, image: 'assets/weighted_blanket.png', desc: '15lb weighted blanket for deep nervous system relaxation.', details: ['Organic Cotton', 'Glass Microbeads', 'Machine Washable'] },
    { id: 'therapy-lamp', type: 'item', name: 'SAD Light Therapy Lamp', price: 4500, image: 'assets/therapy_lamp.png', desc: '10,000 Lux full-spectrum UV-free therapy light.', details: ['10,000 Lux', 'UV-Free', 'Adjustable Brightness'] },
    { id: 'sound-machine', type: 'item', name: 'White Noise Machine', price: 3500, image: 'assets/sound_machine.png', desc: 'Non-looping acoustic fan and electronic white noise.', details: ['20 Sound Profiles', 'Warm Night Light', 'Timer Function'] },
    { id: 'meditation-cushion', type: 'item', name: 'Zafu Meditation Cushion', price: 5900, image: 'assets/meditation_cushion.png', desc: 'Ergonomic buckwheat hull cushion for prolonged meditation.', details: ['Buckwheat Fill', 'Removable Linen Cover', 'Handcrafted'] }
  ];

  function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
  }

  /* ============================
     CART (localStorage)
     ============================ */
  const CART_KEY = 'ryCart_v7';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateBadge();
  }

  function addToCart(item) {
    if (!item.id || !item.name || isNaN(item.price)) return;
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: item.id, name: item.name, price: item.price, image: item.image || '', qty: 1 });
    }
    saveCart(cart);
  }

  function removeFromCart(id) {
    saveCart(getCart().filter(i => i.id !== id));
  }

  function updateQty(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
  }

  function getCartCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
  }

  function getCartTotal() {
    return getCart().reduce((sum, i) => sum + (i.price * i.qty), 0);
  }

  function formatPrice(n) {
    return '₹' + n.toLocaleString('en-IN');
  }

  /* ============================
     BADGE
     ============================ */
  function updateBadge() {
    document.querySelectorAll('#cartBadge').forEach(b => {
      const count = getCartCount();
      b.textContent = count > 0 ? count : '';
      b.setAttribute('data-count', count);
      b.style.display = count > 0 ? 'flex' : 'none';
      if (count > 0) b.style.padding = '2px 6px';
    });
  }
  updateBadge();

  /* ============================
     TOAST (simple)
     ============================ */
  function showToast(msg) {
    let toast = document.getElementById('ryToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ryToast';
      toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:#121212;color:#fff;padding:1rem 2rem;font-size:0.8rem;font-weight:700;text-transform:uppercase;z-index:9999;pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = 'block';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.display = 'none'; }, 2000);
  }

  /* ============================
     NAVBAR SCROLL
     ============================ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ============================
     EVENT DELEGATION (Add to Cart & Buy Now)
     ============================ */
  document.body.addEventListener('click', function (e) {
    const addBtn = e.target.closest('.add-to-cart-btn');
    const buyBtn = e.target.closest('.buy-now-btn');

    if (addBtn) {
      e.preventDefault(); e.stopPropagation();
      const item = {
        id: addBtn.dataset.id,
        name: addBtn.dataset.name,
        price: parseInt(addBtn.dataset.price, 10),
        image: addBtn.dataset.img
      };
      if (!item.id || isNaN(item.price)) return;
      addToCart(item);
      showToast('ITEM ADDED +');
    }

    if (buyBtn) {
      e.preventDefault(); e.stopPropagation();
      const item = {
        id: buyBtn.dataset.id,
        name: buyBtn.dataset.name,
        price: parseInt(buyBtn.dataset.price, 10),
        image: buyBtn.dataset.img
      };
      if (!item.id || isNaN(item.price)) return;
      addToCart(item);
      window.location.href = 'checkout.html';
    }
  });

  /* ============================
     PRODUCT PAGE (product.html)
     ============================ */
  function renderProductPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const container = document.getElementById('pdpContent');
    if (!container) return;

    const product = getProductById(id);
    if (!product) {
      container.innerHTML = '<div style="text-align:center;padding:20vh 0;"><h1>404 — NOT FOUND</h1><br><a href="shop.html" class="btn btn-outline" style="margin-top:2rem">RETURN TO SHOP</a></div>';
      return;
    }

    document.title = product.name + ' — RenewYou';

    container.innerHTML = `
      <div class="pdp-layout">
        <div class="pdp-gallery">
          <img src="${product.image}" alt="${product.name}" class="pdp-main-img">
        </div>
        <div class="pdp-info-col">
          <div class="pdp-sticky-inner">
            <span class="pdp-tag">${product.type === 'item' ? 'Individual Tool' : 'Complete System'}</span>
            <h1 class="pdp-title">${product.name}</h1>
            <div class="pdp-price">${formatPrice(product.price)}</div>
            <p class="pdp-desc">${product.desc}</p>
            <ul class="pdp-specs">
              ${product.details.map(d => '<li>' + d + '</li>').join('')}
            </ul>
            ${product.perks ? `
            <div class="pdp-perks">
              <div class="pdp-perks-title">Subscription Includes</div>
              <ul>${product.perks.map(p => '<li>' + p + '</li>').join('')}</ul>
            </div>` : ''}
            <div class="pdp-actions">
              <button class="btn btn-outline btn-lg add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.image}">Add to Cart</button>
              <button class="btn btn-fill btn-lg buy-now-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.image}">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ============================
     SHOP PAGE (shop.html)
     ============================ */
  function renderShopList() {
    const shopGrid = document.getElementById('brutalistShopGrid');
    if (!shopGrid) return;

    const countEl = document.getElementById('productCountDisplay');
    const countLabel = document.getElementById('filterCountLabel');

    // Show all products initially
    renderFilteredGrid('all');

    // Filters
    const filterTabs = document.getElementById('filterTabs');
    if (filterTabs) {
      filterTabs.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          renderFilteredGrid(tab.dataset.filter);
        });
      });
    }

    function renderFilteredGrid(filter) {
      const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.type === filter);

      if (countEl) countEl.textContent = String(filtered.length).padStart(2, '0');
      if (countLabel) countLabel.textContent = filtered.length + ' object' + (filtered.length !== 1 ? 's' : '');

      shopGrid.innerHTML = filtered.map(p => `
        <a href="product.html?id=${p.id}" class="shop-card" data-type="${p.type}">
          <div class="shop-card-img">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
            <div class="shop-card-quick add-to-cart-btn"
              data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.image}"
              onclick="event.preventDefault();">+ Add to Basket</div>
          </div>
          <div class="shop-card-info">
            <span class="shop-card-label">${p.type === 'box' ? 'Ritual Box' : 'Individual'}</span>
            <div class="shop-card-title">${p.name}</div>
            <div class="shop-card-footer">
              <span class="shop-card-price">${formatPrice(p.price)}</span>
              <span class="shop-card-arrow">→</span>
            </div>
          </div>
        </a>
      `).join('');
    }
  }

  /* ============================
     CART PAGE (cart.html)
     ============================ */
  const cartContent = document.getElementById('cartContent');

  function renderCart() {
    if (!cartContent) return;
    const cart = getCart();

    if (cart.length === 0) {
      cartContent.innerHTML = '<div style="text-align:center;padding:10vh 0;border:1px solid #121212;"><h2 style="font-size:3rem;margin-bottom:1rem;text-transform:uppercase;">Basket is Empty</h2><a href="shop.html" class="btn btn-fill btn-lg" style="margin-top:2rem;">Return to Index</a></div>';
      return;
    }

    let itemsHTML = '';
    cart.forEach(item => {
      itemsHTML += `
        <div class="cart-item" data-id="${item.id}" style="display:flex;gap:2rem;padding:2rem 0;border-bottom:1px solid #121212;">
          <img src="${item.image}" alt="${item.name}" style="width:120px;aspect-ratio:1/1;">
          <div style="flex:1;">
            <h4 style="font-family:var(--ff-display);font-size:1.5rem;text-transform:uppercase;">${item.name}</h4>
            <p style="margin-bottom:1rem;font-size:0.85rem">${formatPrice(item.price)} PER UNIT</p>
            <div style="display:flex;align-items:center;gap:0;border:1px solid #121212;width:fit-content;">
              <button class="qty-minus" data-id="${item.id}" style="padding:0.5rem 1rem;border-right:1px solid #121212;">-</button>
              <span style="padding:0.5rem 1rem;font-weight:600;">${item.qty}</span>
              <button class="qty-plus" data-id="${item.id}" style="padding:0.5rem 1rem;border-left:1px solid #121212;">+</button>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;">
            <span style="font-size:1.5rem;font-weight:600;font-family:var(--ff-display);">${formatPrice(item.price * item.qty)}</span>
            <button class="remove-btn" data-id="${item.id}" style="font-size:0.75rem;text-decoration:underline;text-transform:uppercase;font-weight:700;">Remove</button>
          </div>
        </div>`;
    });

    const total = getCartTotal();
    const count = getCartCount();

    cartContent.innerHTML = `
      <div style="display:grid;grid-template-columns:1.8fr 1fr;gap:4rem;align-items:start;">
        <div style="border-top:1px solid #121212;">${itemsHTML}</div>
        <div style="border:1px solid #121212;padding:3rem;position:sticky;top:120px;">
          <h3 style="font-size:2rem;margin-bottom:2rem;border-bottom:1px solid #121212;padding-bottom:1rem;">SUMMARY</h3>
          <div style="display:flex;justify-content:space-between;margin-bottom:1rem;font-size:0.85rem;font-weight:600;"><span>SUBTOTAL (${count})</span><span>${formatPrice(total)}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:2rem;font-size:0.85rem;font-weight:600;"><span>SHIPPING</span><span>COMPLIMENTARY</span></div>
          <div style="display:flex;justify-content:space-between;padding-top:2rem;border-top:1px solid #121212;font-family:var(--ff-display);font-size:2.5rem;margin-bottom:3rem;"><span>TOTAL</span><span>${formatPrice(total)}</span></div>
          <a href="checkout.html" class="btn btn-fill btn-block btn-lg" style="text-align:center;">PROCEED TO CHECKOUT</a>
        </div>
      </div>`;

    cartContent.querySelectorAll('.qty-minus').forEach(b => {
      b.addEventListener('click', () => { updateQty(b.dataset.id, -1); renderCart(); });
    });
    cartContent.querySelectorAll('.qty-plus').forEach(b => {
      b.addEventListener('click', () => { updateQty(b.dataset.id, 1); renderCart(); });
    });
    cartContent.querySelectorAll('.remove-btn').forEach(b => {
      b.addEventListener('click', () => { removeFromCart(b.dataset.id); renderCart(); });
    });
  }

  if (cartContent) renderCart();

  /* ============================
     QUIZ (quiz.html)
     ============================ */
  const quizCard = document.querySelector('.quiz-card');
  if (quizCard) {
    const steps = Array.from(document.querySelectorAll('.quiz-step'));
    let currentStep = 0;

    quizCard.addEventListener('click', function (e) {
      const opt = e.target.closest('.quiz-option');
      if (!opt) return;
      const parentStep = opt.closest('.quiz-step');
      parentStep.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const nextBtn = parentStep.querySelector('[id^="next"]');
      if (nextBtn) nextBtn.disabled = false;
    });

    ['next1', 'next2', 'next3', 'next4'].forEach((id, i) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (i < 3) {
          steps[currentStep].classList.remove('active');
          currentStep = i + 1;
          steps[currentStep].classList.add('active');
        } else {
          // Tally scores and route
          const scores = { anxiety: 0, stress: 0, sleep: 0, focus: 0 };
          quizCard.querySelectorAll('.quiz-option.selected').forEach(opt => {
            const cat = opt.dataset.category;
            const pts = parseInt(opt.dataset.points, 10) || 0;
            if (cat in scores) scores[cat] += pts;
          });

          let best = 'anxiety', max = -1;
          for (const [cat, score] of Object.entries(scores)) {
            if (score > max) { max = score; best = cat; }
          }

          const boxMap = { anxiety: 'calm-box', sleep: 'rest-box', focus: 'clarity-box', stress: 'grounding-box' };
          window.location.href = 'product.html?id=' + boxMap[best];
        }
      });
    });

    // Back buttons
    ['back2', 'back3', 'back4'].forEach((id, i) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        steps[currentStep].classList.remove('active');
        currentStep = i; // back2 -> step 0, back3 -> step 1, back4 -> step 2
        steps[currentStep].classList.add('active');
      });
    });
  }

  /* ============================
     INIT ON DOM READY
     ============================ */
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pdpContent')) renderProductPage();
    if (document.getElementById('brutalistShopGrid')) renderShopList();
  });

})();
