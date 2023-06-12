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

const btnNextPrev = (pagination) => {
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    console.log(pagination);
    const url = window.location.href;
    let pagina = obtenerNumeroPagina(url);
    // let newUrl = quitarNumeroPagina(url);
    console.log("pagina", pagina);
    let nextP = pagina.position + 1;
    let prevP = pagina.position - 1;
    console.log(nextP, prevP);
    pagina.position == 1 ? (btnPrev.classList.add("aDisable"), btnPrev.setAttribute("href", "#")) : (btnPrev.classList.remove("aDisable"), btnPrev.setAttribute("href", pagina.url + prevP));
    pagina.position == pagination ? (btnNext.classList.add("aDisable"), btnNext.setAttribute("href", "#")) : (btnNext.classList.remove("aDisable"), btnNext.setAttribute("href", pagina.url + nextP));
};

const obtenerNumeroPagina = (url) => {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const page = params.get("page");
    console.log("casa", page);
    let respuesta = { position: null, url: null };
    if (page) {
        respuesta.position = parseInt(page);
        respuesta.url = quitarNumeroPagina(url) + "?page=";
    } else {
        respuesta.position = 1;
        respuesta.url = url + "?page=";
    }

    return respuesta;
};

const quitarNumeroPagina = (url) => {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    params.delete("page");
    urlObj.search = params.toString();
    console.log("quitar n", urlObj.toString());

    return urlObj.toString();
};

const agregarCarrito = (productId) => {
    const session = recuperarDatosDelSessionStorage();
    if (session.cartId) {
        console.log(`http://localhost:8080/api/carts/${session.cartId}/product/${productId}`);
        $.ajax({
            url: `http://localhost:8080/api/carts/${session.cartId}/product/${productId}`,
            type: "POST",
            success: function (response) {
                console.log(response);
                // alert("¡Formulario enviado con éxito!");
                toast("El producto se agrego al carrito con exito!!", "success", "bottom-right");
                // Manejar la respuesta del servidor
            },
            error: function (error) {
                console.log(error);
                toast("Ha ocurrido un error!!", "error", "bottom-right");
                // Manejar errores de la solicitud
            },
        });
    }
};
