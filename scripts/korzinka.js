let shop = JSON.parse(localStorage.getItem("shop")) || [];
let shopContainer = document.querySelector(".shop-card");

function renderShop(products) {
  shopContainer.innerHTML = ""; // eski narsalarni tozalaymiz
  
  if (products.length === 0) {
    shopContainer.innerHTML = `<p class="text-gray-500">Ваша корзина пуста 😢</p>`;
    return;
  }

  products.forEach((p) => {
    shopContainer.innerHTML += `
      <div class="flex items-center justify-between border-b pb-4 mb-4">
         <div class="flex items-center gap-4">
           <img src="${p.image}" alt="${p.title}" class="w-20 h-20 object-cover rounded-lg">
           <div>
             <h3 class="font-semibold">${p.title}</h3>
             <p class="text-gray-500">${p.price} сум</p>
           </div>
         </div>
         <button class="remove bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg" data-id="${p.id}">
           Удалить
         </button>
      </div>
    `;
  });

  // ❌ o‘chirish tugmalari
  document.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let id = e.currentTarget.dataset.id;
      shop = shop.filter((item) => item.id != id);
      localStorage.setItem("shop", JSON.stringify(shop));
      renderShop(shop); // qaytadan chizish
    });
  });
}

renderShop(shop);
