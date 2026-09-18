const mysql = require("promise-mysql");
const dotenv = require("dotenv");
dotenv.config({ quiet: true });

// promise-mysql devuelve una promesa que resuelve en el pool. El pool no se
// conecta de forma anticipada: las conexiones se abren bajo demanda, así que
// el proceso arranca aunque MySQL esté caído.
const poolPromise = mysql.createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectionLimit: 10
});

module.exports = {
    poolPromise
};
