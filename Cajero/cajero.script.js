     function cargarPedidosCajero() {
            const contenedor = document.getElementById("lista-pedidos-caja");
            const data = localStorage.getItem("pedidosPendientes") || "";
            contenedor.innerHTML = "";

            if (data === "") {
                contenedor.innerHTML = "<p>No hay pedidos pendientes por cobrar.</p>";
                return;
            }

            let pedidos = data.split("%%");
            pedidos.forEach((p, index) => {
                let d = p.split("|"); // [0]Nombre, [1]Productos, [2]Total
                
                let div = document.createElement("div");
                div.className = "bloque-compra";
                div.innerHTML = `
                    <h3>Cliente: ${d[0]}</h3>
                    <p style="font-size: 1rem; color: #555;">${d[1].replace(/;/g, " <br> ")}</p>
                    <p><strong>Total a cobrar: ${d[2]}$</strong></p>
                    <button class="btn-puntos" onclick="finalizarVenta(${index})">Finalizar Venta</button>
                `;
                contenedor.appendChild(div);
            });
        }

        function finalizarVenta(index) {
            let data = localStorage.getItem("pedidosPendientes").split("%%");
            let pedidoVendido = data[index];

            // 1. Guardar en Recibos (Pagina Recibos)
            let recibosPrevios = localStorage.getItem("recibosData") || "";
            let fecha = new Date().toLocaleString();
            let nuevoRecibo = `${pedidoVendido}|${fecha}`;
            
            let dataRecibos = (recibosPrevios === "") ? nuevoRecibo : nuevoRecibo + "%%" + recibosPrevios;
            localStorage.setItem("recibosData", dataRecibos);

            // 2. Eliminar de pedidos pendientes
            data.splice(index, 1);
            localStorage.setItem("pedidosPendientes", data.join("%%"));

            alert("Recibo emitido. ¡Gracias por su compra!");
            cargarPedidosCajero();
        }

        document.addEventListener("DOMContentLoaded", cargarPedidosCajero);