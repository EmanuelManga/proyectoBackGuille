const generarTicket = (id) => {
    const urlActual = window.location.href + "/" + id + "/purchase";
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
