const API = "https://68a5b0d72a3deed2960e7566.mockapi.io/todo/products";
let products = [];

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
        ${p.discount ? `
        <span class="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">
          ${p.discount}
        </span>` : ""}

        <div class="absolute top-3 right-3 flex flex-col gap-2">
          <button class="like-btn bg-white hover:bg-gray-100 p-1 rounded" data-title="${p.title}">
            <i class="${isLiked ? "fa-solid" : "fa-regular"} fa-heart ${isLiked ? "text-red-500" : ""}"></i>
          </button>
        </div>

        <img src="${p.image}" alt="${p.title}" class="w-32 h-32 object-contain mx-auto mt-6">

        <h3 class="text-[13px] font-medium mt-4 leading-snug">${p.title}</h3>

        <div class="flex items-center text-yellow-500 text-sm mt-2">
          ${stars}
          <span class="text-gray-500 text-xs ml-2">${p.reviews} отзывов</span>
        </div>

        <div class="mt-2">
          ${p.old_price ? `<p class="text-gray-400 text-sm line-through">${p.old_price.toLocaleString()} сум</p>` : ""}
          <p class="text-blue-600 text-lg font-bold">${p.price.toLocaleString()} сум</p>
          ${p.installment ? `<p class="text-orange-500 text-sm font-medium border p-1">${p.installment}</p>` : ""}
        </div>

        <div class="flex items-center gap-2 mt-4">
          <button class="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition">
            Купить в один клик
          </button>
          <button class="add-to-cart bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition cursor-pointer">
            🛒
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    likeButtons();
  } catch (err) {
    console.error("Xatolik:", err);
  }
}

addUI();

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
        btn.querySelector("i").className = "fa-regular fa-heart"; // oq yurak
        btn.querySelector("i").classList.remove("text-red-500");
      } else {
        wishlist.push(product);
        btn.querySelector("i").className = "fa-solid fa-heart text-red-500"; // qizil yurak
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

      <div class="flex items-center text-yellow-500 text-sm mt-2">
        ${stars}
        <span class="text-gray-500 text-xs ml-2">${p.reviews} отзывов</span>
      </div>

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
wishlistBtn.addEventListener("click", function () {
  window.location.href = "./wishlist.html";
});

renderWishlist();


let wishlistCount = document.getElementById("wishlist-count")
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
wishlistCount.textContent = wishlist.length;



let karzinkaBtn = document.getElementById("karzinka-btn");
karzinkaBtn.addEventListener("click", function () {
  window.location.href = "./korzinka.html";
});


function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
