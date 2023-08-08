const toggleView = (state) => {
    const singin = document.getElementById("singin");
    const login = document.getElementById("login");

    state ? ((singin.style.display = ""), (login.style.display = "none")) : ((singin.style.display = "none"), (login.style.display = ""));
};
