document.addEventListener('DOMContentLoaded', function() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalDisplay = document.getElementById('cartTotal');
  const labubuMessage = document.getElementById('labubuMessage');
  const labubuImg = document.getElementById('labubuImg');
  const promoInput = document.getElementById('promoCode');

  let cart = [];
  let discountApplied = false;

  function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;

      const li = document.createElement('li');
      li.textContent = `${item.name} – ₹${item.price}`;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '❌';
      removeBtn.style.marginLeft = '10px';
      removeBtn.style.cursor = 'pointer';
      removeBtn.title = 'Remove item';
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        discountApplied = false;  // Reset discount if cart changes
        promoInput.value = '';
        updateCart();
      });

      li.appendChild(removeBtn);
      cartItemsContainer.appendChild(li);
    });

    // Apply promo discount if active
    let displayTotal = total;
    if (discountApplied) {
      displayTotal = Math.floor(total * 0.8);  // 20% off
    }

    cartTotalDisplay.textContent = displayTotal;

    if (displayTotal >= 4000) {
      labubuMessage.textContent = '🎁 You get a FREE Labubu!';
      labubuImg.style.display = 'block';
      labubuImg.classList.add('pop');
      setTimeout(() => labubuImg.classList.remove('pop'), 800);
    } else {
      labubuMessage.textContent = `Add ₹${4000 - displayTotal} more for a free Labubu!`;
      labubuImg.style.display = 'none';
    }
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#d4a373';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.animation = 'fadeIn 0.5s ease-in-out';

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.5s ease-in-out';
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const productPriceText = productCard.querySelector('p').textContent;
      const productPrice = Number(productPriceText.replace(/[₹,]/g, ''));

      cart.push({ name: productName, price: productPrice });
      discountApplied = false;  // Reset discount on new item add
      promoInput.value = '';
      updateCart();
      showNotification(`${productName} added to cart!`);
      console.log(`Added to cart: ${productName} - ₹${productPrice}`);
    });
  });

  window.applyPromo = function() {
    const code = promoInput.value.trim().toUpperCase();

    if (code === 'BDAY20') {
      if (discountApplied) {
        alert('Promo code already applied.');
        return;
      }
      if (cart.length === 0) {
        alert('Add items to cart first.');
        return;
      }
      discountApplied = true;
      updateCart();
      alert('🎉 Promo code applied: 20% OFF!');
    } else {
      alert('Invalid promo code.');
    }
  };

  // Newsletter form submission
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value;

      if (email.includes('@') && email.includes('.')) {
        alert('Thank you for subscribing! Check your email for your 10% discount code.');
        emailInput.value = '';
        console.log(`New subscriber: ${email}`);
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }
});
