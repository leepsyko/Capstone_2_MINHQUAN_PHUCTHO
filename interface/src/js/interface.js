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
let carts = [];
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
      <div class="col-lg-4 col-md-6">
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
            <h4>${itemProduct.price} $</h4>
          </div>
          <div>
            <button class="btn btn-secondary" data-bs-target="#modal1-${itemProduct.id}" data-bs-toggle="modal">Info</button>
            <button class="btn btn-light addCartProduct" data-id="${itemProduct.id}" data-img="${itemProduct.image}" data-name="${itemProduct.name}" data-price="${itemProduct.price}" data-index=${index}>Add</button>
          </div>
        </div>
      </div>

      </-- Modal -->
      <div
      class="modal fade"
      id="modal1-${itemProduct.id}"
      aria-hidden="true"
      aria-labelledby="modal2-${itemProduct.id}"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="modal2-${itemProduct.id}">
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
  let productStoreJson = localStorage.getItem("productsJson");
  let productsOb = JSON.parse(productStoreJson);
  getElements(".addCartProduct").forEach((element) => {
    element.onclick = (event) => {
      const target = event.target;
      // const id = target.getAttribute("data-id");
      // const name = target.getAttribute("data-name");
      // const image = target.getAttribute("data-img");
      // const price = target.getAttribute("data-price");
      const index = target.getAttribute("data-index");
      if (carts[index] == null) {
        // copy product form list to list card
        carts[index] = JSON.parse(JSON.stringify(productsOb[index]));
        carts[index].quantity = 1;
      } else {
        if (carts[index]) {
          carts[index].quantity++;
          carts[index].price = carts[index].quantity * productsOb[index].price;
        }
      }
      // getElement(".quantity-product").style.display = "block";
      reLoadCart();
    };
  });
}

getElement(".offcanvas-body").onclick = (event) => {
  let productStoreJson = localStorage.getItem("productsJson");
  let productsOb = JSON.parse(productStoreJson);
  let target = event.target;
  let id = target.getAttribute("id");
  let idData = target.getAttribute("data-id");
  let dataIndex = getElement(`#plusButton-${idData}`).getAttribute(
    "data-index2"
  );
  if (target.getAttribute("data-type") == "plus") {
    carts[dataIndex].quantity++;
    carts[dataIndex].price =
      carts[dataIndex].quantity * productsOb[dataIndex].price;
  } else if (target.getAttribute("data-type") == "minus") {
    if (carts[dataIndex].quantity == 1) {
      delete carts[dataIndex];
    } else {
      carts[dataIndex].quantity--;
      carts[dataIndex].price =
        carts[dataIndex].quantity * productsOb[dataIndex].price;
    }
  } else if (target.getAttribute("data-type") == "delete") {
    delete carts[dataIndex];
  }
  if (carts[dataIndex] == null) {
    getElement(".offcanvas-body-notice").style.display = "block";
    getElement(".offcanvas-footer").style.display = "none";
  }
  reLoadCart();
};

//Delete item

