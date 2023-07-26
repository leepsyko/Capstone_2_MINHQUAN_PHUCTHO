// import APIs
import * as apiMethod from "./../services/productsAPI.js";

// default export
import consObject from "../models/products.js";

// ======utilities======
function getElement(selector) {
  return document.querySelector(selector);
}

// ===== Global function===

function displayProducts(products) {
  let contentHTML = products.reduce((result, value, index) => {
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
    <tr>
    <td>${index + 1}</td>
    <td>${itemProduct.name}</td>
    <td>${itemProduct.price}</td>
    <td><img src="${itemProduct.image}" width="100px" height="100px"></td>
    <td>${itemProduct.type}</td>
    <td>
    <button class="btn btn-primary" onclick="selectProduct(${
      itemProduct.id
    })">Xem</button>
    </td>
    <td>
    <button class="btn btn-primary" onclick="deleteProduct(${
      itemProduct.id
    })">Xoá</button>
    </td>
    </tr>`
    );
  }, " ");

  document.getElementById("tblDanhSachSP").innerHTML = contentHTML;
}

//===== display to interface ======
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

getInfoProducts();
