//FRONT
const socket = io();

// socket.on("msg_back_to_front", (data) => {
//     console.log(data);
// });

// socket.on("response-post", (data) => {
//     let producto = data.msg.producto;
//     let lista = document.getElementById("lista-product");
//     lista.innerHTML += `<div id="product-${producto.producId}" class="card"  style="width: 18rem;">
//                             <img class="card-img-top" src="${producto.thumbnail}" alt="Card image cap" />
//                             <div class="card-body">
//                                 <h5 class="card-title">${producto.title}</h5>
//                                 <p class="card-text">${producto.description}</p>
//                                 <p class="card-text">Precio:${producto.price}</p>
//                                 <p class="card-text">Stock:${producto.stock}</p>
//                             </div>
//                             <button type="button" class="btn btn-danger" onclick="borrarProducto('${producto.producId}')">Delete</button>
//                             </div>`;
// });

const handleEnter = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        addMessage();
    }
};

const addMessage = () => {
    const message = document.getElementById("textAreaChat").value;

    const chatSection = document.getElementById("chatSection");

    chatSection.innerHTML += `<div class="cs-message-emisor">${message}</div>`;

    chatSection.scrollTop = chatSection.scrollHeight;

    socket.emit("addMessage", {
        message,
    });
};

socket.on("response-post", (data) => {
    console.log("response-post", data);
    // let producto = JSON.parse(JSON.stringify(data.msg));
    let producto = data.msg;
    console.log("producto", producto);
    let lista = document.getElementById("table-product-body");
    lista.innerHTML += `<tr id="product-${producto._id}" >
                            <td>${producto._id}</td>
                            <td>${producto.title}</td>
                            <td>${producto.code}</td>
                            <td>${producto.description}</td>
                            <td>${producto.price}</td>
                            <td>${producto.stock}</td>
                            <td><img class="" src="${producto.thumbnail}" /></td>
                            <td><button type="button" class="btn btn-danger" onclick="borrarProducto('${producto._id}')"><i class="bi bi-trash3-fill"></i></button></td>
                        </tr>`;
});

socket.on("response-post-error", (data) => {
    console.log(data);
    toast("Ha ocurrido un error!!", "error", "bottom-right");
});

socket.on("response-post-toast", (data) => {
    console.log(data);
    toast("El producto se a cargado con exito!!", "success", "bottom-right");
});
socket.on("response-addCart-toast", (data) => {
    console.log(data);
    toast("El producto se agregado el producto al carrito con exito!!", "success", "bottom-right");
});
socket.on("response-addCart-error", (data) => {
    console.log(data);
    toast(data.msg.msg, "error", "bottom-right");
});

socket.on("response-delete-error", (data) => {
    console.log(data);
    toast("Ha ocurrido un error!!", "error", "bottom-right");
});

socket.on("response-delete", (data) => {
    let id = data.msg;
    let elemento = document.getElementById(`product-${id}`);
    elemento.remove();
});

socket.on("response-delete-toast", (data) => {
    toast("El producto se a eliminado con exito!!", "success", "bottom-right");
});

function recuperarDatosDelSessionStorage() {
    var usuario = sessionStorage.getItem("usuario");
    var cartId = sessionStorage.getItem("cartId");

    if (!usuario || !cartId) {
        toast("No se encuantra logeado", "error", "bottom-right");
        return false;
    } else {
        return { usuario, cartId };
    }
}

socket.on("response-addMessage-error", (data) => {
    console.log(data);
    toast("Ha ocurrido un error!!", "error", "bottom-right");
});

socket.on("response-addMessage-toast", (data) => {
    console.log(data.msg);
    const chatSection = document.getElementById("chatSection");
    chatSection.innerHTML += `<div class="cs-message-receptor">${data.msg.data}</div>`;
    chatSection.scrollTop = chatSection.scrollHeight;

    // toast("El producto se agregado el producto al carrito con exito!!", "success", "bottom-right");
});
