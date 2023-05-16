const borrarProductoHtml = (id) => {
    const urlActual = window.location.href + "/" + id;
    // console.log("urlActual", urlActual);

    $.ajax({
        type: "DELETE",
        url: urlActual,
        // data: formData,
        success: function (response) {
            alert("¡Producto eliminadoo con exito!");
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
    });
};

$(document).ready(function () {
    $("#product-form").submit(function (event) {
        event.preventDefault(); // Evita la recarga de la página

        let formData = $(this).serialize();
        const urlActual = window.location.href;

        $.ajax({
            type: "POST",
            url: urlActual,
            data: formData,
            success: function (response) {
                alert("¡Formulario enviado con éxito!");
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });
});
