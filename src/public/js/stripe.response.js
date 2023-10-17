const stripe = Stripe("pk_test_51NzeI7Ewsblfmvmo69I6HbPZ4EGYU5FL9tW3Aky0RAWn4DbJBvz6QSUodD9y4lJLnVH5RAAwhaE3G3xIeQvpu4sO00chZdsvsu");

checkStatus();

async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

    if (!clientSecret) {
        return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
        case "succeeded":
            // showMessage("Payment succeeded!");
            await generarTicket2();
            break;
        case "processing":
            // showMessage("Your payment is processing.");
            break;
        case "requires_payment_method":
            document.getElementById("compra-fallo").removeAttribute("hidden");
            // showMessage("Your payment was not successful, please try again.");
            break;
        default:
            document.getElementById("compra-error").removeAttribute("hidden");
            // showMessage("Something went wrong.");
            break;
    }
}

const generarTicket2 = async (email) => {
    const urlActual = "https://" + window.location.host + "/carts/purchase";
    const email_ticket_pago = obtenerDeLocalStorage("email_ticket_pago");

    fetch("https://" + window.location.host + "/carts/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email_ticket_pago }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("data", data);
            // toast("El producto se a eliminadoo con exito!!", "success", "bottom-right");
            document.getElementById("compra-exitosa").removeAttribute("hidden");
        })
        .catch((err) => toast("Ha ocurrido un error!!", "error", "bottom-right"));
};
