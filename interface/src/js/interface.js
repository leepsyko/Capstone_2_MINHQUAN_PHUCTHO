//======================= Import ======================================
// import APIs
import * as apiMethod from "../../../admin/src/services/productsAPI";

// default export
import consObject from "../../../admin/src/models/Products";

// ======utilities======
function getElement(selector) {
  return document.querySelector(selector);
}

// ====================== Global function================================

getInfoProducts();

// Get information
function getInfoProducts() {
  apiMethod
    .apiGetProducts()
    .then((response) => {
      console.log(response.data);
      displayProducts(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

// display
function displayProducts(products) {
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
            <h4>${itemProduct.price}</h4>
          </div>
          <div>
            <button class="btn btn-secondary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">Info</button>
            <button class="btn btn-light">Add</button>
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

  // getElement(".deletePro").onclick = (event) =>{
  //   console.log(event.target)
  // }
  document.getElementById("list-product").innerHTML = contentHTML;
}
