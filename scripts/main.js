const API = "https://68a5b0d72a3deed2960e7566.mockapi.io/todo/products";
let products = [];
let shop_cart = document.querySelector(".shop-card");
let shop = JSON.parse(localStorage.getItem("shop")) || [];

async function addUI() {
  try {
    let res = await fetch(API);
    products = await res.json();
    const container = document.querySelector(".products-wrapper");
    if (!container) return;
    container.innerHTML = "";
    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "min-w-[240px] bg-white rounded-xl p-4 shadow hover:shadow-lg transition relative";
      let stars = "";
      for (let i = 1; i <= 5; i++) {
        stars += i <= Math.round(p.rating)
          ? `<i class="fa-solid fa-star" style="color: #FFD43B;"></i>`
          : `<i class="fa-regular fa-star" style="color: #FFD43B;"></i>`;
      }
      const wishlist = getWishlist();
      const isLiked = wishlist.find(item => item.title === p.title);
      card.innerHTML = `
        ${p.discount ? `<span class="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">${p.discount}</span>` : ""}
        <div class="absolute top-3 right-3 flex flex-col gap-2">
          <button class="like-btn bg-white hover:bg-gray-100 p-1 rounded" data-title="${p.title}">
            <i class="${isLiked ? "fa-solid" : "fa-regular"} fa-heart ${isLiked ? "text-red-500" : ""}"></i>
          </button>
        </div>
        <img src="${p.image}" alt="${p.title}" class="w-32 h-32 object-contain mx-auto mt-6">
        <h3 class="text-[13px] font-medium mt-4 leading-snug">${p.title}</h3>
        <div class="flex items-center text-yellow-500 text-sm mt-2">${stars}<span class="text-gray-500 text-xs ml-2">${p.reviews} отзывов</span></div>
        <div class="mt-2">
          ${p.old_price ? `<p class="text-gray-400 text-sm line-through">${p.old_price.toLocaleString()} сум</p>` : ""}
          <p class="text-blue-600 text-lg font-bold">${p.price.toLocaleString()} сум</p>
          ${p.installment ? `<p class="text-orange-500 text-sm font-medium border p-1">${p.installment}</p>` : ""}
        </div>
        <div class="flex items-center gap-2 mt-4">
          <button class="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition">Купить в один клик</button>
          <button data-id="${p.id}" class="shop bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition cursor-pointer">🛒</button>
        </div>
      `;
      container.appendChild(card);
    });
    document.querySelectorAll(".shop").forEach(btn => {
      btn.addEventListener("click", (e) => {
        let product = products.find(item => item.id === e.target.dataset.id);
        if (!product) return;
        let existing = shop.find(item => item.id === product.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          product.quantity = 1;
          shop.push(product);
        }
        saveCart(shop);
        updateCartCount();
      });
    });
    likeButtons();
  } catch (err) {
    console.error(err);
  }
}
addUI();

