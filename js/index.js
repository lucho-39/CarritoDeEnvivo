const contenedorTarjetas = document.getElementById("productos-container");

/** Crea las tarjetas de productos teniendo en cuenta la lista en bicicletas.js */
function crearTarjetasProductosInicio(productos) {
    productos.forEach(producto => {
        const nuevaBicicleta = document.createElement("div");
        nuevaBicicleta.classList = "tarjeta-producto";
        nuevaBicicleta.innerHTML = `
         <img src="${producto.urlimagen || './img/productos/' + producto.id + '.jpg'}" alt="Bicicleta ${producto.id}">
         <h3>${producto.nombre}</h3>
         <p class="precio">$${producto.precio}</p>
         <button>Agregar al carrito</button>
        `

        contenedorTarjetas.appendChild(nuevaBicicleta);
        nuevaBicicleta.getElementsByTagName("button")[0].addEventListener("click", () => agregarAlCarrito(producto));
    });
}

getBicicletas().then(bicicletas => {
    crearTarjetasProductosInicio(bicicletas);
}).catch(error => {
    console.error("No se pudieron cargar las bicicletas:", error);
})
