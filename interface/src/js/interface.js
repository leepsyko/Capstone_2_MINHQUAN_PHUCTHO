//======================= Import ======================================
// import APIs
import * as apiMethod from "../../../admin/src/services/productsAPI";

// default export
import consObject from "../../../admin/src/models/Products";
getInfoProducts();
// ======utilities======
function getElement(selector) {
  return document.querySelector(selector);
}
// ====================== Global function================================

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
  let contentHTML = products.reduce((result, value) => {
    let itemProduct = new consObject(
      value.id,
      value.name,
      value.price,
      value.image,
      value.type
    );
    return (
      result +
      `
        <div class="col-4 product-item">
            <div product-img>
                <img src"${products.image}" alt="phone"/>
            </div>
            <div class="product-name">${products.name}</div>
        </div>
      `
    );
  }, " ");
  document.getElementById("pills-home").innerHTML = contentHTML;
}