function saveCart(cart) {
  localStorage.setItem("shop", JSON.stringify(cart));
}
function getCart() {
  return JSON.parse(localStorage.getItem("shop")) || [];
}
function updateCartCount() {
  let count = shop.reduce((sum, item) => sum + item.quantity, 0);
  let cartCountEl = document.querySelector(".material-icons ~ span.absolute");
  if (cartCountEl) cartCountEl.textContent = count;
}
function renderCartItems() {
  if (!shop_cart) return;
  shop_cart.innerHTML = "";
  shop.forEach((value) => {
    let div = document.createElement("div");
    div.className = "flex gap-5 md:flex-row mb-6 border-b pb-4";
    div.innerHTML = `
      <div class="w-24 md:w-1/4 flex justify-center">
          <img src="${value.image}" alt="${value.title}" class="h-32 object-contain">
      </div>
      <div class="w-full md:w-3/4 mt-4 md:mt-0 md:pl-4">
          <div class="flex justify-between">
              <h3 class="font-semibold text-lg">${value.title}</h3>
              <button class="remove-item text-gray-400 hover:text-red-500" data-id="${value.id}">
                  <i class="fa-solid fa-trash"></i>
              </button>
          </div>
          <div class="flex items-center mt-4 gap-6">
              <span class="text-blue-600 font-bold text-lg">${value.price.toLocaleString()} сум</span>
          </div>
          <div class="flex items-center mt-6">
              <div class="flex items-center border rounded-lg">
                  <button class="decrease px-3 py-1 text-gray-600 hover:bg-gray-100" data-id="${value.id}">-</button>
                  <span class="px-4 py-1">${value.quantity}</span>
                  <button class="increase px-3 py-1 text-gray-600 hover:bg-gray-100" data-id="${value.id}">+</button>
              </div>
          </div>
      </div>
    `;
    shop_cart.append(div);
  });
  document.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      removeCartItem(btn.dataset.id);
    });
  });
  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", () => {
      let item = shop.find(i => i.id === btn.dataset.id);
      if (item) item.quantity++;
      saveCart(shop);
      renderCartItems();
      updateCartCount();
    });
  });
  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", () => {
      let item = shop.find(i => i.id === btn.dataset.id);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else {
        shop = shop.filter(i => i.id !== btn.dataset.id);
      }
      saveCart(shop);
      renderCartItems();
      updateCartCount();
    });
  });
}
function removeCartItem(id) {
  shop = shop.filter(item => item.id !== id);
  saveCart(shop);
  renderCartItems();
  updateCartCount();
}
function clearCart() {
  shop = [];
  saveCart(shop);
  renderCartItems();
  updateCartCount();
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}
function likeButtons() {
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      let wishlist = getWishlist();
      let title = btn.dataset.title;
      const product = products.find(p => p.title === title);
      const have = wishlist.find(item => item.title === title);
      if (have) {
        wishlist = wishlist.filter(item => item.title !== title);
        btn.querySelector("i").className = "fa-regular fa-heart";
        btn.querySelector("i").classList.remove("text-red-500");
      } else {
        wishlist.push(product);
        btn.querySelector("i").className = "fa-solid fa-heart text-red-500";
      }
      saveWishlist(wishlist);
    });
  });
}
function renderWishlist() {
  const container = document.querySelector(".wishlist-wrapper");
  if (!container) return;
  const wishlist = getWishlist();
  container.innerHTML = "";
  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center w-full py-10">
        <img class="w-40 mx-auto" src="./assets/empty.png" alt="">
        <h4 class="text-lg font-semibold mt-4">Нет любимых продуктов</h4>
        <p class="text-gray-500 text-sm">Добавить с символом ❤️ на продукте</p>
      </div>
    `;
    return;
  }
  wishlist.forEach(p => {
    const card = document.createElement("div");
    card.className = "min-w-[240px] bg-white rounded-xl p-4 shadow hover:shadow-lg transition relative";
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += i <= Math.round(p.rating)
        ? `<i class="fa-solid fa-star" style="color: #FFD43B;"></i>`
        : `<i class="fa-regular fa-star" style="color: #FFD43B;"></i>`;
    }
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" class="w-32 h-32 object-contain mx-auto mt-6">
      <h3 class="text-[13px] font-medium mt-4 leading-snug">${p.title}</h3>
      <div class="flex items-center text-yellow-500 text-sm mt-2">${stars}<span class="text-gray-500 text-xs ml-2">${p.reviews} отзывов</span></div>
      <div class="mt-2">
        ${p.old_price ? `<p class="text-gray-400 text-sm line-through">${p.old_price.toLocaleString()} сум</p>` : ""}
        <p class="text-blue-600 text-lg font-bold">${p.price.toLocaleString()} сум</p>
        ${p.installment ? `<p class="text-orange-500 text-sm font-medium border p-1">${p.installment}</p>` : ""}
      </div>
    `;
    container.appendChild(card);
  });
}

let wishlistBtn = document.getElementById("wishlist-btn");
if (wishlistBtn) {
  wishlistBtn.addEventListener("click", function () {
    window.location.href = "./wishlist.html";
  });
}
renderWishlist();

let wishlistCount = document.getElementById("wishlist-count");
if (wishlistCount) {
  let wishlist = getWishlist();
  wishlistCount.textContent = wishlist.length;
}

let karzinkaBtn = document.getElementById("karzinka-btn");
if (karzinkaBtn) {
  karzinkaBtn.addEventListener("click", function () {
    window.location.href = "./korzinka.html";
  });
}

renderCartItems();
updateCartCount();
