import axios from "axios";




// API get data of whole products
export function apiGetProducts(searchValue) {
  return axios({
    url: `https://64a6ad22096b3f0fcc8043cf.mockapi.io/products`,
    method: "GET",
    param: {
      name: searchValue || undefined,
    },
  });
}


// API get data of a product

export function apiGetProductByID(productId){
    return axios({
        url: `https://64a6ad22096b3f0fcc8043cf.mockapi.io/products/${productId}`,
        method: "GET"
    })
}


// API create product from object
export function apiCreateProduct(product) {
    return axios({
        url: "https://64a6ad22096b3f0fcc8043cf.mockapi.io/products",
        method: "POST",
        data: product,
    })
}

// API update information of product 
export function apiUpdateProduct(productId,newProduct) {
    return axios({
        url: `https://64a6ad22096b3f0fcc8043cf.mockapi.io/products/${productId}`,
        method: "PUT",
        data: newProduct,
    })
}


// API remove product
export function apiDeleteProduct(productId) {
    return axios({
        url: `https://64a6ad22096b3f0fcc8043cf.mockapi.io/products/${productId}`,
        method: "DELETE",
    })
}