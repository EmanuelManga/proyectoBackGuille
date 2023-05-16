const borrarProductoHtml = (id) => {
    const urlActual = window.location.href + "/" + id;
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
