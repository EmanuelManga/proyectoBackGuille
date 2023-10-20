const toast = (text, icon, position) => {
    let body = document.getElementById("body-main");
    Swal.fire({
        text: text,
        target: "#body-main",
        icon: icon,
        // customClass: {
        //     container: "position-absolute",
        // },
        toast: true,
        showConfirmButton: false,
        position: position,
    });
};

const logOut = () => {
    $.ajax({
        url: "/auth/logout",
        type: "GET",
        success: function (response) {
            console.log(response);
            window.location.reload();
            // Manejar la respuesta del servidor
        },
        error: function (error) {
            console.log(error);
            toast("Hubo un error al cargar la imagen!!", "error", "bottom-right");
            // Manejar errores de la solicitud
        },
    });
};

const btnCart = () => {
    window.location.href = "/carts";
};

const bajarChat = () => {
    if (document.getElementById("chatSection")) {
        console.log("entre");
        const chatSection = document.getElementById("chatSection");
        chatSection.scrollTop = chatSection.scrollHeight;
    }
};

const guardarDatosEnSessionStorage = (usuario, cartId) => {
    sessionStorage.setItem("usuario", usuario);
    sessionStorage.setItem("cartId", cartId);
};

const loginStyling = (user, cid) => {
    const btnLogIn = document.getElementById("btnLogIn");
    const aCarrito = document.getElementById("a-carrito");
    const dropdownMenuButton2 = document.getElementById("dropdownMenuButton2");
    const contenedorUsuario = document.getElementById("contenedor-usuario");
    aCarrito.setAttribute("href", "http://localhost:8080/carts/" + cid);
    btnLogIn.style.display = "none";
    contenedorUsuario.style.display = "";
    dropdownMenuButton2.textContent = user;
};

const logOutStyling = () => {
    sessionStorage.clear();
    const btnLogIn = document.getElementById("btnLogIn");
    const aCarrito = document.getElementById("a-carrito");
    const dropdownMenuButton2 = document.getElementById("dropdownMenuButton2");
    const contenedorUsuario = document.getElementById("contenedor-usuario");
    aCarrito.setAttribute("href", "");
    btnLogIn.style.display = "";
    contenedorUsuario.style.display = "none";
    dropdownMenuButton2.textContent = "";
};

function verificarExistencia() {
    const usuarioExiste = sessionStorage.getItem("usuario");
    const cartIdExiste = sessionStorage.getItem("cartId");

    console.log("usuarioExiste,cartIdExiste", usuarioExiste, cartIdExiste);
    if (usuarioExiste != null && cartIdExiste != null) {
        console.log("entre");
        loginStyling(usuarioExiste, cartIdExiste);
    } else {
        console.log("no entre");
        logOutStyling();
    }
}

// verificarExistencia();
bajarChat();

addEventListener("DOMContentLoaded", () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
});

function guardarEnLocalStorage(clave, valor) {
    localStorage.setItem(clave, valor);
}

function obtenerDeLocalStorage(clave) {
    return localStorage.getItem(clave);
}

function enviarArchivo() {
    const form = document.querySelector("#upload-profile-pict");

    const formData = new FormData(form);
    console.log("FormData", formData);

    fetch("http://localhost:8080/upload-profile-picture", {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (response.ok) {
                //toast("La imagen de perfil se modifico correctamente!!", "success", "bottom-right");
                window.location.reload();
                //console.log('Archivo enviado exitosamente');
                // Manejar la respuesta del servidor
            } else {
                toast("Ha ocurrido un error!!", "error", "bottom-right");
                //console.error('Error al enviar el archivo');
                // Manejar errores de la solicitud
            }
        })
        .catch((error) => {
            console.error("Error al enviar el archivo", error);
            // Manejar errores de la solicitud
        });
}
