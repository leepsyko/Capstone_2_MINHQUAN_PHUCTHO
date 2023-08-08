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
  console.log(products);
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
    <td>
    <img src="${itemProduct.img}" width="100px" height="100px"></td>
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

  document.getElementById("tblDanhSachSP").innerHTML = contentHTML;
}

// Get information
function getInfoProducts() {
  apiMethod
    .apiGetProducts()
    .then((response) => {
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
  let product = validate();

  console.log(product.img);

  if (!product) {
    console.log("vào lỗi");
    return;
  }

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
  getElement("#upDate").onclick = (event) => {
    upDateProduct(event.target.getAttribute("data-id"));
  };
}

// upDate product information
async function upDateProduct(id) {
  let newProduct = {
    name: getElement("#TenSP").value,
    price: +getElement("#GiaSP").value,
    screen: +getElement("#ManHinhSP").value,
    backCamera: +getElement("#CameraBSP").value,
    frontCamera: +getElement("#CameraASP").value,
    img: getElement("#HinhSP").value,
    desc: getElement("#ThongtinSP").value,
    type: getElement("#loaiSP").value,
  };
  try {
    console.log("ddaau laf update");
    await apiMethod.apiUpdateProduct(id, newProduct);
    getInfoProducts();
    // hide modal popUp
    $("#myModal").modal("hide");
  } catch (error) {
    console.log(error);
  }
}

// ----------validate check information from form

// check input is empty
function isRequired(value) {
  // Check empty of input
  if (!value.trim()) {
    return false;
  }
  return true;
}

// check character is number

function isNumber(value) {
  if (isNaN(value)) {
    return false;
  }

  return true;
}

function validate() {
  let isValid = true;

  // dom
  let nameForm = getElement("#TenSP").value;
  let priceForm = getElement("#GiaSP").value;
  let screenForm = getElement("#ManHinhSP").value;
  let cameraBSPForm = getElement("#CameraBSP").value;
  let cameraASPForm = getElement("#CameraASP").value;
  let imageForm = getElement("#HinhSP").value;
  let infoForm = getElement("#ThongtinSP").value;
  let typeForm = getElement("#loaiSP").value;

  // Name of product
  if (!isRequired(nameForm)) {
    isValid = false;
    getElement("#spanName").innerHTML = "Không được để trống";
  } else {
    getElement("#spanName").innerHTML = "";
  }
  // Price of product
  if (!isRequired(priceForm)) {
    isValid = false;
    getElement("#spanPass").innerHTML = "Không được để trống";
  } else if (!isNumber(priceForm)) {
    isValid = false;
    getElement("#spanPass").innerHTML = "Nhập vào một số";
  } else {
    getElement("#spanPass").innerHTML = "";
  }
  // Screen of product
  if (!isRequired(screenForm)) {
    isValid = false;
    getElement("#spanScreen").innerHTML = "Không được để trống";
  } else if (!isNumber(screenForm)) {
    isValid = false;
    getElement("#spanScreen").innerHTML = "Nhập vào một số";
  } else {
    getElement("#spanScreen").innerHTML = "";
  }
  // BSP of product
  if (!isRequired(cameraBSPForm)) {
    isValid = false;
    getElement("#spanBSP").innerHTML = "Không được để trống";
  } else if (!isNumber(cameraBSPForm)) {
    isValid = false;
    getElement("#spanBSP").innerHTML = "Nhập vào một số";
  } else {
    getElement("#spanBSP").innerHTML = "";
  }
  // ASP of product
  if (!isRequired(cameraASPForm)) {
    isValid = false;
    getElement("#spanASP").innerHTML = "Không được để trống";
  } else if (!isNumber(cameraASPForm)) {
    isValid = false;
    getElement("#spanASP").innerHTML = "Nhập vào một số";
  } else {
    getElement("#spanASP").innerHTML = "";
  }
  // Image of product
  if (!isRequired(imageForm)) {
    isValid = false;
    getElement("#spanHinh").innerHTML = "Không được để trống";
  } else {
    getElement("#spanHinh").innerHTML = "";
  }
  // Info of product
  if (!isRequired(infoForm)) {
    isValid = false;
    getElement("#spanInfor").innerHTML = "Không được để trống";
  } else {
    getElement("#spanInfor").innerHTML = "";
  }
  // Type of product
  if (!isRequired(typeForm)) {
    isValid = false;
    getElement("#spanType").innerHTML = "Không được để trống";
  } else {
    getElement("#spanType").innerHTML = "";
  }

  if (isValid) {
    let product = {
      name: getElement("#TenSP").value,
      price: +getElement("#GiaSP").value,
      screen: +getElement("#ManHinhSP").value,
      backCamera: +getElement("#CameraBSP").value,
      frontCamera: +getElement("#CameraASP").value,
      img: getElement("#HinhSP").value,
      desc: getElement("#ThongtinSP").value,
      type: getElement("#loaiSP").value,
    };
    return product;
  }

  return isValid;
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

// button search name product
getElement("#basic-addon2").onclick = () => {
  let keyName = getElement("#txtSearch").value;
  keyName = keyName.trim().toLowerCase();

  try {
    apiMethod.apiGetProducts().then((response) => {
       let products = response.data;
      let newListName = products.filter((value) => {
        let nameProducts = value.name.trim().toLowerCase();
        return nameProducts.includes(keyName);
      });

      displayProducts(newListName);
    });
  } catch (error) {
    console.log(error);
  }
};

// sort product by price
getElement("#filterByPrice").onchange = () =>{
  
}
