/* ============================================
   checkout.js — Checkout Logic
   Handles: Subscription toggling, Gift options,
   Payment method switching, Order summary,
   and Form Submission.
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // Uses CART_KEY from app.js if available, otherwise fallback
  const CART_KEY = window.CART_KEY || 'ryCart_v7';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function formatPrice(n) {
    if (typeof window.formatPrice === 'function') {
      return window.formatPrice(n);
    }
    return '₹' + n.toLocaleString('en-IN');
  }

  const DISCOUNT = {
    monthly: 0.15,
    quarterly: 0.20,
    prepay6: 0.25
  };

  const FREQ_LABEL = {
    monthly: 'Monthly delivery (-15%)',
    quarterly: 'Quarterly delivery (-20%)',
    prepay6: 'Prepaid 6 months (-25%)'
  };

  // State
  let baseTotal = 0;
  let isSubscribed = false;
  let currentFreq = 'monthly';
  let isGift = false;
  let hasGiftWrap = false;

  /* ---- DOM Elements ---- */
  const checkoutItemsList = document.getElementById('checkoutItemsList');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const checkoutBtnAmount = document.getElementById('checkoutBtnAmount');

  // Subscription Elements
  const subscribeToggle = document.getElementById('subscribeToggle');
  const subHeader = document.getElementById('subHeader');
  const subBody = document.getElementById('subBody');
  const discountRow = document.getElementById('discountRow');
  const discountLabel = document.getElementById('discountLabel');
  const discountValue = document.getElementById('discountValue');
  const savingsAmount = document.getElementById('savingsAmount');
  const subSummaryCard = document.getElementById('subSummaryCard');
  const subSummaryText = document.getElementById('subSummaryText');
  const freqRadios = document.querySelectorAll('.freq-option');

  // Gift Elements
  const giftToggle = document.getElementById('giftToggle');
  const giftHeader = document.getElementById('giftHeader');
  const giftBody = document.getElementById('giftBody');
  const giftWrap = document.getElementById('giftWrap');
  const giftWrapRow = document.getElementById('giftWrapRow');
  const giftSummaryCard = document.getElementById('giftSummaryCard');
  const giftSummaryText = document.getElementById('giftSummaryText');
  const giftNameInput = document.getElementById('giftName');

  // Form Elements
  const checkoutForm = document.getElementById('checkoutForm');
  const successOverlay = document.getElementById('successOverlay');
  const successMessage = document.getElementById('successMessage');

  // Payment Options
  const paymentRadios = document.querySelectorAll('input[name="paymentType"]');

  // Only run if we are actually on the checkout page
  if (!checkoutForm) return;

  /* ---- Render Order Summary ---- */
  function renderSummary() {
    const cart = getCart();
    baseTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (checkoutItemsList) {
      let html = '';
      cart.forEach(item => {
        html += `
          <div style="display:flex; justify-content:space-between; padding:0.9rem 0; border-bottom:1px solid var(--clr-border); font-size:0.9rem;">
            <div>
              <span style="font-weight:500;">${item.name}</span><br>
              <span style="opacity:0.6;">× ${item.qty}</span>
            </div>
            <div>${formatPrice(item.price * item.qty)}</div>
          </div>
        `;
      });
      checkoutItemsList.innerHTML = html;
    }

    updateTotals();
  }

  function updateTotals() {
    let total = baseTotal;
    let discount = 0;
    const giftWrapAmount = hasGiftWrap ? 299 : 0;

    // Apply subscription discount if active
    if (isSubscribed) {
      discount = Math.round(baseTotal * DISCOUNT[currentFreq]);
      total = baseTotal - discount + giftWrapAmount;
    } else {
      total = baseTotal + giftWrapAmount;
    }

    // Update Totals displaying
    if (checkoutTotal) checkoutTotal.textContent = formatPrice(total);
    if (checkoutBtnAmount) checkoutBtnAmount.textContent = formatPrice(total);

    // Update Subscription UI Elements in Order Summary
    if (discountRow) {
      if (isSubscribed && discount > 0) {
        discountRow.style.display = 'flex';
        discountLabel.textContent = FREQ_LABEL[currentFreq];
        discountValue.textContent = '-' + formatPrice(discount);
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (subSummaryCard) {
      if (isSubscribed) {
        subSummaryCard.style.display = 'block';
        if (subSummaryText) {
          subSummaryText.innerHTML = `${FREQ_LABEL[currentFreq]}<br>Includes: Community Forum + Digital App Access`;
        }
      } else {
        subSummaryCard.style.display = 'none';
      }
    }

    if (savingsAmount) {
      savingsAmount.textContent = isSubscribed ? `-${formatPrice(discount)} saved` : '—';
    }

    // Update Gift Wrap UI in Order Summary
    if (giftWrapRow) {
      giftWrapRow.style.display = hasGiftWrap ? 'flex' : 'none';
    }
  }

  function updateGiftSummary() {
    if (!giftSummaryCard || !giftSummaryText) return;

    const name = giftNameInput ? giftNameInput.value.trim() : '';

    if (isGift) {
      giftSummaryCard.style.display = 'block';
      giftSummaryText.textContent = name ? `Sending to: ${name}` : 'Recipient details below';
    } else {
      giftSummaryCard.style.display = 'none';
    }
  }


  /* ---- Event Listeners ---- */

  // Subscription Toggle
  if (subscribeToggle) {
    subscribeToggle.addEventListener('change', function () {
      isSubscribed = this.checked;
      if (subBody) subBody.classList.toggle('open', isSubscribed);
      updateTotals();
    });
  }

  if (subHeader && subscribeToggle) {
    subHeader.addEventListener('click', function (e) {
      // Prevent double toggling if they clicked the checkbox directly
      if (e.target === subscribeToggle) return;
      subscribeToggle.checked = !subscribeToggle.checked;
      subscribeToggle.dispatchEvent(new Event('change'));
    });
  }

  // Frequency Toggle
  freqRadios.forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.checked) {
        currentFreq = this.value;
        updateTotals();
      }
    });
  });

  // Gift Box Toggle
  if (giftToggle) {
    giftToggle.addEventListener('change', function () {
      isGift = this.checked;
      if (giftBody) giftBody.classList.toggle('open', isGift);
      updateGiftSummary();
      updateTotals();
    });
  }

  if (giftHeader && giftToggle) {
    giftHeader.addEventListener('click', function (e) {
      if (e.target === giftToggle) return;
      giftToggle.checked = !giftToggle.checked;
      giftToggle.dispatchEvent(new Event('change'));
    });
  }

  // Gift Wrapping
  if (giftWrap) {
    giftWrap.addEventListener('change', function () {
      hasGiftWrap = this.checked;
      updateTotals();
    });
  }

  // Update gift card summary while typing name
  if (giftNameInput) {
    giftNameInput.addEventListener('input', updateGiftSummary);
  }

  // Payment Options Toggle
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', function () {

      // Close all bodies
      document.getElementById('paymentBodyCard').classList.remove('open');
      document.getElementById('paymentBodyUPI').classList.remove('open');
      document.getElementById('paymentBodyCOD').classList.remove('open');

      // Clear Required attributes
      const cardName = document.getElementById('cardName');
      const cardNum = document.getElementById('cardNumber');
      const cardExp = document.getElementById('expiry');
      const cardCvv = document.getElementById('cvv');
      const upiRef = document.getElementById('upiRef');

      if (cardName) cardName.required = false;
      if (cardNum) cardNum.required = false;
      if (cardExp) cardExp.required = false;
      if (cardCvv) cardCvv.required = false;
      if (upiRef) upiRef.required = false;

      // Open selected and set Required
      if (this.value === 'card') {
        document.getElementById('paymentBodyCard').classList.add('open');
        if (cardName) cardName.required = true;
        if (cardNum) cardNum.required = true;
        if (cardExp) cardExp.required = true;
        if (cardCvv) cardCvv.required = true;
      } else if (this.value === 'upi') {
        document.getElementById('paymentBodyUPI').classList.add('open');
        if (upiRef) upiRef.required = true;
      } else if (this.value === 'cod') {
        document.getElementById('paymentBodyCOD').classList.add('open');
      }
    });
  });

  // Trigger default payment state on load
  const checkedRadio = document.querySelector('input[name="paymentType"]:checked');
  if (checkedRadio) {
    checkedRadio.dispatchEvent(new Event('change'));
  }

  // CC Formatting
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    });
  }

  const expiryInput = document.getElementById('expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);
    });
  }

  /* ---- Checkout Form Submit ---- */
  checkoutForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');

    if (btn) {
      btn.innerHTML = 'Processing…';
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.7';
    }

    setTimeout(() => {
      // Modify Success Overlay Message if it's a gift
      const gifted = isGift && giftNameInput && giftNameInput.value.trim() !== '';

      if (successMessage) {
        successMessage.textContent = gifted
          ? `Your gift for ${giftNameInput.value} is being prepared with care.`
          : 'Your restorative tools are being prepared.';
      }

      if (successOverlay) {
        successOverlay.style.display = 'flex';
      }

      // Clear the Cart completely
      localStorage.removeItem(CART_KEY);

      // Hide the global cart badge in the header/nav if present
      document.querySelectorAll('#cartBadge').forEach(badge => {
        badge.textContent = '';
        badge.style.display = 'none';
      });

    }, 1500); // Faux processing delay
  });


  /* ---- Initial Render ---- */
  renderSummary();

});
