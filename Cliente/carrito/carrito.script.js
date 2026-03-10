document.addEventListener("DOMContentLoaded", () => {
    // 1. REFERENCIAS AL DOM
    const listaContenedor = document.getElementById("lista-items");
    const resCant = document.getElementById("res-cant");
    const resTotal = document.getElementById("res-total");

    // 2. RECUPERAR LOS DATOS
    // Muy importante: Usar exactamente 'carritoData'
    let datosRaw = localStorage.getItem("carritoData") || "";

    function renderizarCarrito() {
        listaContenedor.innerHTML = ""; // Limpiar antes de empezar
        
        // Si no hay nada, avisamos y salimos de la función
        if (datosRaw === "" || datosRaw === null) {
            listaContenedor.innerHTML = "<p>El carrito está vacío. ¡Ve a la tienda!</p>";
            resCant.innerText = "0";
            resTotal.innerText = "0.00$";
            return;
        }

        // PASO A: Separar productos (#)
        let productos = datosRaw.split("#");
        let sumaDinero = 0;
        let sumaUnidades = 0;

        productos.forEach(p => {
            // PASO B: Separar datos del producto (|)
            let info = p.split("|");

            // VALIDACIÓN DE SEGURIDAD: 
            // Si el pedazo de texto no tiene los 3 datos (nombre, cant, precio), lo ignora
            if (info.length < 3) return; 

            // Crear fila en el HTML
            let itemDiv = document.createElement("div");
            itemDiv.className = "item-carrito";
            itemDiv.innerHTML = `
                <span><strong>${info[0]}</strong> (x${info[1]})</span>
                <span>${info[2]}$</span>
            `;
            listaContenedor.appendChild(itemDiv);

            // Sumar para el resumen
            sumaUnidades += parseInt(info[1]);
            sumaDinero += parseFloat(info[2]);
        });

        // ACTUALIZAR TOTALES
        resCant.innerText = sumaUnidades;
        resTotal.innerText = sumaDinero.toFixed(2) + "$";
    }
    
    const btnUsarPuntos = document.getElementById("btn-usar-puntos");
    const divInfoPuntos = document.getElementById("info-puntos");
    
    let puntosActuales = parseInt(localStorage.getItem("puntosLealtad")) || 0;

    // EVENTO DEL BOTÓN DE PUNTOS
    btnUsarPuntos.addEventListener("click", () => {
        // Alternar visibilidad
        divInfoPuntos.classList.toggle("oculto");

        if (!divInfoPuntos.classList.contains("oculto")) {
            // Lógica de cálculo
            let descuento = puntosActuales / 100;
            let totalOriginal = parseFloat(document.getElementById("res-total").innerText.replace('$', ''));
            let totalFinal = Math.max(0, totalOriginal - descuento);

            document.getElementById("puntos-disponibles").innerText = puntosActuales;
            document.getElementById("descuento-aplicado").innerText = descuento.toFixed(2);
            document.getElementById("nuevo-total-puntos").innerText = totalFinal.toFixed(2);
            
            btnUsarPuntos.innerText = "Quitar descuento";
            localStorage.setItem("descuentoAplicado", "si");
        } else {
            btnUsarPuntos.innerText = "Usar mis puntos de lealtad";
            localStorage.removeItem("descuentoAplicado");
        }
    });

    // LÓGICA DE INTERCAMBIO DE FORMULARIOS (Para que no se mezclen)
    const radioOnline = document.getElementById("p-online");
    const radioPresencial = document.getElementById("p-presencial");
    const fOnline = document.getElementById("form-pago");
    const fPresencial = document.getElementById("msg-presencial");

    radioOnline.addEventListener("change", () => {
        fOnline.classList.remove("oculto");
        fPresencial.classList.add("oculto");
    });

    radioPresencial.addEventListener("change", () => {
        fOnline.classList.add("oculto");
        fPresencial.classList.remove("oculto");
    });

    // BOTONES DE FINALIZAR
    document.getElementById("btn-pagar-online").addEventListener("click", () => {
        if(document.getElementById("tarjeta-num").value.length < 10) {
            alert("Tarjeta inválida"); return;
        }
        finalizarCompra();
    });

    document.getElementById("btn-confirmar-presencial").addEventListener("click", () => {
        if(document.getElementById("nombre-cliente").value === "") {
            alert("Ingresa tu nombre"); return;
        }
        finalizarCompra();
    });

    function finalizarCompra() {
        let totalFactura = parseFloat(document.getElementById("res-total").innerText.replace('$', ''));
        let puntosGanados = Math.floor(totalFactura * 10);
        let puntosGuardados = parseInt(localStorage.getItem("puntosLealtad")) || 0;
        let resultadoPuntos;

        if (localStorage.getItem("descuentoAplicado") === "si") {
            resultadoPuntos = puntosGanados; // Gastó los viejos, solo le quedan los nuevos
            localStorage.removeItem("descuentoAplicado");
        } else {
            resultadoPuntos = puntosGuardados + puntosGanados; // Suma todo
        }

        localStorage.setItem("puntosLealtad", resultadoPuntos);
        localStorage.removeItem("carritoData");
        localStorage.setItem("carrito", 0);

        alert(`¡Compra exitosa! Has ganado ${puntosGanados} puntos.`);
        window.location.href = "../cliente.html";
    }
    
    renderizarCarrito();
});

// TAMBIÉN PARA EL PAGO PRESENCIAL (si quieres que se vacíe al confirmar)
    const btnConfirmarPresencial = document.querySelector("#msg-presencial .btn-negro");
    btnConfirmarPresencial.addEventListener("click", () => {
        alert("¡Pedido confirmado! Te esperamos en nuestra sede.");
        localStorage.removeItem("carritoData");
        localStorage.setItem("carrito", "0");
        window.location.href = "../cliente.html";
    });