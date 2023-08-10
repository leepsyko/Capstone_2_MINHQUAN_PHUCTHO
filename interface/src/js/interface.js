//======================= Import ======================================
// import APIs
import * as apiMethod from "../../../admin/src/services/productsAPI";

// default export
import consObject from "../../../admin/src/models/Products";

// ======utilities======
function getElement(selector) {
  return document.querySelector(selector);
}

function getElements(selector) {
  return document.querySelectorAll(selector);
}
// ====================== Global function================================

// DOM
let quantity = getElement(".quantity-product");
let bodyCartProduct = getElement("#offcanvas-body-product");
getInfoProducts();

// Get information
export function getInfoProducts() {
  apiMethod
    .apiGetProducts()
    .then((response) => {
      displayProducts(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
const carts = [];
// display
export function displayProducts(products) {
  let contentHTML = products.reduce((result, value, index) => {
    let itemProduct = new consObject(
      value.id,
      value.name,
      value.price.toLocaleString(),
      value.screen,
      value.backCamera,
      value.frontCamera,
      value.img,
      value.desc,
      value.type
    );

    let productsJson = JSON.stringify(products);
    localStorage.setItem("productsJson", productsJson);
    return (
      result +
      `
      <div class="col-4">
        <div class="product-item text-center">
          <div class="product-item-img">
            <img src="${itemProduct.image}" alt="" >
          </div>
          <div class="product-item-name">
            <h5>${itemProduct.name}</h5>
          </div>
          <div class="product-item-desc">
            <h5>${itemProduct.desc}</h5>
          </div>
          <div class="product-item-price">
            <h4>${itemProduct.price} VND</h4>
          </div>
          <div>
            <button class="btn btn-secondary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">Info</button>
            <button class="btn btn-light addCartProduct" data-id="${itemProduct.id}" data-img="${itemProduct.image}" data-name="${itemProduct.name}" data-price="${itemProduct.price}" data-index=${index}>Add</button>
          </div>
        </div>
      </div>

      </-- Modal -->
      <div
      class="modal fade"
      id="exampleModalToggle"
      aria-hidden="true"
      aria-labelledby="exampleModalToggleLabel"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalToggleLabel">
              ${itemProduct.name}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Màn hình: ${itemProduct.screen}</p>
            <p>Camera sau: ${itemProduct.backCamera}</p>
            <p>Camera trước: ${itemProduct.frontCamera}</p>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-danger"
              data-bs-target="#exampleModalToggle2"
              data-bs-toggle="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
      `
    );
  }, " ");

  document.getElementById("list-product").innerHTML = contentHTML;
  let productStorangeJson = localStorage.getItem("productsJson");
  let productsOb = JSON.parse(productStorangeJson);
  getElements(".addCartProduct").forEach((element) => {
    element.onclick = (event) => {
      const target = event.target;
      const id = target.getAttribute("data-id");
      const name = target.getAttribute("data-name");
      const image = target.getAttribute("data-img");
      const price = target.getAttribute("data-price");
      const index = target.getAttribute("data-index");
      if (carts[index] == null) {
        // copy product form list to list card
        carts[index] = JSON.parse(JSON.stringify(productsOb[index]));
        carts[index].quantity = 1;
        // getElement(".offcanvas-body-notice").style.display = "none";
        // getElement("#offcanvas-body-product").style.display = "block";
      } else {
        if (carts[index]) {
          carts[index].quantity++;
          carts[index].price = carts[index].quantity * productsOb[index].price;
          // getElement(".offcanvas-body-notice").style.display = "none";
          // getElement("#offcanvas-body-product").style.display = "block";
        }
      }
      reLoadCart();

      // document.querySelectorAll(".plusButton").forEach((button) => {
      //   button.addEventListener("click", (event) => {
      //     let b = event.target.getAttribute("data-index2");
      //     console.log(carts[b]);
      //     carts[b].quantity++;
      //     carts[b].price = carts[b].quantity * productsOb[b].price;
      //     reLoadCart();
      //   });
      // });
      // document.querySelectorAll(".minusButton").forEach((button) => {
      //   button.addEventListener("click", (event) => {
      //     let b = event.target.getAttribute("data-index2");
      //     carts[b].quantity--;
      //     carts[b].price = carts[b].quantity * productsOb[b].price;
      //     console.log(carts[b].quantity);
      //     if (carts[b].quantity == 0) {
      //       delete carts[b];
      //     }

      //     reLoadCart();
      //   });
      // });
      getElement(".quantity-product").style.display = "block";
    };
  });
}

getElement(".offcanvas-body").onclick = (event) => {
  let productStorangeJson = localStorage.getItem("productsJson");
  let productsOb = JSON.parse(productStorangeJson);
  const target = event.target;
  let id = target.getAttribute("id");
  let idData = target.getAttribute("data-id");
  getElement(`#plusButton-${idData}`).addEventListener("click", (event) => {
    let b = event.target.getAttribute("data-index2");
    carts[b].quantity++;
    carts[b].price = carts[b].quantity * productsOb[b].price;
    reLoadCart();
  });
};

function reLoadCart() {
  let bodyProduct = getElement("#offcanvas-body-product");
  bodyCartProduct.innerHTML = "";
  let count = 0;
  let totalPrice = 0;
  carts.forEach((value, index) => {
    count = count + value.quantity;
    totalPrice = totalPrice + value.price * 1;
    if (value != null) {
      getElement(".offcanvas-body-notice").style.display = "none";
      let newDiv = document.createElement("div");
      newDiv.innerHTML = `
          <div class="d-flex align-items-center my-2">
              <img src=${value.image} width="50px" height="50px" />
              <h5 class="mx-3 m-0">${value.name}</h5>
              <div class="d-flex">
                <button class="btn btn-light minusButton" id="minusButton-${value.id}" data-id="${value.id}" data-index2="${index}">-</button>
                <input id="quantity-${value.id}" value="${value.quantity}" class="cart-quantity"/>
                <button class="btn btn-light plusButton" id="plusButton-${value.id}" data-id="${value.id}" data-value="${value.quantity}" data-index2="${index}")">+</button>
              </div>
              <h6 class="mx-2 m-0">${value.price} Đ</h6>
              <button class="btn btn-danger text-center">X</button>
          </div>
      `;
      bodyProduct.appendChild(newDiv);
    }
  });
}
