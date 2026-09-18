const cuentaCarritoElement = document.getElementById("cuenta-carrito");

/** Toma un objeto producto, le agrega cantidad 1 y lo devuelve clonado */
function getNuevoProductoParaMemoria(producto) {
    return { ...producto, cantidad: 1 };
}

/** Agrega un producto al carrito y devuelve la cantidad resultante */
function agregarAlCarrito(producto) {
    const memoria = JSON.parse(localStorage.getItem("bicicletas"));
    // Reviso si el producto ya está en el carrito.
    let cuenta = 0;
    // Si no hay nada guardado, creo el carrito con el producto.
    if (!memoria) {
        const nuevoProducto = getNuevoProductoParaMemoria(producto);
        localStorage.setItem("bicicletas", JSON.stringify([nuevoProducto]));
        cuenta = 1;
    } else {
        const indiceProducto = memoria.findIndex(bicicleta => bicicleta.id === producto.id);
        // Si el producto no está en el carrito lo agrego.
        if (indiceProducto === -1) {
            memoria.push(getNuevoProductoParaMemoria(producto));
            cuenta = 1;
        } else {
            // Si el producto ya está en el carrito le sumo 1 a la cantidad.
            memoria[indiceProducto].cantidad++;
            cuenta = memoria[indiceProducto].cantidad;
        }
        localStorage.setItem("bicicletas", JSON.stringify(memoria));
    }
    actualizarNumeroCarrito();
    return cuenta;
}

/** Resta una unidad de un producto del carrito */
function restarAlCarrito(producto) {
    const memoria = JSON.parse(localStorage.getItem("bicicletas"));
    // Si no hay carrito guardado no hay nada que restar.
    if (!memoria) {
        return;
    }
    const indiceProducto = memoria.findIndex(bicicleta => bicicleta.id === producto.id);
    // Si el producto no está en el carrito no hay nada que restar.
    if (indiceProducto === -1) {
        return;
    }
    if (memoria[indiceProducto].cantidad === 1) {
        memoria.splice(indiceProducto, 1);
    } else {
        memoria[indiceProducto].cantidad--;
    }
    localStorage.setItem("bicicletas", JSON.stringify(memoria));
    actualizarNumeroCarrito();
}

/** Actualiza el número del carrito del header */
function actualizarNumeroCarrito() {
    const memoria = JSON.parse(localStorage.getItem("bicicletas"));
    const cuenta = memoria ? memoria.reduce((acum, current) => acum + current.cantidad, 0) : 0;
    cuentaCarritoElement.innerText = cuenta;
}

/** Resuelve la compra del carrito; devuelve true si se completó */
async function comprarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("bicicletas"));
    if (!carrito || carrito.length === 0) {
        return false;
    }
    // En modo local la compra se resuelve sin backend.
    if (!USAR_API) {
        return true;
    }
    // Al servidor solo le mandamos id y cantidad: los precios los valida él.
    const items = carrito.map(producto => ({
        id: producto.id,
        cantidad: producto.cantidad
    }));
    try {
        const res = await fetch(`${API_URL}/carrito/comprar`, {
            method: "POST",
            body: JSON.stringify({ items }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return res.ok;
    } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
        return false;
    }
}

actualizarNumeroCarrito();
