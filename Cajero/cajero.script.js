(function verificarAcceso() {
    // Verificamos si la llave existe
    if (localStorage.getItem("sesionActiva") !== "true") {
        alert("Acceso denegado. Por favor, inicie sesión.");
        // Ajusta la ruta para salir de la carpeta Cliente y llegar al index
        window.location.href = "../index.html"; 
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. EL GUARDIÁN: VERIFICAR ACCESO ---
    if (localStorage.getItem("sesionActiva") !== "true") {
        window.location.href = "../index.html";
        return;
    }

    cargarPedidos();

    // Opcional: Refrescar automáticamente cada 10 segundos para ver pedidos nuevos
    setInterval(cargarPedidos, 10000);
});

// --- 2. CARGAR PEDIDOS DESDE EL LOCALSTORAGE ---
function cargarPedidos() {
    const contenedor = document.getElementById("lista-pedidos-caja");
    const datosRaw = localStorage.getItem("pedidosPendientes") || "";

    if (datosRaw === "") {
        contenedor.innerHTML = `
            <div class="vacio-msg" style="text-align:center; padding:50px; color:#999;">
                <h2>No hay pedidos pendientes</h2>
                <p>La cola de atención está vacía en este momento.</p>
            </div>`;
        return;
    }

    contenedor.innerHTML = ""; // Limpiar antes de renderizar
    let pedidos = datosRaw.split("%%");

    pedidos.forEach((pedido, index) => {
        // Estructura recibida: NombreCliente | Producto1;Producto2;... | Total
        let partes = pedido.split("|");
        if (partes.length < 3) return;

        let nombre = partes[0];
        let productosRaw = partes[1]; 
        let total = partes[2];

        // Separamos los productos por el punto y coma para mostrarlos en lista
        let arrayProductos = productosRaw.split(";");
        let listaHTML = "<ul style='list-style:none; padding:0; margin:10px 0;'>";
        
        arrayProductos.forEach(p => {
            if(p.trim() !== "") {
                listaHTML += `<li style="padding:5px 0; border-bottom:1px solid #f0f0f0;">• ${p}</li>`;
            }
        });
        listaHTML += "</ul>";

        let card = document.createElement("div");
        card.className = "bloque-compra";
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0;">Cliente: ${nombre}</h3>
                <span style="font-size:0.8rem; color:#666;">Orden #${index + 1}</span>
            </div>
            
            <div class="detalle-productos" style="background:#fcfcfc; padding:15px; border-radius:8px; margin:15px 0;">
                ${listaHTML}
            </div>
            
            <div class="total-caja" style="font-size:1.4rem; margin-bottom:20px;">
                Total a pagar: <strong style="color:#000;">$${parseFloat(total).toFixed(2)}</strong>
            </div>
            
            <button class="btn-puntos" onclick="finalizarVenta(${index})" style="width:100%; padding:15px; cursor:pointer; background:#000; color:#fff; border:none; border-radius:8px; font-weight:bold; text-transform:uppercase;">
                Confirmar Venta y Generar Factura
            </button>
        `;
        contenedor.appendChild(card);
    });
}

// --- 3. FINALIZAR VENTA Y MOVER A FACTURACIÓN ---
function finalizarVenta(index) {
    let datosRaw = localStorage.getItem("pedidosPendientes") || "";
    let pedidos = datosRaw.split("%%");
    
    // Obtenemos el pedido específico
    let pedidoSeleccionado = pedidos[index];
    
    // 1. Añadimos la fecha y hora actual al pedido para la factura
    let ahora = new Date();
    let fechaFormateada = ahora.toLocaleDateString() + " " + ahora.toLocaleTimeString();
    
    // El nuevo formato para Facturas será: Nombre|Productos|Total|Fecha
    let facturaFinal = `${pedidoSeleccionado}|${fechaFormateada}`;

    // 2. Guardamos en el historial de Facturas (recibosData)
    let facturasPrevias = localStorage.getItem("recibosData") || "";
    let listaActualizadaFacturas = (facturasPrevias === "") 
        ? facturaFinal 
        : facturaFinal + "%%" + facturasPrevias;
    
    localStorage.setItem("recibosData", listaActualizadaFacturas);

    // 3. Eliminamos el pedido de la cola de pendientes
    pedidos.splice(index, 1);
    
    if (pedidos.length > 0) {
        localStorage.setItem("pedidosPendientes", pedidos.join("%%"));
    } else {
        localStorage.removeItem("pedidosPendientes");
    }

    // 4. Notificación y Recarga
    alert("¡Venta Exitosa! La factura ha sido registrada en el historial.");
    cargarPedidos();
}

// Función de utilidad para limpiar la cola manualmente si es necesario
function limpiarColaPedidos() {
    if(confirm("¿Deseas limpiar toda la cola de pedidos pendientes?")) {
        localStorage.removeItem("pedidosPendientes");
        cargarPedidos();
    }
}

document.getElementById("cerrarSesion").onclick = () => {
    // Quitamos la llave pero NO borramos historial ni puntos
    localStorage.removeItem("sesionActiva");
    
    alert("Sesión cerrada. ¡Vuelva pronto!");
    window.location.href = "../index.html";
};