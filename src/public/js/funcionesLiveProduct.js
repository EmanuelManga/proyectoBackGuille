// socket.emit("msg_front_to_back", {
//     msg: Date.now() + " hola desde el front al socket",
// });

document.getElementById("product-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional
    // console.log("entre en el prevent");

    let title = document.getElementById("form-product-title").value;
    let description = document.getElementById("form-product-description").value;
    let price = document.getElementById("form-product-price").value;
    let thumbnail = document.getElementById("form-product-thumbnail").value;
    let code = document.getElementById("form-product-code").value;
    let stock = document.getElementById("form-product-stock").value;
    let status = document.getElementById("form-product-status").value;
    let category = document.getElementById("form-product-category").value;

    let obj = { title, description, price, thumbnail, code, stock, status, category };

    socket.emit("POST", {
        producto: obj,
    });
});

const borrarProducto = (id) => {
    socket.emit("DELETE", {
        producto: id,
    });
};
