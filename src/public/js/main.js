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

const login = () => {
    Swal.fire({
        title: "Login Form",
        html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
    <input type="password" id="password" class="swal2-input" placeholder="Password">`,
        confirmButtonText: "Sign in",
        focusConfirm: false,
        preConfirm: () => {
            const login = Swal.getPopup().querySelector("#login").value;
            const password = Swal.getPopup().querySelector("#password").value;
            if (!login || !password) {
                Swal.showValidationMessage(`Please enter login and password`);
            }
            return { login: login, password: password };
        },
    }).then((result) => {
        $.ajax({
            url: "http://localhost:8080/api/carts",
            type: "POST",
            // data: formData,
            success: function (response) {
                console.log(response);
                guardarDatosEnSessionStorage(result.value.login, response.data._id);
                // alert("¡Formulario enviado con éxito!");
                // Manejar la respuesta del servidor
            },
            error: function (error) {
                console.log(error);

                // Manejar errores de la solicitud
            },
        });
    });
};

const guardarDatosEnSessionStorage = (usuario, cartId) => {
    sessionStorage.setItem("usuario", usuario);
    sessionStorage.setItem("cartId", cartId);
};
