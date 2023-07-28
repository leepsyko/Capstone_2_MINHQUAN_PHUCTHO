//======================= Import ======================================
// import APIs
import * as apiMethod from "./../src/services/productsAPI.js";

// default export
import consObject from "../src/models/products.js";

// ======utilities======
function getElement(selector) {
  return document.querySelector(selector);
}

// ====================== Global function================================
// display
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

getInfoProducts();

// Create new Product
async function createProduct() {
  let product = {
    name: getElement("#TenSP").value,
    price: +getElement("#GiaSP").value,
    image: getElement("#HinhSP").value,
    type: getElement("#loaiSP").value,
  };
  try {
    let add = await apiMethod.apiCreateProduct(product);
    console.log("hello")
  } catch (error) {
    console.log(error);
  }
}

// ----------validate check information from form

function isRequired(value) {
  // Check empty of input
  if (!value.trim) {
    return false;
  }
  return true;
}

function validate() {
  let isValid = true;

  let spanSubtitle1 = (document.createElement("span").textContent =
    "Không được để trống");
  let spanSubtitle2 = (document.createElement("span").textContent =
    "Không hợp lệ");

  // dom
  let nameForm = getElement("#TenSP").value;
  let priceForm = +getElement("#GiaSP").value;
  let image = getElement("HinhSP").value;
  let typeForm = getElement("loaiSP").value;

  // Name of product
  if (!isRequired(nameForm)) {
    isValid = false;
    getElement(".form-group").insertAfter(spanSubtitle1, getElement("#TenSP"));
  }
}
//===================DOM==================

getElement("#btnThemSP").onclick = () => {
  getElement(".modal-title").innerHTML = "Thêm sản phẩm ";
  getElement(".modal-footer").innerHTML = `
  <button class="btn btn-secondary" data-dismiss="modal">Huỷ</button>
    <button class="btn btn-success" onclick="createProduct()">Thêm</button>
      `;
};
