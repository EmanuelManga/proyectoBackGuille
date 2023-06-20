document.getElementById("product-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

    let title = document.getElementById("form-product-title").value;
    let description = document.getElementById("form-product-description").value;
    let price = document.getElementById("form-product-price").value;
    let thumbnail = document.getElementById("form-product-thumbnail").files[0];
    let code = document.getElementById("form-product-code").value;
    let stock = document.getElementById("form-product-stock").value;
    let status = document.getElementById("form-product-status").value;
    let category = document.getElementById("form-product-category").value;

    console.log("click");

    let formData = new FormData(this);
    console.log("FormData", formData);

    $.ajax({
        url: "../upload",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response.file);
            // alert("¡Formulario enviado con éxito!");
            toast("La imagen se cargo con exito!!", "success", "bottom-right");
            let obj = { title, description, price, thumbnail: response.file, code, stock, status, category };
            console.log("obj", obj);
            socket.emit("POST", {
                producto: obj,
            });
            // Manejar la respuesta del servidor
        },
        error: function (error) {
            console.log(error);
            toast("Hubo un error al cargar la imagen!!", "error", "bottom-right");
            // Manejar errores de la solicitud
        },
    });
});

const borrarProducto = (id) => {
    socket.emit("DELETE", {
        producto: id,
    });
};

const addCarritoLive = (pid) => {
    socket.emit("PUT", {
        pid,
    });
};

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
