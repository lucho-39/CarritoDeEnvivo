const contenedorCarrito = document.getElementById("cart-container");
const cantidadElement = document.getElementById("cantidad");
const precioElement = document.getElementById("precio");
const carritoVacioElement = document.getElementById("carrito-vacio");
const reiniciarCarritoElement = document.getElementById("reiniciar");
const comprarCarritoElement = document.getElementById("Comprar");

/** Crea las tarjetas de productos teniendo en cuenta lo guardado en localstorage */
function crearTarjetasProductosCarrito() {
    contenedorCarrito.innerHTML = "";
    const productos = JSON.parse(localStorage.getItem("bicicletas"));
    if (productos && productos.length > 0) {
        productos.forEach(producto => {
            const nuevaBicicleta = document.createElement("div");
            nuevaBicicleta.classList = "tarjeta-producto";
            nuevaBicicleta.innerHTML = `
            <img src="${escapeHtml(producto.urlimagen || './img/productos/' + producto.id + '.jpg')}" alt="Bicicleta ${escapeHtml(producto.nombre)}">
            <h3>${escapeHtml(producto.nombre)}</h3>
            <p>$${escapeHtml(producto.precio)}</p>
            <div>
                <button>-</button>
                <span class="cantidad">${escapeHtml(producto.cantidad)}</span>
                <button>+</button>
            </div>
        `;
            contenedorCarrito.appendChild(nuevaBicicleta);
            nuevaBicicleta
                .getElementsByTagName("button")[1]
                .addEventListener("click", () => {
                    agregarAlCarrito(producto);
                    crearTarjetasProductosCarrito();
                    actualizarTotales();
                });
            nuevaBicicleta
                .getElementsByTagName("button")[0]
                .addEventListener("click", () => {
                    restarAlCarrito(producto);
                    crearTarjetasProductosCarrito();
                    actualizarTotales();
                });
        });
    }
    revisarMensajeVacio();
}

/** Actualiza el total de precio y unidades de la página del carrito */
function actualizarTotales() {
    const productos = JSON.parse(localStorage.getItem("bicicletas"));
    let unidades = 0;
    let precio = 0;
    if (productos && productos.length > 0) {
        productos.forEach((producto) => {
            unidades += producto.cantidad;
            precio += producto.precio * producto.cantidad;
        });
    }
    cantidadElement.innerText = unidades;
    precioElement.innerText = precio;
}

/** Muestra o esconde el mensaje de que no hay nada en el carrito */
function revisarMensajeVacio() {
    const productos = JSON.parse(localStorage.getItem("bicicletas"));
    carritoVacioElement.classList.toggle(
        "escondido",
        Boolean(productos && productos.length > 0)
    );
}

/** Reinicia el carrito y vuelve a dibujar la página */
function reiniciarCarrito() {
    localStorage.removeItem("bicicletas");
    crearTarjetasProductosCarrito();
    actualizarTotales();
}

reiniciarCarritoElement.addEventListener("click", reiniciarCarrito);

comprarCarritoElement.addEventListener("click", async () => {
    if (await comprarCarrito()) {
        reiniciarCarrito();
        window.location.href = "compra-exitosa.html";
    } else if (USAR_API) {
        alert("No se pudo completar la compra. Intentá de nuevo.");
    }
});

crearTarjetasProductosCarrito();
actualizarTotales();
