// === Utility functions for working with localStorage ===

// Get cart array from localStorage (or empty array if none)
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart array to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update the cart count in navbar/icon
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  const cartCountEl = document.querySelector(".cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

// === Cart actions ===

// Add product to cart (increase quantity if already exists)
function addToCart(product) {
  let cart = getCart();

  const existing = cart.find(item => item.title === product.title);

  if (existing) {
    existing.quantity += 1; 
  } else {
    cart.push({
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
}

// Remove product completely from cart by title
function removeCartItem(title) {
  let cart = getCart();
  cart = cart.filter(item => item.title !== title);
  saveCart(cart);
  updateCartCount();
  renderCartItems();
}

// Clear all cart items
function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  renderCartItems();
}

// === Cart rendering ===

// Render cart items on cart page
function renderCartItems() {
  const cart = getCart();
  const container = document.querySelector(".shop-card");

  if (!container) return; // if not on cart page, do nothing

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-gray-500">Ваша корзина пуста 😢</p>`;
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "flex items-center justify-between border-b pb-4 mb-4";

    div.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-cover rounded-lg">
        <div>
          <h3 class="font-semibold">${item.title}</h3>
          <p class="text-gray-500">${item.price} сум</p>
          <p class="text-sm">Количество: ${item.quantity}</p>
        </div>
      </div>
      <button class="remove bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg" data-title="${item.title}">
        Удалить
      </button>
    `;

    container.appendChild(div);
  });

  // Attach remove event listeners
  document.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", e => {
      const title = e.currentTarget.dataset.title;
      removeCartItem(title);
    });
  });
}

// === Initialize ===

// Run when page loads
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartItems();

  // If "Add to Cart" buttons exist (on index.html)
  const addButtons = document.querySelectorAll(".add-to-cart");
  addButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      const productEl = e.currentTarget.closest(".product-card");

      const product = {
        title: productEl.querySelector(".product-title").textContent,
        price: productEl.querySelector(".product-price").textContent,
        image: productEl.querySelector("img").src
      };

      addToCart(product);
    });
  });

  // If "Clear Cart" button exists (on cart page)
  const clearBtn = document.querySelector(".clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearCart);
  }
});
