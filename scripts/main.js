// ====== CONFIG / STATE ======
const API = "https://68a5b0d72a3deed2960e7566.mockapi.io/todo/products";

const els = {
  productsWrapper: document.querySelector(".products-wrapper"),
  shopCart: document.getElementById("shop_cart"),
  wishlistBtn: document.getElementById("wishlist-btn"),
  cartBtn: document.getElementById("karzinka-btn"),
  wishlistCount: document.getElementById("wishlist-count"),
};

const storage = {
  get(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
};

let products = [];
let shop = storage.get("shop", []);        // [{...product, quantity: 1}]
let wishlist = storage.get("wishlist", []); // [product,...]

// ====== HELPERS ======
const fmt = (n) => Number(n).toLocaleString("ru-RU"); // "5 299 000"
const idEq = (a, b) => String(a) === String(b);        // idlarni string qilib solishtirish

function syncWishlistCount() {
  if (els.wishlistCount) els.wishlistCount.textContent = wishlist.length;
}

function productStars(rating = 0) {
  let html = "";
  const r = Math.round(rating);
  for (let i = 1; i <= 5; i++) {
    html += i <= r
      ? `<i class="fa-solid fa-star" style="color:#FFD43B;"></i>`
      : `<i class="fa-regular fa-star" style="color:#FFD43B;"></i>`;
  }
  return html;
}

// ====== PRODUCTS LIST (MAIN) ======
async function renderProducts() {
  try {
    const res = await fetch(API);
    products = await res.json();

    if (!els.productsWrapper) return;
    els.productsWrapper.innerHTML = "";

    products.forEach((p) => {
      const isLiked = wishlist.some((w) => idEq(w.id, p.id));

      const card = document.createElement("div");
      card.className =
        "min-w-[240px] bg-white rounded-xl p-4 shadow hover:shadow-lg transition relative";

      card.innerHTML = `
        ${p.discount ? `
          <span class="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            ${p.discount}
          </span>` : ""}

        <div class="absolute top-3 right-3 flex flex-col gap-2">
          <button class="like-btn bg-white hover:bg-gray-100 p-1 rounded" data-id="${p.id}">
            <i class="${isLiked ? "fa-solid" : "fa-regular"} fa-heart ${isLiked ? "text-red-500" : ""}"></i>
          </button>
        </div>

        <img src="${p.image}" alt="${p.title}" class="w-32 h-32 object-contain mx-auto mt-6">

        <h3 class="text-[13px] font-medium mt-4 leading-snug">${p.title}</h3>

        <div class="flex items-center text-yellow-500 text-sm mt-2">
          ${productStars(p.rating)}
          <span class="text-gray-500 text-xs ml-2">${p.reviews} отзывов</span>
        </div>

        <div class="mt-2">
          ${p.old_price ? `<p class="text-gray-400 text-sm line-through">${fmt(p.old_price)} сум</p>` : ""}
          <p class="text-blue-600 text-lg font-bold">${fmt(p.price)} сум</p>
          ${p.installment ? `<p class="text-orange-500 text-sm font-medium border p-1">${p.installment}</p>` : ""}
        </div>

        <div class="flex items-center gap-2 mt-4">
          <button class="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition">
            Купить в один клик
          </button>
          <button class="shop bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition cursor-pointer" data-id="${p.id}">
            🛒
          </button>
        </div>
      `;

      els.productsWrapper.appendChild(card);
    });
  } catch (err) {
    console.error("Xatolik (renderProducts):", err);
  }
}

// ====== EVENT DELEGATION (LIKE + ADD TO CART) ======
function wireProductsDelegation() {
  if (!els.productsWrapper) return;

  els.productsWrapper.addEventListener("click", (e) => {
    // 🛒 qo'shish
    const shopBtn = e.target.closest("button.shop");
    if (shopBtn) {
      const id = String(shopBtn.dataset.id);
      const product = products.find((p) => idEq(p.id, id));
      if (!product) return;

      const have = shop.find((s) => idEq(s.id, id));
      if (have) {
        have.quantity = (have.quantity || 1) + 1; // bor bo'lsa quantity ++
      } else {
        shop.push({ ...product, quantity: 1 });
      }
      storage.set("shop", shop);
      // ixtiyoriy: kichik feedback
      // shopBtn.classList.add("scale-95"); setTimeout(()=>shopBtn.classList.remove("scale-95"), 120);
      return;
    }

    // ❤️ wishlist
    const likeBtn = e.target.closest("button.like-btn");
    if (likeBtn) {
      const id = String(likeBtn.dataset.id);
      const idx = wishlist.findIndex((w) => idEq(w.id, id));
      const icon = likeBtn.querySelector("i");

      if (idx > -1) {
        wishlist.splice(idx, 1);
        if (icon) {
          icon.className = "fa-regular fa-heart";
          icon.classList.remove("text-red-500");
        }
      } else {
        const product = products.find((p) => idEq(p.id, id));
        if (product) {
          wishlist.push(product);
          if (icon) icon.className = "fa-solid fa-heart text-red-500";
        }
      }
      storage.set("wishlist", wishlist);
      syncWishlistCount();
      return;
    }
  });
}

// ====== WISHLIST PAGE RENDER (if present) ======
function renderWishlistPage() {
  const container = document.querySelector(".wishlist-wrapper");
  if (!container) return;

  wishlist = storage.get("wishlist", []);
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

  wishlist.forEach((p) => {
    const card = document.createElement("div");
    card.className =
      "min-w-[240px] bg-white rounded-xl p-4 shadow hover:shadow-lg transition relative";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" class="w-32 h-32 object-contain mx-auto mt-6">
      <h3 class="text-[13px] font-medium mt-4 leading-snug">${p.title}</h3>

      <div class="flex items-center text-yellow-500 text-sm mt-2">
        ${productStars(p.rating)}
        <span class="text-gray-500 text-xs ml-2">${p.reviews} отзывов</span>
      </div>

      <div class="mt-2">
        ${p.old_price ? `<p class="text-gray-400 text-sm line-through">${fmt(p.old_price)} сум</p>` : ""}
        <p class="text-blue-600 text-lg font-bold">${fmt(p.price)} сум</p>
        ${p.installment ? `<p class="text-orange-500 text-sm font-medium border p-1">${p.installment}</p>` : ""}
      </div>
    `;
    container.appendChild(card);
  });
}

// ====== CART (KORZINKA) PAGE RENDER (if present) ======
function renderCartPage() {
  if (!els.shopCart) return;

  shop = storage.get("shop", []);
  els.shopCart.innerHTML = "";

  if (shop.length === 0) {
    els.shopCart.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center w-full py-10">
        <img class="w-40 mx-auto" src="./assets/empty.png" alt="">
        <h4 class="text-lg font-semibold mt-4">Korzinka bo'sh</h4>
        <p class="text-gray-500 text-sm">Mahsulot qo'shish uchun 🛒 ni bosing</p>
      </div>
    `;
    return;
  }

  shop.forEach((value) => {
    const row = document.createElement("div");
    row.className = "border-b py-4";
    row.innerHTML = `
      <div class="flex gap-5 md:flex-row">
        <div class="w-24 md:w-1/4 flex justify-center">
          <img src="${value.image}" alt="${value.title}" class="h-40 object-contain">
        </div>
        <div class="w-full md:w-3/4 mt-4 md:mt-0 md:pl-4">
          <div class="flex justify-between">
            <h3 class="font-semibold text-lg">${value.title}</h3>
            <button class="remove-item text-gray-400 hover:text-red-500" data-id="${value.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <p class="text-gray-500 text-sm mb-2">${value.brand || ""}</p>
          
          <div class="flex items-center mt-4 gap-6">
            <span class="text-blue-600 font-bold text-lg">${fmt(value.price)} сум</span>
            ${
              value.installment
                ? `<span class="ml-4 text-orange-500 text-sm font-medium border border-orange-200 px-2 py-1 rounded">
                     ${value.installment}
                   </span>`
                : ""
            }
          </div>
          
          <div class="flex items-center mt-6">
            <div class="flex items-center border rounded-lg">
              <button class="qty-dec px-3 py-1 text-gray-600 hover:bg-gray-100" data-id="${value.id}">-</button>
              <span class="px-4 py-1">${value.quantity || 1}</span>
              <button class="qty-inc px-3 py-1 text-gray-600 hover:bg-gray-100" data-id="${value.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `;
    els.shopCart.appendChild(row);
  });

  // Umumiy summa (ixtiyoriy)
  const total = shop.reduce(
    (acc, item) => acc + Number(item.price) * (item.quantity || 1),
    0
  );
  const totalBar = document.createElement("div");
  totalBar.className = "flex justify-end mt-4 font-semibold";
  totalBar.innerHTML = `<div>Jami: <span class="text-blue-600">${fmt(total)} сум</span></div>`;
  els.shopCart.appendChild(totalBar);
}

// Cart actions (minus/plus/remove) — event delegation
function wireCartDelegation() {
  if (!els.shopCart) return;

  els.shopCart.addEventListener("click", (e) => {
    const dec = e.target.closest(".qty-dec");
    const inc = e.target.closest(".qty-inc");
    const rmv = e.target.closest(".remove-item");

    if (dec || inc || rmv) {
      shop = storage.get("shop", []);
    }

    // Quantity --
    if (dec) {
      const id = String(dec.dataset.id);
      const item = shop.find((s) => idEq(s.id, id));
      if (item) {
        item.quantity = Math.max(1, (item.quantity || 1) - 1);
        storage.set("shop", shop);
        renderCartPage();
      }
      return;
    }
    // Quantity ++
    if (inc) {
      const id = String(inc.dataset.id);
      const item = shop.find((s) => idEq(s.id, id));
      if (item) {
        item.quantity = (item.quantity || 1) + 1;
        storage.set("shop", shop);
        renderCartPage();
      }
      return;
    }
    // Remove
    if (rmv) {
      const id = String(rmv.dataset.id);
      shop = shop.filter((s) => !idEq(s.id, id));
      storage.set("shop", shop);
      renderCartPage();
      return;
    }
  });
}

// ====== NAV BUTTONS (optional) ======
if (els.wishlistBtn) {
  els.wishlistBtn.addEventListener("click", () => {
    window.location.href = "./wishlist.html";
  });
}
if (els.cartBtn) {
  els.cartBtn.addEventListener("click", () => {
    window.location.href = "./korzinka.html";
  });
}

// ====== INIT ======
(async function init() {
  syncWishlistCount();
  await renderProducts();      // asosiy sahifa bo'lsa, mahsulotlarni chizadi
  wireProductsDelegation();    // like va shop uchun delegatsiya

  renderWishlistPage();        // agar wishlist sahifada bo'lsa, chizadi
  renderCartPage();            // agar korzinka sahifada bo'lsa, chizadi
  wireCartDelegation();        // korzinka sahifasidagi +/-/trash
})();
