const API = "https://fakestoreapi.com/products";
    let products = [];

    function getWishlist() {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    }

    function setWishlist(list) {
      localStorage.setItem("wishlist", JSON.stringify(list));
    }

    function likeButtons() {
      document.querySelectorAll(".like-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const title = btn.dataset.title;
          let wishlist = getWishlist();
          const exists = wishlist.find(p => p.title === title);
          if (exists) {
            wishlist = wishlist.filter(p => p.title !== title);
          } else {
            const product = products.find(p => p.title === title);
            wishlist.push(product);
          }
          setWishlist(wishlist);
          addUI();
        });
      });
    }

    function renderScroll(items) {
      const container = document.querySelector(".products-wrapper");
      if (!container) return;
      container.innerHTML = "";

      items.forEach(p => {
        const card = document.createElement("div");
        card.className = "min-w-[240px] bg-white rounded-xl p-4 shadow hover:shadow-lg transition relative";

        let stars = "";
        for (let i = 1; i <= 5; i++) {
          stars += i <= Math.round(p.rating?.rate || 3)
            ? `<i class="fa-solid fa-star" style="color: #FFD43B;"></i>`
            : `<i class="fa-regular fa-star" style="color: #FFD43B;"></i>`;
        }

        const wishlist = getWishlist();
        const isLiked = wishlist.find(item => item.title === p.title);

        card.innerHTML = `
          <div class="absolute top-3 right-3">
            <button class="like-btn bg-white p-1 rounded" data-title="${p.title}">
              <i class="${isLiked ? "fa-solid text-red-500" : "fa-regular"} fa-heart"></i>
            </button>
          </div>
          <img src="${p.image}" alt="${p.title}" class="w-32 h-32 object-contain mx-auto mt-6">
          <h3 class="text-[13px] font-medium mt-4 leading-snug">${p.title}</h3>
          <p class="text-blue-600 text-lg font-bold">${p.price.toLocaleString()} $</p>
          <div class="flex items-center gap-1">${stars}</div>
        `;

        container.appendChild(card);
      });

      likeButtons();
    }

    function renderGrid(items) {
      const container = document.querySelector(".products-grid-wrapper");
      if (!container) return;
      container.innerHTML = "";

      items.forEach(p => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-xl p-4 shadow hover:shadow-lg transition relative";

        let stars = "";
        for (let i = 1; i <= 5; i++) {
          stars += i <= Math.round(p.rating?.rate || 3)
            ? `<i class="fa-solid fa-star" style="color: #FFD43B;"></i>`
            : `<i class="fa-regular fa-star" style="color: #FFD43B;"></i>`;
        }

        const wishlist = getWishlist();
        const isLiked = wishlist.find(item => item.title === p.title);

        card.innerHTML = `
          <div class="absolute top-3 right-3">
            <button class="like-btn bg-white p-1 rounded" data-title="${p.title}">
              <i class="${isLiked ? "fa-solid text-red-500" : "fa-regular"} fa-heart"></i>
            </button>
          </div>
          <img src="${p.image}" alt="${p.title}" class="w-32 h-32 object-contain mx-auto mt-6">
          <h3 class="text-sm font-medium mt-4 leading-snug">${p.title}</h3>
          <p class="text-blue-600 text-lg font-bold">${p.price.toLocaleString()} $</p>
          <div class="flex items-center gap-1">${stars}</div>
        `;

        container.appendChild(card);
      });

      likeButtons();
    }

    async function addUI() {
      try {
        let res = await fetch(API);
        products = await res.json();

        renderScroll(products.slice(0, 10));
        renderGrid(products);
      } catch (err) {
        console.error("Xatolik:", err);
      }
    }

    addUI();