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
