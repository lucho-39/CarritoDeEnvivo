/**
 * Configuración de la fuente de datos.
 *
 * USAR_API = false -> el catálogo sale de js/bicicletas.js y la compra se resuelve localmente.
 *                     Es el modo que funciona sin backend (demo / GitHub Pages).
 * USAR_API = true  -> consume la API Express + MySQL de src/.
 *                     Requiere el backend levantado y la base de datos configurada.
 */
const API_URL = "http://localhost:4000";
const USAR_API = false;
