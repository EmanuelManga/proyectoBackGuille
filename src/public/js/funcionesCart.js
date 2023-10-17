const generarTicket = (id) => {
    const urlActual = "https://" + window.location.host + "/carts/" + id + "/purchase";
    $.ajax({
        type: "post",
        url: urlActual,
        // data: formData,
        success: function (response) {
            toast("El producto se a eliminadoo con exito!!", "success", "bottom-right");
        },
        error: function (xhr, status, error) {
            console.log(error);
            toast("Ha ocurrido un error!!", "error", "bottom-right");
        },
    });
};

const restProductCart = (id) => {
    // const url = "https://" + window.location.host + "/api/carts/product/" + id;
    const url = `/api/carts/subtract-product/${id}`;
    // console.log(url);
    $.ajax({
        type: "put",
        url: url,
        // data: formData,
        success: function (response) {
            // console.log("response", response);
            // updateQua(response.data, id);
            toast("El producto se a eliminadoo con exito!!", "success", "bottom-right");
            actualizarCantidad(response.data);
            removeCardIfZero(id, response);
        },
        error: function (xhr, status, error) {
            console.log(error);
            // cart_cant.value = cart_cant.value * 1 - 1;
            toast("Ha ocurrido un error!!", "error", "bottom-right");
        },
    });
};
const addProductCart = (id) => {
    // const url = "https://" + window.location.host + "/api/carts/product/" + id;
    const url = `/api/carts/add-product/${id}`;
    // console.log(url);
    $.ajax({
        type: "put",
        url: url,
        // data: formData,
        success: function (response) {
            // console.log("response", response);
            // updateQua(response.data, id);
            toast("El producto se a eliminadoo con exito!!", "success", "bottom-right");
            // const obj = { productId: response.data.productAdded.productId, quantity: response.data.productAdded.quantity, totalCost: response.data.totalCost };
            actualizarCantidad(response.data);
        },
        error: function (xhr, status, error) {
            console.log(error);
            // cart_cant.value = cart_cant.value * 1 - 1;
            toast("Ha ocurrido un error!!", "error", "bottom-right");
        },
    });
};

const actualizarCantidad = (product) => {
    // console.log("product", product);
    const cart_cont = document.getElementById(`cart-cont-${product.productAdded.productId}`);
    const totalCost = document.getElementById("cart-total-price");
    cart_cont.value = product.productAdded.quantity;
    totalCost.innerHTML = product.totalCost;
};

function removeCardIfZero(id, response) {
    const input = document.querySelector(`[data-cartValueId="${id}"]`);
    const card = document.getElementById(`card-cart-container-${id}`);

    if (input.value == 0) {
        card.remove();
    }
}
