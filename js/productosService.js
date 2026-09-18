async function getBicicletas() {
    if (!USAR_API) {
        return bicicletas;
    }
    const res = await fetch(`${API_URL}/productos`);
    if (!res.ok) {
        throw new Error(`Error ${res.status} al obtener los productos`);
    }
    return res.json();
}
