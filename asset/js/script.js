// ---------- nenbar toggle js ---------- //
const navbarToggle = document.querySelector(".navbar-toggle");
const navbarMenu = document.querySelector(".nav-links");

navbarToggle.addEventListener("click", () => {
  navbarToggle.classList.toggle("active");
  navbarMenu.classList.toggle("active");
});

// ---------- slider js ---------- //
if (document.getElementsByClassName("splide").length > 0) {
  document.addEventListener("DOMContentLoaded", function () {
    var splide = new Splide(".splide", {
      type: "loop",
      autoplay: "play",
      perPage: 1,
      pagination: false,
    });

    var thumbnails = document.getElementsByClassName("thumbnail");
    var current;

    for (var i = 0; i < thumbnails.length; i++) {
      initThumbnail(thumbnails[i], i);
    }

    function initThumbnail(thumbnail, index) {
      thumbnail.addEventListener("click", function () {
        splide.go(index);
      });
    }

    splide.on("mounted move", function () {
      var thumbnail = thumbnails[splide.index];

      if (thumbnail) {
        if (current) {
          current.classList.remove("is-active");
        }

        thumbnail.classList.add("is-active");
        current = thumbnail;
      }
    });
    splide.mount();
  });
}

// ---------- payment option js ---------- //
document.addEventListener("DOMContentLoaded", function () {
  const codRadio = document.querySelectorAll(
    'input[type="radio"][name="text"]'
  )[0]; // Cash on delivery
  const onlineRadio = document.querySelectorAll(
    'input[type="radio"][name="text"]'
  )[1]; // Pay online

  const onlineSection = document.querySelector(".online-payment-section");
  const payOnlineOption = document.querySelectorAll(
    'input[type="radio"][name="online"]'
  )[0]; // Pay online option
  const cardOption = document.querySelectorAll(
    'input[type="radio"][name="online"]'
  )[1]; // Card option

  const payWithApp = document.querySelector(".pay-with-app");
  const cardFillBox = document.querySelector(".card-fill-box");

  // Hide both initially
  if (onlineSection) {
    onlineSection.style.display = "none";
  }
  if (payWithApp) {
    payWithApp.style.display = "none";
  }
  if (cardFillBox) {
    cardFillBox.style.display = "none";
  }

  // Main payment method change
  if (codRadio) {
    codRadio.addEventListener("change", () => {
      if (codRadio.checked) {
        onlineSection.style.display = "none";
        payWithApp.style.display = "none";
        cardFillBox.style.display = "none";
        payOnlineOption.checked = false;
        cardOption.checked = false;
      }
    });
  }

  if (onlineRadio) {
    onlineRadio.addEventListener("change", () => {
      if (onlineRadio.checked) {
        onlineSection.style.display = "block";
      }
    });
  }

  // Pay online inner options
  if (payOnlineOption) {
    payOnlineOption.addEventListener("change", () => {
      if (payOnlineOption.checked) {
        payWithApp.style.display = "block";
        cardFillBox.style.display = "none";
        cardOption.checked = false;
      }
    });
  }

  if (cardOption) {
    cardOption.addEventListener("change", () => {
      if (cardOption.checked) {
        cardFillBox.style.display = "block";
        payWithApp.style.display = "none";
        payOnlineOption.checked = false;
      }
    });

    cardOption.addEventListener("change", () => {
      if (cardOption.checked) {
        cardFillBox.style.display = "block";
        payWithApp.style.display = "none";
        payOnlineOption.checked = false;

        // Uncheck all app radio buttons
        const appRadios = document.querySelectorAll('input[name="app online"]');
        appRadios.forEach((r) => (r.checked = false));
      }
    });
  }
});

// page---------- variables ---------- //
const cartDOM = document.querySelector(".cart-table");
const cartItems = document.querySelector(".product-card");
const cartTotal = document.querySelector(".cart-totals");
const cartContent = document.querySelector(".cart-table-body");
const productsDOM = document.querySelector(".product-container");

// cart
let cart = [];
// buttons
let buttonsDOM = [];

// getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("../../products.json");
      let data = await result.json();

      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
        <div class="product-card">
        <div class="product-img">
          <img src=${product.image}>
        </div>
        <div class="product-description">
          <a href="cart.html">${product.title}</a>
          <span class="product-price">
            <span class="price-symbol">₹</span>
            <span class="price-whole">${product.price}</span>
          </span>
          <div class='product-btn-box'>
            <button class="product-btn" data-id=${product.id}>Buy now</button>
          </div>
        </div>
      </div>
      `;
    });
    if (productsDOM) {
      productsDOM.innerHTML = result;
    }
  }
  getProductButtons() {
    const buttons = [...document.querySelectorAll(".product-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // get product from products
        let cartItem = { ...Storage.getProduct(id) };
        // add product to the cart
        cart = [...cart, cartItem];
        // save cart in local storage
        Storage.saveCart(cart);
        // set cart values
        // display cart item
        this.addCartItem(cartItem);
      });
    });
  }
  addCartItem(item) {
    const tr = document.createElement("tr");
    tr.classList.add(".product-detail-row");
    tr.innerHTML = `
           <td class="cart-product-detail">
              <div class="cart-product-img">
                <img src=${item.image} alt="">
              </div>
            </td>
            <td class="cart-product-detail">
              <div class="cart-product-item-name">
                <span>Shoes</span>
                <p>
                  ${item.title}
                </p>
              </div>
            </td>
            <td class="cart-product-detail">
              <div class="cart-product-price">
                <span>₹</span>
                <span>${item.price}</span>
              </div>
            </td>
            <td class="cart-product-detail">
              <div class="cart-product-total">
                <span>₹</span>
                <span>${item.price}</span>
              </div>
            </td>
            <td class="cart-product-detail">
              <div class="cart-product-remove-btn">
                <button data-id=${item.id}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"
                    fill="#FFFFFF">
                    <path
                      d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                  </svg>
                </button>
              </div>
            </td>
           `;
    cartContent.appendChild(tr);
    console.log(cartContent);
  }
}
// local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getProductButtons();
    });
});
