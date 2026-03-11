document.addEventListener("DOMContentLoaded", () => {
    const listaContenedor = document.getElementById("lista-items");
    const resCant = document.getElementById("res-cant");
    const resTotal = document.getElementById("res-total");
    const menuPostCompra = document.getElementById("menu-post-compra");
    const secciones = document.querySelectorAll('.resumen, .pago, .historial');

    function renderizarCarrito() {
        let datosRaw = localStorage.getItem("carritoData") || "";
        listaContenedor.innerHTML = ""; 
        if (datosRaw === "") {
            listaContenedor.innerHTML = "<p>El carrito está vacío.</p>";
            resCant.innerText = "0";
            resTotal.innerText = "0.00$";
            return;
        }
        let productos = datosRaw.split("#");
        let sumaDinero = 0;
        let sumaUnidades = 0;
        productos.forEach(p => {
            let info = p.split("|");
            if (info.length < 3) return; 
            let itemDiv = document.createElement("div");
            itemDiv.className = "item-carrito";
            itemDiv.innerHTML = `<span><strong>${info[0]}</strong> (x${info[1]})</span><span>${info[2]}$</span>`;
            listaContenedor.appendChild(itemDiv);
            sumaUnidades += parseInt(info[1]);
            sumaDinero += parseFloat(info[2]);
        });
        resCant.innerText = sumaUnidades;
        resTotal.innerText = sumaDinero.toFixed(2) + "$";
    }

    function procesarFinalizacion(metodo, nombreCliente = "Usuario Online") {
        let datosCarrito = localStorage.getItem("carritoData") || "";
        if (datosCarrito === "") return;

        let totalOriginal = parseFloat(resTotal.innerText.replace('$', ''));
        let totalPagado = totalOriginal;
        let ahorro = 0;

        if (localStorage.getItem("descuentoAplicado") === "si") {
            totalPagado = parseFloat(document.getElementById("nuevo-total-puntos").innerText);
            ahorro = totalOriginal - totalPagado;
        }

        // Agrupar productos
        let productosCoche = datosCarrito.split("#");
        let temporal = {}; 
        productosCoche.forEach(p => {
            let info = p.split("|");
            if (info.length < 3) return;
            let nombre = info[0], cant = parseInt(info[1]), precio = parseFloat(info[2]);
            if (temporal[nombre]) {
                temporal[nombre].cant += cant;
                temporal[nombre].precio += precio;
            } else {
                temporal[nombre] = { cant: cant, precio: precio };
            }
        });

        let resumenProductos = "";
        for (let nombre in temporal) {
            resumenProductos += `${nombre}|${temporal[nombre].cant}|${temporal[nombre].precio.toFixed(2)}|${ahorro.toFixed(2)}#`;
        }
        resumenProductos = resumenProductos.slice(0, -1);

        if (metodo === "online") {
            // CAMINO ONLINE
            let historialPrevio = localStorage.getItem("historialData") || "";
            let historialNuevo = (historialPrevio === "") ? resumenProductos : resumenProductos + "%%" + historialPrevio;
            localStorage.setItem("historialData", historialNuevo);
            
            // Puntos y Menú Post-Venta
            let puntosGanados = Math.floor(totalPagado * 10);
            localStorage.setItem("puntosPendientes", puntosGanados);
            
            secciones.forEach(s => s.classList.add('oculto'));
            menuPostCompra.classList.remove('oculto');
            alert("Pago online procesado con éxito.");

        } else {
            // CAMINO PRESENCIAL (Cajero)
            let pendientesPrevios = localStorage.getItem("pedidosPendientes") || "";
            // Usamos el nombre del cliente y los productos
            let pedidoParaCaja = `${nombreCliente}|${resumenProductos.replace(/#/g, ";")}|${totalPagado.toFixed(2)}`;
            
            let listaActualizada = (pendientesPrevios === "") ? pedidoParaCaja : pedidoParaCaja + "%%" + pendientesPrevios;
            localStorage.setItem("pedidosPendientes", listaActualizada);
            
            alert(`Pedido enviado a nombre de: ${nombreCliente}. Por favor, acérquese a caja para pagar.`);
            
            // En lugar de ir al menú post-venta, regresamos a la tienda o limpiamos
            window.location.href = "../Cliente.html"; 
        }

        // Limpieza de datos
        localStorage.removeItem("carritoData");
        localStorage.setItem("carrito", 0);
        localStorage.removeItem("descuentoAplicado");
    }

    // Eventos
    document.getElementById("btn-pagar-online").onclick = () => {
        if (document.getElementById("tarjeta-num").value.length < 10) return alert("Tarjeta inválida");
        procesarFinalizacion("online");
    };

    document.getElementById("btn-confirmar-presencial").onclick = () => {
        const nombreC = document.getElementById("nombre-cliente").value.trim();
        if (nombreC === "") return alert("Por favor, ingresa tu nombre.");
        procesarFinalizacion("presencial", nombreC);
    };

    // Botones de puntos (solo para online)
    document.getElementById("btn-reclamar-puntos").onclick = () => {
        let pendientes = parseInt(localStorage.getItem("puntosPendientes")) || 0;
        let actuales = parseInt(localStorage.getItem("puntosLealtad")) || 0;
        localStorage.setItem("puntosLealtad", actuales + pendientes);
        localStorage.setItem("puntosPendientes", "0");
        alert("Puntos sumados!");
    };

    // Cambios de vista Radios
    document.getElementById("p-online").onchange = () => {
        document.getElementById("form-pago").classList.remove("oculto");
        document.getElementById("msg-presencial").classList.add("oculto");
    };
    document.getElementById("p-presencial").onchange = () => {
        document.getElementById("form-pago").classList.add("oculto");
        document.getElementById("msg-presencial").classList.remove("oculto");
    };

    renderizarCarrito();
});