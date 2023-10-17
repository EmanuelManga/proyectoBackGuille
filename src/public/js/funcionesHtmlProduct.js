const borrarProductoHtml = (id) => {
    const urlActual = removeQueryString(window.location.href) + "/" + id;
    // console.log("urlActual", urlActual);
    $.ajax({
        type: "DELETE",
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

function removeQueryString(url) {
    const pattern = /\/products\?.*$/;
    return url.replace(pattern, "/products");
}

$(document).ready(function () {
    $("#product-form").submit(function (event) {
        event.preventDefault();

        let formData = new FormData(this);
        const urlActual = window.location.href;

        $.ajax({
            url: urlActual,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log(response);
                // alert("¡Formulario enviado con éxito!");
                toast("El producto se a cargado con exito!!", "success", "bottom-right");
                // Manejar la respuesta del servidor
            },
            error: function (error) {
                console.log(error);
                toast("Ha ocurrido un error!!", "error", "bottom-right");
                // Manejar errores de la solicitud
            },
        });
    });
});

// const btnNextPrev = (pagination) => {
//     const btnPrev = document.getElementById("btnPrev");
//     const btnNext = document.getElementById("btnNext");
//     console.log(pagination);
//     const url = window.location.href;
//     let pagina = obtenerNumeroPagina(url);
//     // let newUrl = quitarNumeroPagina(url);
//     console.log("pagina", pagina);
//     let nextP = pagina.position + 1;
//     let prevP = pagina.position - 1;
//     console.log(nextP, prevP);
//     pagina.position == 1 ? (btnPrev.classList.add("aDisable"), btnPrev.setAttribute("href", "#")) : (btnPrev.classList.remove("aDisable"), btnPrev.setAttribute("href", pagina.url + prevP));
//     pagina.position == pagination ? (btnNext.classList.add("aDisable"), btnNext.setAttribute("href", "#")) : (btnNext.classList.remove("aDisable"), btnNext.setAttribute("href", pagina.url + nextP));
// };

// const obtenerNumeroPagina = (url) => {
//     const urlObj = new URL(url);
//     const params = new URLSearchParams(urlObj.search);
//     const page = params.get("page");
//     console.log("casa", page);
//     let respuesta = { position: null, url: null };
//     if (page) {
//         respuesta.position = parseInt(page);
//         respuesta.url = quitarNumeroPagina(url) + "?page=";
//     } else {
//         respuesta.position = 1;
//         respuesta.url = url + "?page=";
//     }

//     return respuesta;
// };

// const quitarNumeroPagina = (url) => {
//     const urlObj = new URL(url);
//     const params = new URLSearchParams(urlObj.search);
//     params.delete("page");
//     urlObj.search = params.toString();
//     console.log("quitar n", urlObj.toString());

//     return urlObj.toString();
// };

const agregarCarrito = (productId) => {
    $.ajax({
        url: `/api/carts/products/${productId}`,
        type: "PUT",
        success: function (response) {
            console.log("response", response);
            // alert("¡Formulario enviado con éxito!");
            toast("El producto se agrego al carrito con exito!!", "success", "bottom-right");
            llenarCarrito(response.data.result, response.data.totalCost);

            // Manejar la respuesta del servidor
        },
        error: function (error) {
            console.log(error);
            if (error.responseJSON.msg) {
                toast(error.responseJSON.msg, "error", "bottom-right");
            } else {
                toast("Ha ocurrido un error!!", "error", "bottom-right");
            }
            // Manejar errores de la solicitud
        },
    });
    // }
};

const redirectDetalle = (id) => {
    window.location.href = `products/detalle/${id}`;
};

const llenarCarrito = (carts, total) => {
    console.log(total);

    let carro = "";

    carts.forEach((cart) => {
        // console.log(cart);
        let product = `<div class="card-cart mb-3" id="card-cart-container-${cart._id}">
                            <div class="row g-0" id="card-cart-${cart._id}">
                                <div class="container-img col-md-4" style="background-image: url(https://proyecto-backend-emanuel-m.onrender.com/pictures/${cart.thumbnail})">
                                    <!-- <img class="cart-img" src="flaca.webp" alt="" /> -->
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title">${cart.title}</h5>
                                        <div>
                                            <ul class="pagination">
                                                <li class="page-item">
                                                    <button class="page-link" onclick="restProductCart('${cart._id}')">
                                                        <span aria-hidden="true">-</span>
                                                    </button>
                                                </li>
                                                <li class="page-item"><input type="number" min="1" step="1" name="" value="${cart.quantity}" id="cart-cont-${cart._id}" data-cartValueId="${cart._id}" class="page-link page-link-input" readonly /></li>
                                                <li class="page-item">
                                                    <button class="page-link" onclick="addProductCart('${cart._id}')">
                                                        <span aria-hidden="true">+</span>
                                                    </button>
                                                </li>
                                                </ul>
                                                <h3>$ ${cart.total}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

        carro += product;
    });

    // console.log("carro", carro);

    document.getElementById("container-cart").innerHTML = carro;
    document.getElementById("cart-total-price").innerHTML = total;
};
