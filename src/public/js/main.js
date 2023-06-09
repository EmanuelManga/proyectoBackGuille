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

// const login = () => {
//     Swal.fire({
//         title: "Login Form",
//         html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
//     <input type="password" id="password" class="swal2-input" placeholder="Password">`,
//         confirmButtonText: "Sign in",
//         focusConfirm: false,
//         preConfirm: () => {
//             const login = Swal.getPopup().querySelector("#login").value;
//             const password = Swal.getPopup().querySelector("#password").value;
//             if (!login || !password) {
//                 Swal.showValidationMessage(`Please enter login and password`);
//             }
//             return { login: login, password: password };
//         },
//     }).then((result) => {
//         const dato = { email: result.value.login, pass: result.value.password };
//         $.ajax({
//             url: "http://localhost:8080/auth/login",
//             type: "POST",
//             data: dato,
//             success: function (response) {
//                 console.log(response);
//                 // guardarDatosEnSessionStorage(result.value.login, response.data._id);
//                 // loginStyling(result.value.login, response.data._id);
//                 // alert("¡Formulario enviado con éxito!");
//                 // Manejar la respuesta del servidor
//             },
//             error: function (error) {
//                 console.log(error);

//                 // Manejar errores de la solicitud
//             },
//         });
//     });
// };

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
