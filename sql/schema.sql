-- Esquema e inicialización de la base de datos del backend.
-- Es idempotente: se puede ejecutar varias veces sin duplicar datos.
--   mysql -u root -p < sql/schema.sql

CREATE DATABASE IF NOT EXISTS productos;
USE productos;

CREATE TABLE IF NOT EXISTS producto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    precio INT NOT NULL,
    urlimagen VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS pedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total INT NOT NULL
);

CREATE TABLE IF NOT EXISTS pedido_detalle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario INT NOT NULL,
    CONSTRAINT fk_pedido_detalle_pedido
        FOREIGN KEY (pedido_id) REFERENCES pedido (id),
    CONSTRAINT fk_pedido_detalle_producto
        FOREIGN KEY (producto_id) REFERENCES producto (id)
);

-- Semilla del catálogo: solo se inserta si la tabla producto está vacía.
INSERT INTO producto (id, nombre, precio, urlimagen)
SELECT t.id, t.nombre, t.precio, t.urlimagen
FROM (
    SELECT 1 AS id, 'Veloziraptor' AS nombre, 111111 AS precio, 'img/productos/1.jpg' AS urlimagen
    UNION ALL SELECT 2, 'Biciclón', 222222, 'img/productos/2.jpg'
    UNION ALL SELECT 3, 'CicloTravesura', 333333, 'img/productos/3.jpg'
    UNION ALL SELECT 4, 'Pedalástica', 444444, 'img/productos/4.jpg'
    UNION ALL SELECT 5, 'RuedaFrenesí', 555555, 'img/productos/5.jpg'
    UNION ALL SELECT 6, 'CicloLoco', 666666, 'img/productos/6.jpg'
) AS t
WHERE NOT EXISTS (SELECT 1 FROM producto);
