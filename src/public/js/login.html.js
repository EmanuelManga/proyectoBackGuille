const quitarNav = () => {
    const nav = document.getElementById("contenedor-menu");
    nav.style.display = "none";
};

quitarNav();

const toggleView = (state) => {
    const singin = document.getElementById("singin");
    const login = document.getElementById("login");

    state ? ((singin.style.display = ""), (login.style.display = "none")) : ((singin.style.display = "none"), (login.style.display = ""));
};