function reLoadCart() {
  console.log(carts);
  let bodyProduct = getElement("#offcanvas-body-product");
  let offcanvasFooter = document.querySelector(".offcanvas-footer");
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
              <h5 class="mx-1 m-0">${value.name}</h5>
              <div class="d-flex justify-content-center">
                <button class="btn btn-light minusButton" id="minusButton-${
                  value.id
                }" data-id="${
        value.id
      }" data-index2="${index}" data-type="minus" >-</button>
                <input id="quantity-${value.id}" value="${
        value.quantity
      }" class="cart-quantity" />
                <button class="btn btn-light plusButton" id="plusButton-${
                  value.id
                }" data-id="${
        value.id
      }" data-index2="${index}" data-type="plus" >+</button>
              </div>
              <h6 class="mx-1 m-0">${value.price.toLocaleString()}</h6>
              <button class="btn btn-danger text-center deleteButton" id="deleteButton-${
                value.id
              }" data-id="${
        value.id
      }" data-index2="${index}" data-type="delete">X</button>
          </div>
      `;
      bodyProduct.appendChild(newDiv);
    }
    offcanvasFooter.style.display = "block";
    offcanvasFooter.innerHTML = `<p class="text-white">Total: ${totalPrice.toLocaleString()} $</p>`;
  });
  updateCartQuantity();
}
function updateCartQuantity() {
  const totalQuantity = carts.reduce((total, product) => {
    return total + (product ? product.quantity : 0);
  }, 0);

  const quantityElement = getElement(".quantity-product");
  quantityElement.textContent = totalQuantity.toString();

  // Hiển thị hoặc ẩn phần tử quantity-product dựa trên số lượng sản phẩm
  if (totalQuantity > 0) {
    quantityElement.style.display = "block";
  } else {
    quantityElement.style.display = "none";
  }
}

//====================DOM

getElement("#pills-profile-tab").onclick = async () => {
  try {
    let newProducts = (await apiMethod.apiGetProducts()).data;
    newProducts = newProducts.filter((value) => value.type === "iphone 14");
    let contentHTML = newProducts.reduce((result, value, index) => {
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

      let productsJson = JSON.stringify(newProducts);
      localStorage.setItem("productsJson", productsJson);
      return (
        result + `
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
              <button class="btn btn-secondary" data-bs-target="#modal3-${itemProduct.id}" data-bs-toggle="modal">Info</button>
              <button class="btn btn-light addCartProduct" data-id="${itemProduct.id}" data-type="addProduct" data-img="${itemProduct.image}" data-name="${itemProduct.name}" data-price="${itemProduct.price}" data-index=${index}>Add</button>
            </div>
          </div>
        </div>
  
        </-- Modal -->
        <div
        class="modal fade"
        id="modal3-${itemProduct.id}"
        aria-hidden="true"
        aria-labelledby="modal4-${itemProduct.id}"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="modal4-${itemProduct.id}">
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

    document.getElementById("iphone14").innerHTML = contentHTML;

    let productStoreJson = localStorage.getItem("productsJson");
    let productsOb = JSON.parse(productStoreJson);

    getElements(".addCartProduct").forEach((element) => {
      element.onclick = (event) => {
        const target = event.target;
        const dataType = target.getAttribute("data-type");
        const id = target.getAttribute("data-id");
        const index = target.getAttribute("data-index");
        let newCarts = [];

        if (dataType === "addProduct") {
          let found = carts.find((item) => item.id === id);
          console.log(found);
          if (found) {
            newCarts = carts.map((item) => {
              if (item.id === id) {
                return { ...item, quantity: item.quantity + 1 };
              }

              return item;
            });
            carts = [...newCarts];
            console.log("đã có sản phẩm trong giỏ hàng", carts);
          } else {
            let itemNew = { ...productsOb[index], quantity: 1 };
            carts.push(itemNew);
            console.log("lần đầu thêm sản phẩm", carts);
          }
        }
        reLoadCart();
        getElement(".quantity-product").style.display = "block";
      };
    });
  } catch (error) {
    console.log(error);
  }
};

getElement("#pills-contact-tab").onclick = async () => {
  try {
    let newProducts = (await apiMethod.apiGetProducts()).data;
    newProducts = newProducts.filter((value) => value.type === "iphone 13");
    console.log(newProducts);

    let contentHTML = newProducts.reduce((result, value, index) => {
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

      let productsJson = JSON.stringify(newProducts);
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
              <button class="btn btn-secondary" data-bs-target="#modal3-${itemProduct.id}" data-bs-toggle="modal">Info</button>
              <button class="btn btn-light addCartProduct" data-id="${itemProduct.id}" data-type="addProduct" data-img="${itemProduct.image}" data-name="${itemProduct.name}" data-price="${itemProduct.price}" data-index=${index}>Add</button>
            </div>
          </div>
        </div>
  
        </-- Modal -->
        <div
        class="modal fade"
        id="modal3-${itemProduct.id}"
        aria-hidden="true"
        aria-labelledby="modal4-${itemProduct.id}"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="modal4-${itemProduct.id}">
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

    document.getElementById("iphone13").innerHTML = contentHTML;

    let productStoreJson = localStorage.getItem("productsJson");
    let productsOb = JSON.parse(productStoreJson);

    getElements(".addCartProduct").forEach((element) => {
      element.onclick = (event) => {
        const target = event.target;
        const dataType = target.getAttribute("data-type");
        const id = target.getAttribute("data-id");
        const index = target.getAttribute("data-index");
        let newCarts = [];

        if (dataType === "addProduct") {
          let found = carts.find((item) => item.id === id);
          console.log(found);
          if (found) {
            newCarts = carts.map((item) => {
              if (item.id === id) {
                return { ...item, quantity: item.quantity + 1 };
              }

              return item;
            });
            carts = [...newCarts];
            console.log("đã có sản phẩm trong giỏ hàng", carts);
          } else {
            let itemNew = { ...productsOb[index], quantity: 1 };
            carts.push(itemNew);
            console.log("lần đầu thêm sản phẩm", carts);
          }
        }
        reLoadCart();
        getElement(".quantity-product").style.display = "block";
      };
    });
  } catch (error) {
    console.log(error);
  }
};

getElement("#pills-home-tab").onclick = () => {
 getInfoProducts();
};
