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
	
	// --- FUNCIÓN PARA EL BOTÓN USAR PUNTOS ---
    const btnUsarPuntos = document.getElementById("btn-usar-puntos");
    const divInfoPuntos = document.getElementById("info-puntos");

    if (btnUsarPuntos) {
        btnUsarPuntos.onclick = function() {
            // 1. Mostrar/Ocultar el panel de información de puntos
            divInfoPuntos.classList.toggle("oculto");

            if (!divInfoPuntos.classList.contains("oculto")) {
                // 2. Obtener puntos y total actual
                let puntosTotales = parseInt(localStorage.getItem("puntosLealtad")) || 0;
                let totalOriginal = parseFloat(resTotal.innerText.replace('$', ''));

                // 3. Calcular descuento (100 puntos = 1$)
                let descuento = puntosTotales / 100;
                let totalFinal = Math.max(0, totalOriginal - descuento);

                // 4. Actualizar la interfaz del modal de puntos
                document.getElementById("puntos-disponibles").innerText = puntosTotales;
                document.getElementById("descuento-applied").innerText = descuento.toFixed(2);
                document.getElementById("nuevo-total-puntos").innerText = totalFinal.toFixed(2);
                
                // 5. Cambiar texto del botón y marcar que se está usando el descuento
                this.innerText = "Quitar descuento";
                localStorage.setItem("descuentoAplicado", "si");
            } else {
                // Si el usuario decide ocultar el panel, quitamos el descuento
                this.innerText = "Usar mis puntos de lealtad";
                localStorage.removeItem("descuentoAplicado");
            }
        };
    }

    // --- SOLUCIÓN: VACIAR CARRITO ---
    const btnVaciar = document.getElementById("btn-vaciar");
    if(btnVaciar) {
        btnVaciar.onclick = () => {
            if(confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
                localStorage.removeItem("carritoData");
                localStorage.setItem("carrito", 0);
                renderizarCarrito();
                alert("Carrito vaciado.");
            }
        };
    }

   function procesarFinalizacion(metodo, nombreCliente = "Usuario Online") {
    let datosCarrito = localStorage.getItem("carritoData") || "";
    if (datosCarrito === "") return;

    let totalOriginal = parseFloat(resTotal.innerText.replace('$', ''));
    let totalPagado = totalOriginal;
    let ahorro = 0;
    let usoDescuento = localStorage.getItem("descuentoAplicado") === "si";

    if (usoDescuento) {
        // Obtenemos el total con descuento del elemento visual
        totalPagado = parseFloat(document.getElementById("nuevo-total-puntos").innerText);
        ahorro = totalOriginal - totalPagado;

        // --- SOLUCIÓN 1: RESTAR PUNTOS USADOS DEL SALDO TOTAL ---
        // Si el usuario usó puntos, su saldo actual de lealtad debe quedar en 0 
        // (porque usó todos sus puntos para el descuento)
        localStorage.setItem("puntosLealtad", "0"); 
        localStorage.removeItem("descuentoAplicado");
    }

    // Agrupar productos para el registro
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

    // --- SOLUCIÓN 2: CÁLCULO DE PUNTOS GANADOS (Mínimo 1 punto) ---
    // Usamos Math.ceil para que 0.08 se convierta en 1 punto ganado
    let puntosGanados = Math.ceil(totalPagado * 10); 
    if (totalPagado > 0 && puntosGanados === 0) puntosGanados = 1; 
    
    // Se guardan en pendientes (No se suman al total todavía)
    localStorage.setItem("puntosPendientes", puntosGanados);

    if (metodo === "online") {
        let historialPrevio = localStorage.getItem("historialData") || "";
        let historialNuevo = (historialPrevio === "") ? resumenProductos : resumenProductos + "%%" + historialPrevio;
        localStorage.setItem("historialData", historialNuevo);
        
        secciones.forEach(s => s.classList.add('oculto'));
        menuPostCompra.classList.remove('oculto');
        alert(`Pago online exitoso. Podras canjear tus ${puntosGanados} a continuacion para agregarlos a tu cuenta`);
    } else {
        let pendientesPrevios = localStorage.getItem("pedidosPendientes") || "";
        let pedidoParaCaja = `${nombreCliente}|${resumenProductos.replace(/#/g, ";")}|${totalPagado.toFixed(2)}`;
        let listaActualizada = (pendientesPrevios === "") ? pedidoParaCaja : pedidoParaCaja + "%%" + pendientesPrevios;
        localStorage.setItem("pedidosPendientes", listaActualizada);
        
        alert(`Pedido enviado a caja. Puntos por ganar: ${puntosGanados}.`);
        window.location.href = "../cliente.html"; 
    }

    // Limpieza final
    localStorage.removeItem("carritoData");
    localStorage.setItem("carrito", 0);
}

    // Eventos de Pago
    document.getElementById("btn-pagar-online").onclick = () => {
        if (document.getElementById("tarjeta-num").value.length < 10) return alert("Tarjeta inválida");
        procesarFinalizacion("online");
    };

    document.getElementById("btn-confirmar-presencial").onclick = () => {
        const nombreC = document.getElementById("nombre-cliente").value.trim();
        if (nombreC === "") return alert("Ingresa tu nombre.");
        procesarFinalizacion("presencial", nombreC);
    };

    // --- SOLUCIÓN: BOTONES MENÚ POST-VENTA ---
   document.getElementById("btn-reclamar-puntos").onclick = () => {
    let pendientes = parseInt(localStorage.getItem("puntosPendientes")) || 0;
    if (pendientes > 0) {
        let actuales = parseInt(localStorage.getItem("puntosLealtad")) || 0;
        localStorage.setItem("puntosLealtad", actuales + pendientes);
        localStorage.setItem("puntosPendientes", "0"); // Resetear pendientes tras el canje
        alert(`¡Puntos canjeados!. Obtuviste un total de ${pendientes}`);
    } else {
        alert("No tienes puntos nuevos para reclamar.");
    }
};

    document.getElementById("btn-consultar-puntos").onclick = () => {
        let saldo = localStorage.getItem("puntosLealtad") || "0";
        alert(`Tu saldo total acumulado es de: ${saldo} puntos.`);
    };

    // Radios
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