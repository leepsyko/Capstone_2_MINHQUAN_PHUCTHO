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
      value.price,
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
        <div class="product-item">
        <img src="${itemProduct.image}" alt="">
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
