// import fetch from "node-fetch";

// This is your test publishable API key.
const stripe = Stripe("pk_test_51NzeI7Ewsblfmvmo69I6HbPZ4EGYU5FL9tW3Aky0RAWn4DbJBvz6QSUodD9y4lJLnVH5RAAwhaE3G3xIeQvpu4sO00chZdsvsu");

let elements;

checkStatus();

const payButton = (cartId) => {
    fetch("https://" + window.location.host + "/api/carts/" + cartId)
        .then((res) => res.json())
        .then(async (data) => {
            // console.log(data);
            let emailActual = await getemail();

            if (data.data.length > 0) {
                const myModal = new bootstrap.Modal(document.getElementById("modalPasarelaPago"), {
                    backdrop: true,
                });

                myModal.show();
                await initialize(emailActual);
                await checkStatus();
                // console.log(emailActual);
            } else {
                toast("No hay ningunn producto en el carrito", "error", "bottom-right");
            }
            // document.getElementById("Field-emailInput").value = emailActual;
        })
        .catch((err) => toast("Ha ocurrido un error!!", "error", "bottom-right"));
};

const getemail = async () => {
    let result;
    await fetch("https://" + window.location.host + "/api/sessions/current")
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data) {
                // document.getElementById("Field-emailInput").value = data.data.email;
                result = data.data.email;
            }
        });
    return result;
};

document.querySelector("#payment-form").addEventListener("submit", handleSubmit);

let emailAddress = "";
// Fetches a payment intent and captures the client secret
async function initialize() {
    const response = await fetch("/api/payments/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(),
    });
    const { clientSecret } = await response.json();

    const appearance = {
        theme: "stripe",
    };
    elements = stripe.elements({ appearance, clientSecret });

    const linkAuthenticationElement = elements.create("linkAuthentication");
    linkAuthenticationElement.mount("#link-authentication-element");
    // console.log("linkAuthenticationElement", linkAuthenticationElement);

    linkAuthenticationElement.on("change", (event) => {
        // event.value.email = email;
        emailAddress = event.value.email;
        guardarEnLocalStorage("email_ticket_pago", emailAddress);
    });

    const paymentElementOptions = {
        layout: "tabs",
    };

    const paymentElement = elements.create("payment", paymentElementOptions);
    paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: "https://" + window.location.host + "/payment/after-payment",
            receipt_email: emailAddress,
        },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message);
    } else {
        showMessage("An unexpected error occurred.");
    }

    setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

    if (!clientSecret) {
        return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
        case "succeeded":
            showMessage("Payment succeeded!");
            await generarTicket2();
            break;
        case "processing":
            showMessage("Your payment is processing.");
            break;
        case "requires_payment_method":
            showMessage("Your payment was not successful, please try again.");
            break;
        default:
            showMessage("Something went wrong.");
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
        })
        .catch((err) => toast("Ha ocurrido un error!!", "error", "bottom-right"));
};

// ------- UI helpers -------

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;
}

// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}
