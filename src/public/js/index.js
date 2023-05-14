//FRONT
const socket = io();

socket.on("msg_back_to_front", (data) => {
    console.log(data);
});

socket.on("response-post", (data) => {
    let producto = data.msg.producto;
    let lista = document.getElementById("lista-product");
    lista.innerHTML += `<div id="product-${producto.producId}" class="card"  style="width: 18rem;">
                            <img class="card-img-top" src="${producto.thumbnail}" alt="Card image cap" />
                            <div class="card-body">
                                <h5 class="card-title">${producto.title}</h5>
                                <p class="card-text">${producto.description}</p>
                                <p class="card-text">Precio:${producto.price}</p>
                                <p class="card-text">Stock:${producto.stock}</p>
                            </div>
                            <button type="button" class="btn btn-danger" onclick="borrarProducto('${producto.producId}')">Delete</button>
                            </div>`;
});

socket.on("response-post-error", (data) => {
    console.log(data);
});

socket.on("response-delete-error", (data) => {
    console.log(data);
});

socket.on("response-delete", (data) => {
    let id = data.msg;
    let elemento = document.getElementById(`product-${id}`);
    elemento.remove();
});
