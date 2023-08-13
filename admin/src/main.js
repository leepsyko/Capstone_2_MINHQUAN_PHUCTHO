//======================= Import ======================================
// import APIs
import * as apiMethod from "./../src/services/productsAPI";

// default export
import consObject from "../src/models/products";

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
    <tr>
    <td>${index + 1}</td>
    <td>${itemProduct.name}</td>
    <td>${itemProduct.price}</td>
    <td>${itemProduct.desc} <br> Camerasau: ${
        itemProduct.backCamera
      } <br> Camera trước: ${
        itemProduct.frontCamera
      } <br> Kích thước màn hình: ${itemProduct.screen} </td>
    <td><img src="${itemProduct.image}" width="100px" height="100px"></td>
    <td>${itemProduct.type}</td>
    <td>
    <button class="btn btn-primary" data-id="${
      itemProduct.id
    }" data-type="xem">Xem</button>
    </td>
    <td>
    <button class="btn btn-primary deletePro" data-id="${
      itemProduct.id
    }" data-type="xoa" >Xoá</button>
    </td>
    </tr>`
    );
  }, " ");

  // getElement(".deletePro").onclick = (event) =>{
  //   console.log(event.target)
  // }
  document.getElementById("tblDanhSachSP").innerHTML = contentHTML;
}

// backup
// function displayProducts(products) {
//   let contentHTML = products.reduce((result, value, index) => {
//     let itemProduct = new consObject(
//       value.id,
//       value.name,
//       value.price,
//       value.image,
//       value.type
//     );
//     return (
//       result +
//       `
//     <tr>
//     <td>${index + 1}</td>
//     <td>${itemProduct.name}</td>
//     <td>${itemProduct.price}</td>
//     <td><img src="${itemProduct.image}" width="100px" height="100px"></td>
//     <td>${itemProduct.type}</td>
//     <td>
//     <button class="btn btn-primary" onclick="selectProduct(${
//       itemProduct.id
//     })">Xem</button>
//     </td>
//     <td>
//     <button class="btn btn-primary" class="deletePro" onclick="deleteProduct(${
//       itemProduct.id
//     })">Xoá</button>
//     </td>
//     </tr>`
//     );
//   }, " ");

//   document.getElementById("tblDanhSachSP").innerHTML = contentHTML;

//   // getElement(".deletePro").onclick = (event) => {
//   //   console.log(event.target)
//   // }
// }

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
  console.log("hê");
  let product = {
    name: getElement("#TenSP").value,
    price: +getElement("#GiaSP").value,
    screen: +getElement("#ManHinhSP").value,
    backCamera: +getElement("#CameraBSP").value,
    frontCamera: +getElement("#CameraASP").value,
    image: getElement("#HinhSP").value,
    desc: getElement("#ThongtinSP").value,
    type: getElement("#loaiSP").value,
  };
  try {
    await apiMethod.apiCreateProduct(product);
    getInfoProducts();
  } catch (error) {
    console.log(error);
  }
  $("#myModal").modal("hide");
}

// Áp dụng kĩ thuật even delegation
getElement("#tblDanhSachSP").onclick = (event) => {
  let element = event.target;
  let idButton = element.getAttribute("data-id");
  let typeButton = element.getAttribute("data-type");

  if (typeButton === "xoa") {
    deleteProduct(idButton);
  } else if (typeButton === "xem") {
    showProduct(idButton);
  }
};

// Delete
async function deleteProduct(id) {
  try {
    await apiMethod.apiDeleteProduct(id);
    getInfoProducts();
  } catch (error) {
    console.log(error);
  }
}

// Show a Product
async function showProduct(id) {
  $("#myModal").modal("show");

  getElement(".modal-title").innerHTML = "Cập nhật sản phẩm";
  getElement(".modal-footer").innerHTML = `
  <button class="btn btn-secondary" data-dismiss="modal">Huỷ</button>
    <button class="btn btn-success" id="upDate" data-id="${id}">Cập nhật</button>
      `;

  try {
    let product = await (await apiMethod.apiGetProductByID(id)).data;

    getElement("#TenSP").value = product.name;
    getElement("#GiaSP").value = product.price;
    getElement("#ManHinhSP").value = product.screen;
    getElement("#CameraBSP").value = product.backCamera;
    getElement("#CameraASP").value = product.frontCamera;
    getElement("#HinhSP").value = product.img;
    getElement("#ThongtinSP").value = product.desc;
    getElement("#loaiSP").value = product.type;

    console.log(product.type);
  } catch (error) {
    console.log(error);
  }

  // event delegation with upDate function
getElement("#upDate").onclick = (event)=>{
  upDateProduct(event.target.getAttribute("data-id"))

}

}

// upDate product information
async function upDateProduct(id) {

  let newProduct = {
    name: getElement("#TenSP").value,
    price: +getElement("#GiaSP").value,
    screen: +getElement("#ManHinhSP").value,
    backCamera: +getElement("#CameraBSP").value,
    frontCamera: +getElement("#CameraASP").value,
    image: getElement("#HinhSP").value,
    desc: getElement("#ThongtinSP").value,
    type: getElement("#loaiSP").value,
  };
  try {
    console.log("ddaau laf update")
    await apiMethod.apiUpdateProduct(id,newProduct);
    getInfoProducts();
     // hide modal popUp
  $("#myModal").modal("hide");
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

// reset form 

function resetForm() {
  getElement("#TenSP").value = "";
  getElement("#GiaSP").value = "";
  getElement("#ManHinhSP").value = "";
  getElement("#CameraBSP").value = "";
  getElement("#CameraASP").value = "";
  getElement("#HinhSP").value = "";
  getElement("#ThongtinSP").value = "";
  getElement("#loaiSP").value = "";
}

//===================DOM==================

getElement("#btnThemSP").onclick = () => {
  resetForm();
  getElement(".modal-title").innerHTML = "Thêm sản phẩm ";
  getElement(".modal-footer").innerHTML = `
  <button class="btn btn-secondary" data-dismiss="modal">Huỷ</button>
    <button class="btn btn-success" id="add">Thêm</button>
      `;
  getElement("#add").onclick = createProduct;
};

// onclick for delete
// getElement(".deletePro").onclick = (event) =>{
//   console.log(event.target)
// }

//  getElement(".deletePro").onclick = (event) =>{
//     console.log(event.target)
//   }
