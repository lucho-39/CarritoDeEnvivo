const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const database = require("./database");

// Carga las variables de entorno antes de leer PORT y CORS_ORIGINS.
dotenv.config({ quiet: true });

const app = express();

// Puerto configurable por variable de entorno.
app.set("port", process.env.PORT || 4000);

// Orígenes permitidos para CORS, separados por coma.
const origenesPermitidos = (process.env.CORS_ORIGINS || "http://127.0.0.1:5500,http://127.0.0.1:5501")
    .split(",")
    .map(origen => origen.trim())
    .filter(Boolean);

// Middlewares globales (siempre antes de las rutas).
app.use(cors({ origin: origenesPermitidos }));
app.use(morgan("dev"));
app.use(express.json());

// Catálogo de productos.
app.get("/productos", async (req, res, next) => {
    let connection;
    try {
        const pool = await database.poolPromise;
        connection = await pool.getConnection();
        const productos = await connection.query(
            "SELECT id, nombre, precio, urlimagen FROM producto"
        );
        res.json(productos);
    } catch (error) {
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Compra del carrito: valida, calcula el total en el servidor y persiste.
app.post("/carrito/comprar", async (req, res, next) => {
    // El cuerpo debe ser un objeto con un arreglo "items" no vacío.
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        return res.status(400).json({ error: "El cuerpo debe ser un objeto JSON" });
    }
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "items debe ser un arreglo no vacío" });
    }
    for (const item of items) {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
            return res.status(400).json({ error: "Cada item debe ser un objeto" });
        }
        if (!Number.isInteger(item.id) || item.id <= 0) {
            return res.status(400).json({ error: "Cada item debe tener un id entero mayor a 0" });
        }
        if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
            return res.status(400).json({ error: "Cada item debe tener una cantidad entera mayor a 0" });
        }
    }

    let connection;
    try {
        const pool = await database.poolPromise;
        connection = await pool.getConnection();

        // Los precios SIEMPRE salen de la base, nunca del cliente.
        const ids = [...new Set(items.map(item => item.id))];
        const productos = await connection.query(
            "SELECT id, precio FROM producto WHERE id IN (?)",
            [ids]
        );
        const precios = new Map(productos.map(producto => [producto.id, producto.precio]));

        const inexistentes = ids.filter(id => !precios.has(id));
        if (inexistentes.length > 0) {
            return res.status(400).json({
                error: `Producto(s) inexistente(s): ${inexistentes.join(", ")}`
            });
        }

        // Total calculado en el servidor.
        const total = items.reduce(
            (acumulado, item) => acumulado + precios.get(item.id) * item.cantidad,
            0
        );

        // Persistencia atómica: pedido + detalle.
        await connection.beginTransaction();
        const resultadoPedido = await connection.query(
            "INSERT INTO pedido (total) VALUES (?)",
            [total]
        );
        const pedidoId = resultadoPedido.insertId;
        const detalles = items.map(item => [
            pedidoId,
            item.id,
            item.cantidad,
            precios.get(item.id)
        ]);
        await connection.query(
            "INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario) VALUES ?",
            [detalles]
        );
        await connection.commit();

        res.status(201).json({ pedidoId, total });
    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error("No se pudo revertir la transacción:", rollbackError);
            }
        }
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Manejador central de errores: evita que una falla tumbe el proceso.
app.use((error, req, res, next) => {
    console.error(error);
    // Error de parseo del JSON enviado por express.json().
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ error: "JSON inválido en el cuerpo de la petición" });
    }
    res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(app.get("port"), () => {
    console.log("Escuchando comunicaciones al puerto " + app.get("port"));
});
