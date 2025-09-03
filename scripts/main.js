// === API va LocalStorage asosiy sozlamalar ===
const API = "https://68a5b0d72a3deed2960e7566.mockapi.io/todo/products";
let products = [];
let shop = JSON.parse(localStorage.getItem("shop")) || [];

// === Productlarni yuklash va sahifaga chiqarish ===
async function loadProducts() {
  try {
    let res = await fetch(API);
    products = await res.json();

    const container = document.querySelector(".products-wrapper");
    if (container) {
      container.innerHTML = "";
      products.forEach((p) => {
        const card = document.createElement("div");
        card.className = "product-card border rounded p-4 shadow";
        card.innerHTML = `
          <img src="${p.img}" alt="${p.name}" class="w-full h-40 object-cover mb-3">
          <h3 class="text-lg font-semibold">${p.name}</h3>
          <p class="text-gray-700">${p.price} so'm</p>
          <button class="add-to-cart bg-blue-600 text-white px-4 py-2 rounded mt-2" data-id="${p.id}">
            Add to Cart
          </button>
        `;
        container.appendChild(card);
      });

      // add-to-cart tugmalariga event ulash
      document.querySelectorAll(".add-to-cart").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          let id = e.target.dataset.id;
          addToCart(id);
        });
      });
    }

    renderCartItems();
    updateCartCount();
  } catch (err) {
    console.error("API yuklashda xatolik:", err);
  }
}

// === LocalStorage bilan ishlash funksiyalari ===
function saveCart() {
  localStorage.setItem("shop", JSON.stringify(shop));
}

function getCart() {
  return JSON.parse(localStorage.getItem("shop")) || [];
}

// === Savatga qo‘shish ===
function addToCart(id) {
  let item = shop.find((x) => x.id == id);
  if (item) {
    item.qty += 1;
  } else {
    let product = products.find((p) => p.id == id);
    if (product) {
      shop.push({ ...product, qty: 1 });
    }
  }
  saveCart();
  updateCartCount();
  renderCartItems();
}

// === Savatdan o‘chirish ===
function removeCartItem(id) {
  shop = shop.filter((x) => x.id != id);
  saveCart();
  renderCartItems();
  updateCartCount();
}

// === Miqdorni o‘zgartirish (+/-) ===
function changeQty(id, delta) {
  let item = shop.find((x) => x.id == id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeCartItem(id);
    } else {
      saveCart();
      renderCartItems();
      updateCartCount();
    }
  }
}

// === Savatni tozalash ===
function clearCart() {
  shop = [];
  saveCart();
  renderCartItems();
  updateCartCount();
}

// === Headerdagi umumiy sonni yangilash ===
function updateCartCount() {
  let count = shop.reduce((a, b) => a + b.qty, 0);
  let el = document.querySelector(".cart-count");
  if (el) el.textContent = count;
}

// === Korzinka sahifasida mahsulotlarni chiqarish ===
function renderCartItems() {
  const container = document.querySelector(".shop-card");
  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  if (shop.length === 0) {
    container.innerHTML = "<p class='text-gray-600'>Savat bo'sh</p>";
    updateOrderSummary(0, 0);
    return;
  }

  shop.forEach((item) => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item flex items-center justify-between border-b py-3";
    div.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${item.img}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
        <div>
          <h4 class="font-semibold">${item.name}</h4>
          <p class="text-gray-600">${item.price} so'm</p>
          <div class="flex items-center gap-2 mt-2">
            <button class="dec px-2 bg-gray-200 rounded" data-id="${item.id}">-</button>
            <span>${item.qty}</span>
            <button class="inc px-2 bg-gray-200 rounded" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
      <div>
        <button class="remove text-red-500" data-id="${item.id}">❌</button>
      </div>
    `;
    container.appendChild(div);
  });

  updateOrderSummary(shop.length, total);

  // tugmalar ishlashi
  document.querySelectorAll(".inc").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      changeQty(e.target.dataset.id, 1);
    });
  });

  document.querySelectorAll(".dec").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      changeQty(e.target.dataset.id, -1);
    });
  });

  document.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      removeCartItem(e.target.dataset.id);
    });
  });
}

// === O‘ng tarafdagi "Ваш заказ" bo‘limini yangilash ===
function updateOrderSummary(count, total) {
  const itemsText = document.querySelector(".order-items");
  const totalText = document.querySelector(".order-total");
  const discountText = document.querySelector(".order-discount");
  const grandText = document.querySelector(".order-grand");

  if (itemsText) itemsText.textContent = `В корзине ${count} товара`;
  if (totalText) totalText.textContent = total + " сум";

  let discount = total > 0 ? Math.floor(total * 0.1) : 0; // 10% chegirma
  if (discountText) discountText.textContent = discount + " сум";

  if (grandText) grandText.textContent = total - discount + " сум";
}

// === Dastlabki yuklash ===
loadProducts();
renderCartItems();
updateCartCount();
