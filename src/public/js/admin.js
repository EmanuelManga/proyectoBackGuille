const borrarInactivos = () => {
    fetch("http://" + window.location.host + "/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            toast("Se borraron los inactivos correctamente!!", "success", "bottom-right");
            window.location.reload();
        })
        .catch((err) => toast("Ha ocurrido un error!!", "error", "bottom-right"));
};

const borrarUsuario = (id) => {
    fetch("http://" + window.location.host + "/api/users/" + id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            toast("Se borro el usuario correctamente!!", "success", "bottom-right");
            window.location.reload();
        })
        .catch((err) => toast("Ha ocurrido un error!!", "error", "bottom-right"));
};

const toggleIsAdmin = (id) => {
    fetch("http://" + window.location.host + "/api/users/" + id + "/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.data);
            // toast("El estado es Admin es " + data.data.isAdmin + "!!", "success", "bottom-right");
            window.location.reload();
        })
        .catch((err) => toast("Ha ocurrido un error!!", "error", "bottom-right"));
};

const editRole = (id) => {
    let input = document.getElementById("role-" + id);
    if (input.hasAttribute("disabled")) {
        input.removeAttribute("disabled");
    } else {
        input.setAttribute("disabled", true);
    }
};

const setRole = (id) => {
    fetch("http://" + window.location.host + "/api/users/" + id + "/role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: document.getElementById("role-" + id).value }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.data);
            // toast("El estado es Admin es " + data.data.isAdmin + "!!", "success", "bottom-right");
            window.location.reload();
        })
        .catch((err) => toast("Ha ocurrido un error!!", "error", "bottom-right"));
};
