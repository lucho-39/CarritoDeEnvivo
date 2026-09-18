# **CARRITO DE COMPRAS JS**

Carrito de compras de bicicletas hecho con JavaScript vanilla: catálogo, carrito y
checkout funcionando del lado del cliente con `localStorage`.

Proyecto basado en el tutorial de [puntoJson](https://youtube.com/@puntoJson):

- https://www.youtube.com/watch?v=lduIpYA66mM
- https://www.youtube.com/watch?v=UEjf7k32mTg

## **Tech Stack**

**Client:** HTML, CSS, JS vanilla (DOM + localStorage)

**Server (opcional):** Node.js, Express, MySQL

## **Demo**

https://lucho-39.github.io/CarritoDeEnvivo/

La aplicación funciona **sin backend**, así que también podés abrir `index.html` en el
navegador o servir la carpeta con cualquier servidor estático:

```bash
npx serve .
```

El sitio se publica con GitHub Pages desde la rama `main` (carpeta raíz), y el archivo
`.nojekyll` desactiva el procesamiento de Jekyll para servir los archivos tal cual.

## **Screenshots**

![](./img/Captura.PNG)

![](./img/Captura1.PNG)

## **Estructura**

```
index.html            Catálogo de productos
cart.html             Carrito con totales y acciones
compra-exitosa.html   Confirmación de compra
js/
  config.js           Interruptor de fuente de datos (local o API)
  bicicletas.js       Catálogo local de productos
  productosService.js Obtención del catálogo
  cartService.js      Lógica del carrito y la compra
  cart.js             Render de la página del carrito
  index.js            Render del catálogo
src/                  Backend opcional (Express + MySQL)
```

## **Fuente de datos**

Todo se maneja desde `js/config.js`:

```js
const API_URL = "http://localhost:4000";
const USAR_API = false;
```

- `USAR_API = false` (por defecto): el catálogo sale de `js/bicicletas.js` y la compra
  se resuelve localmente. Es el modo que funciona sin backend.
- `USAR_API = true`: el catálogo se pide a la API de `src/`. Requiere el backend
  levantado.

## **Backend opcional**

El backend sirve el catálogo desde MySQL y expone el endpoint de compra.

1. Instalar dependencias:

```bash
npm install
```

2. Crear la base de datos `productos` con una tabla `producto` que tenga, como mínimo,
   las columnas `id`, `nombre`, `precio` y `urlimagen`:

```sql
CREATE DATABASE productos;

CREATE TABLE producto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    precio INT NOT NULL,
    urlimagen VARCHAR(255) NOT NULL
);
```

3. Copiar las credenciales de ejemplo y completarlas:

```bash
cp .env.example .env
```

4. Levantar el servidor:

```bash
npm run dev
```

La API escucha en `http://localhost:4000`:

| Método | Ruta               | Descripción                     |
| ------ | ------------------ | ------------------------------- |
| GET    | `/productos`       | Devuelve el catálogo            |
| POST   | `/carrito/comprar` | Recibe el carrito de la compra  |

Para usarla desde el front, poné `USAR_API = true` en `js/config.js`.
