let API = "https://68a5b0d72a3deed2960e7566.mockapi.io/todo/products";
let card = document.getElementById("card");
let shop_cart = document.getElementById("shop_cart");
let shop = JSON.parse(localStorage.getItem("shop")) || [];
const getData = async () => {
  const res = await fetch(API);
  const data = await res.json();
  return data;
};

getData().then((res) => addUI(res));

function addUI(data) {
  data.forEach((element) => {
    let div = document.createElement("div");
    div.innerHTML = `
         <div class="w-full relative">
          <img
            src=${element.img}
            alt=""
          />
          <div class="absolute top-1 right-1">
            <svg
              data-v-b4904ad2=""
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="ui-icon"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.5 5.5C5.26935 5.5 3.5 7.30906 3.5 9.5C3.5 10.4282 3.87684 11.4436 4.5487 12.5105C5.21692 13.5716 6.14148 14.6274 7.15127 15.6219C8.55769 17.007 10.0318 18.1879 11.1708 19.1003C11.4734 19.3427 11.7523 19.5661 12 19.7694C12.2477 19.5661 12.5266 19.3427 12.8292 19.1003C13.9682 18.1879 15.4423 17.007 16.8487 15.6219C17.8585 14.6274 18.7831 13.5716 19.4513 12.5105C20.1232 11.4436 20.5 10.4282 20.5 9.5C20.5 7.30898 18.7314 5.5 16.5 5.5C14.3473 5.5 13.0738 7.20226 12.7262 7.74742C12.3889 8.27655 11.6111 8.27653 11.2738 7.74742C10.9262 7.20225 9.65273 5.5 7.5 5.5ZM2 9.5C2 6.49094 4.43065 4 7.5 4C9.73143 4 11.2249 5.30207 12 6.21581C12.7751 5.30207 14.2686 4 16.5 4C19.5702 4 22 6.49102 22 9.5C22 10.8218 21.4706 12.1189 20.7206 13.3098C19.9669 14.5066 18.954 15.6539 17.9013 16.6906C16.4429 18.1269 14.808 19.4384 13.6502 20.3672C13.1649 20.7565 12.7634 21.0786 12.4939 21.3144C12.2111 21.5619 11.7889 21.5619 11.5061 21.3144C11.2366 21.0786 10.8351 20.7565 10.3498 20.3672C9.19201 19.4384 7.55712 18.1269 6.09873 16.6906C5.04602 15.6539 4.03308 14.5066 3.27942 13.3098C2.52941 12.1189 2 10.8218 2 9.5Z"
                fill="#141415"
              ></path>
            </svg>
          </div>
        </div>
        <div>
          <h3 class="text-[rgb(127_77_255)] text-[14px] font-bold">
            ${element.price.toLocaleString()} so'm
          </h3>
          <span class="bg-[#FFFF00] p-1 text-[11px] mt-3 rounded-[3px]"
            >${element.month.toLocaleString()} so'm/oyiga</span
          >
          <h2 class="text-[12px] my-2">
           ${element.description.slice(0, 50) + "..."}
          </h2>

          <div class="flex items-center gap-1 my-2">
            <svg
              data-v-96c69a2c=""
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              data-test-id="icon__rating-star"
              class="ui-icon rating-icon"
            >
              <path
                d="M6.32279 0.887954C6.11862 0.790604 5.88141 0.790604 5.67723 0.887954C5.50072 0.972112 5.4034 1.11823 5.35433 1.19839C5.30359 1.28126 5.25151 1.38682 5.20075 1.48972L4.12288 3.67336L1.71185 4.02577C1.59836 4.04233 1.48191 4.05933 1.38745 4.08204C1.29607 4.10402 1.12711 4.15154 0.992657 4.29346C0.837112 4.45765 0.76396 4.68325 0.793571 4.90747C0.819166 5.10129 0.928088 5.23891 0.989188 5.31033C1.05235 5.38415 1.13667 5.46625 1.21885 5.54626L2.96275 7.24481L2.55127 9.64395C2.53184 9.75707 2.51192 9.87312 2.50424 9.97001C2.49682 10.0637 2.48965 10.2392 2.583 10.411C2.69098 10.6098 2.88292 10.7492 3.10535 10.7905C3.29766 10.8261 3.4623 10.7651 3.54912 10.729C3.63889 10.6918 3.7431 10.637 3.84468 10.5835L6.00001 9.45005L8.15535 10.5835C8.25693 10.637 8.36114 10.6918 8.45091 10.729C8.53773 10.7651 8.70237 10.8261 8.89467 10.7905C9.11711 10.7492 9.30904 10.6098 9.41702 10.411C9.51037 10.2392 9.5032 10.0637 9.49578 9.97001C9.48811 9.87312 9.46818 9.75708 9.44876 9.64397L9.03727 7.24481L10.7812 5.54624C10.8634 5.46623 10.9477 5.38414 11.0108 5.31033C11.0719 5.23891 11.1809 5.10129 11.2065 4.90747C11.2361 4.68325 11.1629 4.45765 11.0074 4.29346C10.8729 4.15154 10.704 4.10402 10.6126 4.08204C10.5181 4.05933 10.4017 4.04233 10.2882 4.02577L7.87714 3.67336L6.7993 1.48976C6.74853 1.38686 6.69644 1.28127 6.6457 1.19839C6.59662 1.11823 6.4993 0.972112 6.32279 0.887954Z"
                fill="#FFB54C"
              ></path>
            </svg>
            <p class="text-[11px]">${element.rate}</p>
          </div>
        </div>
        <button
        id=${element.id}
          class="shop w-full h-[40px] rounded-xl bg-[rgb(127_77_255)] text-white"
        >
          Savatga
        </button>
        `;

    card.append(div);
  });

  let btns = document.querySelectorAll(".shop");
  btns.forEach((value) => {
    value.addEventListener("click", (e) => {
      let product = data.find((item) => item.id === e.target.id);
      if (shop.find((value) => value.id === e.target.id)) {
        return;
      }
      shop = [...shop, product];
      localStorage.setItem("shop", JSON.stringify(shop));
    });
  });
}

function addUiShop(data) {
  data.forEach((value) => {
    let div = document.createElement("div");
    div.innerHTML = `
            
        `;
    shop_cart.append(div);
  });
}

addUiShop(shop);

btns.addEventListener("click", function(){
  console.log("exxbiln")
})
