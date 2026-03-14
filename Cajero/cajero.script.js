(function verificarAcceso() {
    if (localStorage.getItem("sesionActiva") !== "true") {
        alert("Acceso denegado. Por favor, inicie sesión.");
        window.location.href = "../index.html"; 
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    cargarPedidos();
});

function cargarPedidos() {
    let contenedor = document.getElementById("lista");
    let pedidos = localStorage.getItem("pedidosPen") || "";

    if (pedidos === "") {
        contenedor.innerHTML = "<div class='vacio-msg'><h2>No hay pedidos pendientes</h2></div>";
        return;
    }

    contenedor.innerHTML = "";
    let bloques = pedidos.split("%%");

    bloques.forEach((bloque, index) => {
        let primerP = bloque.indexOf("|");
        let ultimoP = bloque.lastIndexOf("|");

        let nombreCliente = bloque.substring(0, primerP);
        let totalPago = bloque.substring(ultimoP + 1);
        let cuerpo = bloque.substring(primerP + 1, ultimoP);

        let divPedido = document.createElement("div");
        divPedido.className = "bloque-compra";

        let lista = "<ul>";
        let productos = cuerpo.split(";");

        productos.forEach(prod => {
            let d = prod.split("|");
            if (d.length >= 2) {
                lista += `
                <li>
              		<strong>${d[0].trim()}</strong> — Cant: ${d[1]} — Subtotal: ${d[2]}$
                </li>`;
            }
        });
        lista += "</ul>";

        divPedido.innerHTML = `
            <div class="div1">
                <h3>CLIENTE: ${nombreCliente}</h3>
                <span style="font-weight: bold;">ORDEN #${index + 1}</span>
            </div>
            ${lista}
            <div class="div2">
                <p>TOTAL: <strong>${totalPago}$</strong></p>
            </div>
            <button onclick="finalizar(${index})">
                CONFIRMAR VENTA
            </button>
        `;
        contenedor.appendChild(divPedido);
    });
}

function finalizar(index) {
    let datos = localStorage.getItem("pedidosPen") || "";
    let pedidos = datos.split("%%");
    let pedidoFin = pedidos[index];

    let ahora = new Date();
    let fecha = ahora.toLocaleDateString() + " " + ahora.toLocaleTimeString();

    let recibosPre = localStorage.getItem("recibos") || "";
    let reciboNu = `${pedidoFin}|${fecha}`;
    
    let dataFinal = (recibosPre === "") ? reciboNu : reciboNu + "%%" + recibosPre;
    localStorage.setItem("recibos", dataFinal);

    pedidos.splice(index, 1);
    if (pedidos.length > 0) {
        localStorage.setItem("pedidosPen", pedidos.join("%%"));
    } else {
        localStorage.removeItem("pedidosPen");
    }

    alert("Venta finalizada con éxito.");
    cargarPedidos();
}

document.getElementById("cerrarSesion").onclick = () => {
    localStorage.removeItem("sesionActiva");
    alert("Sesión cerrada. ¡Vuelva pronto!");
    window.location.href = "../index.html";
};