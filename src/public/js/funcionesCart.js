const generarTicket = (id) => {
    const urlActual = "http://" + window.location.host + "/carts/" + id + "/purchase";
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

// const addProductCart = (id) => {
//     let cart_cont = document.getElementById(id);
//     cart_cont.value = cart_cont.value * 1 + 1;
// };
const restProductCart = (id) => {
    let cart_cont = document.getElementById(id);
    cart_cont.value = cart_cont.value * 1 - 1;
};

const addProductCart = (id) => {
    const cart_cant_id = `cart-cont-${id}`;
    let cart_cant = document.getElementById(cart_cant_id);
    cart_cant.value = cart_cant.value * 1 + 1;
    const url = "http://" + window.location.host + "/api/carts/product/" + id;
    console.log(url);
    $.ajax({
        type: "put",
        url: url,
        // data: formData,
        success: function (response) {
            // console.log("response", response);
            // updateQua(response.data, id);
            toast("El producto se a eliminadoo con exito!!", "success", "bottom-right");
        },
        error: function (xhr, status, error) {
            console.log(error);
            cart_cant.value = cart_cant.value * 1 - 1;
            toast("Ha ocurrido un error!!", "error", "bottom-right");
        },
    });
};

// const addProductCart = (id) => {
// const url = "http://" + window.location.host + "/api/carts/product/" + id;
// let cart_cont = document.getElementById(id);
// cart_cont.value = cart_cont.value * 1 - 1;
//     $.ajax({
//         type: "post",
//         url: urlActual,
//         // data: formData,
//         success: function (response) {
//             toast("El producto se a eliminadoo con exito!!", "success", "bottom-right");
//         },
//         error: function (xhr, status, error) {
//             console.log(error);
//             toast("Ha ocurrido un error!!", "error", "bottom-right");
//         },
//     });
// };
