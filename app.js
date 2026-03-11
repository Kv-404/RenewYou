/* ============================================
   RenewYou — Complete E-Commerce JS (V7 - Editorial)
   ============================================ */
(function () {
  'use strict';

  /* ============================
     PRODUCT DATABASE
     ============================ */
  const PRODUCTS = [
    {
      id: 'journal',
      type: 'item',
      name: 'Mindfulness Journal',
      price: 799,
      image: 'assets/journal.png',
      desc: 'Linen-bound, 200 pages of therapist-designed daily prompts. Stripped of all superfluous design, leaving only the essential framework for introspection.',
      details: ['200 Pages', 'Archival Grade Paper', 'Therapist Vetted']
    },
    {
      id: 'lavender-oil',
      type: 'item',
      name: 'French Lavender Oil',
      price: 599,
      image: 'assets/oils.png',
      desc: 'Clinical-grade relaxation oil. Ethically sourced from Provence. A single drop re-centers the nervous system.',
      details: ['15ml Bottle', 'UV-Protective Glass', '100% Pure']
    },
    {
      id: 'eucalyptus-oil',
      type: 'item',
      name: 'Eucalyptus Focus Oil',
      price: 599,
      image: 'assets/eucalyptus_oil.png',
      desc: 'Cognitive-boosting blend from Australian Eucalyptus leaves. Engineered for deep work sessions.',
      details: ['15ml Bottle', 'Stimulating Profile', '100% Pure']
    },
    {
      id: 'candle',
      type: 'item',
      name: 'Sandalwood Soy Candle',
      price: 499,
      image: 'assets/sandalwood_candle.png',
      desc: 'Hand-poured, 40-hour burn time. Natural soy wax and cotton wick. Architectural simplicity.',
      details: ['40 Hr Burn Time', 'Natural Soy', 'Cotton Wick']
    },
    {
      id: 'sleep-mask',
      type: 'item',
      name: 'Silk Sleep Mask',
      price: 699,
      image: 'assets/rest_box.png',
      desc: '100% Grade 6A mulberry silk. Adjustable, breathable, travel-ready. Total sensory deprivation.',
      details: ['Grade 6A Silk', 'Zero Light Leak', 'Adjustable']
    },
    {
      id: 'worry-stone',
      type: 'item',
      name: 'Polished Worry Stone',
      price: 399,
      image: 'assets/grounding_box.png',
      desc: 'Smooth jade grounding stone for tactile anxiety relief. Heavy, cold, permanent.',
      details: ['Natural Jade', 'Pocket Sized', 'Geometrically Perfect']
    },
    {
      id: 'calm-box',
      type: 'box',
      name: 'The Calm Protocol Box',
      price: 2499,
      image: 'assets/calm_box.png',
      desc: 'A complete system for nervous system regulation. Lavender oil, chamomile tea, and a mindfulness journal delivered monthly.',
      details: ['Monthly Supply', 'Curated by Therapists', 'Gift Ready'],
      perks: ['Expert-curated contents each cycle', 'RenewYou Community Forum access', 'Digital Companion App (iOS & Android)', 'Early access to new drops']
    },
    {
      id: 'rest-box',
      type: 'box',
      name: 'The Rest Box',
      price: 2499,
      image: 'assets/rest_box.png',
      desc: 'Engineered for REM latency reduction. Silk mask, sleep tincture, and soy candle.',
      details: ['Clinical Sleep Aid', '3 Item Kit', 'Gift Ready'],
      perks: ['Expert-curated contents each cycle', 'RenewYou Community Forum access', 'Digital Companion App (iOS & Android)', 'Early access to new drops']
    },
    {
      id: 'clarity-box',
      type: 'box',
      name: 'The Clarity Box',
      price: 2499,
      image: 'assets/clarity_box.png',
      desc: 'Mental focus optimization. Ceremonial matcha, eucalyptus oil, and deep-work planner.',
      details: ['Flow State Trigger', '3 Item Kit', 'Gift Ready'],
      perks: ['Expert-curated contents each cycle', 'RenewYou Community Forum access', 'Digital Companion App (iOS & Android)', 'Early access to new drops']
    },
    {
      id: 'grounding-box',
      type: 'box',
      name: 'The Grounding Box',
      price: 2499,
      image: 'assets/grounding_box.png',
      desc: 'Acute stress relief protocol. Worry stone, palo santo, and mineral bath salts.',
      details: ['Sensory Anchoring', '3 Item Kit', 'Gift Ready'],
      perks: ['Expert-curated contents each cycle', 'RenewYou Community Forum access', 'Digital Companion App (iOS & Android)', 'Early access to new drops']
    },
    {
      id: 'weighted-blanket',
      type: 'item',
      name: 'Deep Pressure Blanket',
      price: 12900,
      image: 'assets/weighted_blanket.png',
      desc: '15lb weighted blanket engineered for deep nervous system relaxation. Simulates therapeutic deep touch pressure.',
      details: ['Organic Cotton', 'Glass Microbeads', 'Machine Washable']
    },
    {
      id: 'therapy-lamp',
      type: 'item',
      name: 'SAD Light Therapy Lamp',
      price: 4500,
      image: 'assets/therapy_lamp.png',
      desc: '10,000 Lux full-spectrum UV-free therapy light. Realigns your circadian rhythm and boosts mood.',
      details: ['10,000 Lux', 'UV-Free', 'Adjustable Brightness']
    },
    {
      id: 'sound-machine',
      type: 'item',
      name: 'White Noise Machine',
      price: 3500,
      image: 'assets/sound_machine.png',
      desc: 'Non-looping acoustic fan and electronic white noise. Masks environmental disruption for unbroken sleep.',
      details: ['20 Sound Profiles', 'Warm Night Light', 'Timer Function']
    },
    {
      id: 'meditation-cushion',
      type: 'item',
      name: 'Zafu Meditation Cushion',
      price: 5900,
      image: 'assets/meditation_cushion.png',
      desc: 'Ergonomic buckwheat hull cushion. Elevates the hips to align the spine for prolonged, pain-free meditation.',
      details: ['Buckwheat Fill', 'Removable Linen Cover', 'Handcrafted']
    }
  ];

  function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
  }

  /* ============================
     CART MODULE (localStorage)
     ============================ */
  const CART_KEY = 'ryCart_v7'; // version bump to avoid conflicts

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
     BADGE UPDATE
     ============================ */
  function updateBadge() {
    document.querySelectorAll('#cartBadge').forEach(b => {
      const count = getCartCount();
      b.textContent = count > 0 ? count : '';
      b.setAttribute('data-count', count);
      b.style.display = count > 0 ? 'inline-block' : 'none';
      if (count > 0) {
        b.style.padding = '2px 6px';
        b.style.position = 'absolute';
      }
    });
  }
  updateBadge(); // Run immediately

  /* ============================
     TOAST NOTIFICATION (Brutalist)
     ============================ */
  function showToast(msg) {
    let toast = document.getElementById('ryToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ryToast';
      toast.style.cssText = `
        position:fixed; bottom:2rem; right:2rem;
        background:var(--clr-dark); color:#fff;
        padding:1rem 2rem; border:1px solid #121212;
        font-size:0.8rem; font-family:var(--ff-body); text-transform:uppercase; font-weight:700;
        box-shadow: 10px 10px 0 #121212;
        z-index:9999; transition:all 0.2s;
        white-space:nowrap; pointer-events:none; opacity:0; transform:translateY(20px);
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
    }, 2000);
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
     SCROLL ANIMATIONS (Intersection Observer)
     ============================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: unobserve if you only want the animation to happen once
        // revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  /* ============================
     EVENT DELEGATION (Cart & Buy)
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

      const orig = addBtn.innerHTML;
      addBtn.innerHTML = 'ADDED ✓';
      addBtn.style.background = 'var(--clr-accent)';
      addBtn.style.color = '#fff';
      setTimeout(() => {
        addBtn.innerHTML = orig;
        addBtn.style.background = '';
        addBtn.style.color = '';
      }, 1000);
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
     APP ROUTER (Product Page Rendering)
     ============================ */
  function renderProductPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const container = document.getElementById('pdpContent');
    if (!container) return; // Not on product.html

    const product = getProductById(id);
    if (!product) {
      container.innerHTML = `<div style="text-align:center; padding: 20vh 0;"><h1 style="font-size:3rem">404 — NOT FOUND</h1><br><a href="shop.html" class="btn btn-outline" style="margin-top:2rem">RETURN TO SHOP</a></div>`;
      return;
    }

    // Update Meta Title
    document.title = `${product.name} — RenewYou`;

    // Render HTML structure into container
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
              ${product.details.map(d => `<li>${d}</li>`).join('')}
            </ul>

            ${product.perks ? `
            <div class="pdp-perks">
              <div class="pdp-perks-title">Subscription Includes</div>
              <ul>
                ${product.perks.map(p => `<li>${p}</li>`).join('')}
              </ul>
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

  // Bind routing when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pdpContent')) {
      renderProductPage();
    }

    // Auto-render shop page if on shop.html
    const shopGrid = document.getElementById('brutalistShopGrid');
    if (shopGrid) {
      renderShopList();
    }
  });

  /* ============================
     RENDER SHOP PAGE DYNAMICALLY
     ============================ */
  function renderShopList() {
    const shopGrid = document.getElementById('brutalistShopGrid');
    if (!shopGrid) return;

    let html = '';
    PRODUCTS.forEach((p, idx) => {
      const number = String(idx + 1).padStart(2, '0');
      html += `
        <a href="product.html?id=${p.id}" class="shop-list-item" data-type="${p.type}">
          <div class="shop-list-num">#${number}</div>
          <div class="shop-list-name"><h2>${p.name}</h2></div>
          <div class="shop-list-type">${p.type.toUpperCase()}</div>
          <div class="shop-list-price">${formatPrice(p.price)}</div>
          <div class="shop-list-img-hover"><img src="${p.image}" alt="${p.name}"></div>
        </a>
      `;
    });
    shopGrid.innerHTML = html;

    // Attach filters
    const filterTabs = document.getElementById('filterTabs');
    if (filterTabs) {
      const tabs = filterTabs.querySelectorAll('.filter-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const filter = tab.dataset.filter;
          const rows = document.querySelectorAll('.shop-list-item');
          rows.forEach(row => {
            if (filter === 'all' || row.dataset.type === filter) {
              row.style.display = 'flex';
            } else {
              row.style.display = 'none';
            }
          });
        });
      });
    }
  }

  /* ============================
     CART RENDERING
     ============================ */
  const cartContent = document.getElementById('cartContent');
  if (cartContent) {
    renderCart(); // Triggered on initial load
  }

  function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
      cartContent.innerHTML = `
        <div class="cart-empty" style="text-align:center; padding:10vh 0; border:1px solid #121212;">
          <h2 style="font-size:3rem; margin-bottom:1rem; text-transform:uppercase;">Basket is Empty</h2>
          <a href="shop.html" class="btn btn-fill btn-lg" style="margin-top:2rem;">Return to Index</a>
        </div>`;
      return;
    }

    let itemsHTML = '';
    cart.forEach(item => {
      itemsHTML += `
        <div class="cart-item" data-id="${item.id}" style="display:flex; gap:2rem; padding:2rem 0; border-bottom:1px solid #121212;">
          <img src="${item.image}" alt="${item.name}" style="width:120px; aspect-ratio:1/1;">
          <div class="cart-item-info" style="flex:1;">
            <h4 style="font-family:var(--ff-display); font-size:1.5rem; text-transform:uppercase;">${item.name}</h4>
            <p style="margin-bottom:1rem; font-size:0.85rem">${formatPrice(item.price)} PER UNIT</p>
            
            <div style="display:flex; align-items:center; gap:0; border:1px solid #121212; width:fit-content;">
              <button class="qty-minus" data-id="${item.id}" style="padding:0.5rem 1rem; border-right:1px solid #121212;">-</button>
              <span style="padding:0.5rem 1rem; font-weight:600;">${item.qty}</span>
              <button class="qty-plus" data-id="${item.id}" style="padding:0.5rem 1rem; border-left:1px solid #121212;">+</button>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; justify-content:space-between;">
            <span style="font-size:1.5rem; font-weight:600; font-family:var(--ff-display);">${formatPrice(item.price * item.qty)}</span>
            <button class="remove-btn" data-id="${item.id}" style="font-size:0.75rem; text-decoration:underline; text-transform:uppercase; font-weight:700;">Remove</button>
          </div>
        </div>`;
    });

    const total = getCartTotal();
    const count = getCartCount();

    // Layout with the new aesthetic
    cartContent.innerHTML = `
      <div style="display:grid; grid-template-columns: 1.8fr 1fr; gap: 4rem; align-items:start;">
        <div class="cart-items" style="border-top:1px solid #121212;">${itemsHTML}</div>
        
        <div class="cart-summary" style="border:1px solid #121212; padding:3rem; position:sticky; top:120px;">
          <h3 style="font-size:2rem; margin-bottom:2rem; border-bottom:1px solid #121212; padding-bottom:1rem;">SUMMARY</h3>
          <div style="display:flex; justify-content:space-between; margin-bottom:1rem; font-size:0.85rem; font-weight:600;"><span>SUBTOTAL (${count})</span><span>${formatPrice(total)}</span></div>
          <div style="display:flex; justify-content:space-between; margin-bottom:2rem; font-size:0.85rem; font-weight:600;"><span>SHIPPING</span><span>COMPLIMENTARY</span></div>
          
          <div style="display:flex; justify-content:space-between; padding-top:2rem; border-top:1px solid #121212; font-family:var(--ff-display); font-size:2.5rem; margin-bottom:3rem;"><span>TOTAL</span><span>${formatPrice(total)}</span></div>
          
          <a href="checkout.html" class="btn btn-fill btn-block btn-lg" style="text-align:center;">PROCEED TO CHECKOUT</a>
        </div>
      </div>`;

    // Attach qty and remove listeners
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

  /* ============================
     CHECKOUT RENDER
     ============================ */
  const checkoutItems = document.getElementById('checkoutItemsList');
  if (checkoutItems) {
    renderCheckoutList();
    initCheckoutForm();
  }

  function renderCheckoutList() {
    const cart = getCart();
    const total = getCartTotal();

    let html = '';
    cart.forEach(item => {
      html += `
            <div style="display:flex; justify-content:space-between; padding:1rem 0; border-bottom:1px solid #e0e0e0; font-size:0.85rem;">
                <div><span style="font-weight:700;">${item.name}</span> x${item.qty}</div>
                <div>${formatPrice(item.price * item.qty)}</div>
            </div>`;
    });
    document.getElementById('checkoutItemsList').innerHTML = html;
    document.getElementById('checkoutTotal').textContent = formatPrice(total);
    document.getElementById('checkoutBtnAmount').textContent = formatPrice(total);
  }

  function initCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    const subOption = document.getElementById('subscribeOption');
    const total = getCartTotal();

    if (subOption) {
      subOption.addEventListener('change', () => {
        let finalTotal = total;
        if (subOption.checked) {
          finalTotal = Math.round(total * 0.85);
          document.getElementById('checkoutTotal').innerHTML = `${formatPrice(finalTotal)} <span style="color:var(--clr-accent);">(-15%)</span>`;
        } else {
          document.getElementById('checkoutTotal').textContent = formatPrice(total);
        }
        document.getElementById('checkoutBtnAmount').textContent = formatPrice(finalTotal);
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.innerHTML = 'PROCESSING...';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        document.getElementById('successOverlay').style.display = 'flex';
        localStorage.removeItem(CART_KEY);
        updateBadge();
      }, 1500);
    });
  }

  /* ============================
     DIAGNOSTIC QUIZ (Rewritten to route to Product Page)
     ============================ */
  const quizCard = document.querySelector('.quiz-card');
  if (quizCard) {
    initQuiz();
  }

  function initQuiz() {
    const steps = Array.from(document.querySelectorAll('.quiz-step'));
    let currentStep = 0;

    // Enable next button when an option is selected
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
          showQuizRouting();
        }
      });
    });

    function showQuizRouting() {
      // Very basic tally to determine the box ID
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

      const boxMap = {
        anxiety: 'calm-box',
        sleep: 'rest-box',
        focus: 'clarity-box',
        stress: 'grounding-box'
      };

      const matchId = boxMap[best];

      // Directly route to the new PDP
      window.location.href = `product.html?id=${matchId}`;
    }
  }

})();
