document.addEventListener("DOMContentLoaded", () => {
    // --- 1. EL GUARDIÁN: VERIFICAR ACCESO ---
    const acceso = localStorage.getItem("sesionActiva");
    if (acceso !== "true") {
        alert("Acceso denegado. Por favor, inicie sesión.");
        window.location.href = "../index.html";
        return;
    }

    renderizarFacturas();
});

function renderizarFacturas() {
    const contenedor = document.getElementById("lista-facturas-finales");
    const dataVentas = localStorage.getItem("recibosData") || "";

    // Si no hay ventas, mostramos un mensaje amigable
    if (dataVentas === "") {
        contenedor.innerHTML = `
            <div style="text-align:center; margin-top:100px; color:#999;">
                <p style="font-size: 1.5rem;">No hay registros de facturación para el periodo actual.</p>
                <p>Las facturas aparecerán aquí una vez que el cajero procese las ventas.</p>
            </div>`;
        return;
    }

    // El cajero guarda los bloques de venta separados por "%%"
    let facturas = dataVentas.split("%%");
    contenedor.innerHTML = ""; // Limpiamos el contenedor antes de renderizar

    let acumuladoDelDia = 0;

    facturas.forEach((f) => {
        // Estructura esperada: NombreCliente | Producto1;Producto2;... | Total | FechaHora
        let [nombre, productosRaw, total, fecha] = f.split("|");

        // Sumamos al total del día para el reporte interno
        acumuladoDelDia += parseFloat(total);

        // Creamos el bloque de la factura
        let card = document.createElement("div");
        card.className = "factura-bloque";

        // --- PROCESAMIENTO DE LA LISTA DE PRODUCTOS ---
        // Separamos los productos individuales que el cajero unió con ";"
        let listaItems = productosRaw.split(";");
        let htmlProductos = "<ul style='list-style: none; padding: 0;'>";
        
        listaItems.forEach(item => {
            if(item.trim() !== "") {
                htmlProductos += `
                    <li style="border-bottom: 1px solid #f0f0f0; padding: 8px 0;">
                        ${item}
                    </li>`;
            }
        });
        htmlProductos += "</ul>";

        // Inyectamos el contenido en la tarjeta
        card.innerHTML = `
            <div class="etiqueta-finalizado">COMPRA FINALIZADA</div>
            
            <div class="cliente-info">
                <h2 style="text-transform: uppercase; letter-spacing: 1px;">${nombre}</h2>
                <div class="fecha-emision">Registro N°: ${Math.floor(Math.random() * 10000)} | ${fecha}</div>
            </div>

            <div class="lista-productos">
                <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px; text-transform: uppercase; font-weight: bold;">Descripción de Productos:</p>
                ${htmlProductos}
            </div>

            <div class="total-final">
                <span>TOTAL PAGADO EN CAJA:</span> $${parseFloat(total).toFixed(2)}
            </div>

            <div style="margin-top: 20px; text-align: left;">
                <button onclick="window.print()" class="btn-print" style="cursor:pointer; background:none; border:1px solid #ccc; padding:5px 10px; border-radius:5px; font-size:0.8rem;">
                    🖨️ Imprimir Copia
                </button>
            </div>
        `;
        
        contenedor.appendChild(card);
    });

    // Opcional: Mostrar un resumen al final de la página (Solo visible para el administrador)
    console.log(`--- CIERRE DE CAJA --- \n Total en Ventas: $${acumuladoDelDia.toFixed(2)}`);
}

// Función extra por si quieres un botón para limpiar el historial (Cierre de día)
function cerrarCajaDelDia() {
    if (confirm("¿Está seguro de que desea cerrar la caja? Se borrarán todas las facturas del listado actual.")) {
        localStorage.removeItem("recibosData");
        location.reload();
    }
}