document.addEventListener("DOMContentLoaded", () => {
    let lista = document.getElementById("lista-items");
    let resCant = document.getElementById("res-cant");
    let resTotal = document.getElementById("res-total");
    let menu = document.getElementById("menu");
    let secciones = document.querySelectorAll('.resumen, .pago, .historial, .header');
	let datos = localStorage.getItem("carritoData") || "";
	let productos = datos.split("#");

    function actualizar() {
		let datos = localStorage.getItem("carritoData") || "";
        lista.innerHTML = ""; 
        if (datos === "") {
            lista.innerHTML = "<p>El carrito está vacío.</p>";
            resCant.innerText = "0";
            resTotal.innerText = "0.00$";
            return;
		}
        let sumaDinero = 0;
        let sumaUnidades = 0;
        productos.forEach(p => {
            let info = p.split("|");
            if (info.length < 3) return; 
            let itemDiv = document.createElement("div");
            itemDiv.className = "item-carrito";
            itemDiv.innerHTML = `<span><strong>${info[0]}</strong> (x${info[1]})</span><span>${info[2]}$</span>`;
            lista.appendChild(itemDiv);
            sumaUnidades += parseInt(info[1]);
            sumaDinero += parseFloat(info[2]);
        });
        resCant.innerText = sumaUnidades;
        resTotal.innerText = sumaDinero.toFixed(2) + "$";
    }
	
    let usarP = document.getElementById("usarP");
    let infoP = document.getElementById("infoP");

    if (usarP) {
        usarP.onclick = function() {
         	if(infoP.style.display == "block"){
				infoP.style.display = "none";
			}else{
				infoP.style.display = "block";
			}

            if (infoP.style.display == "block"){
                let puntosT = parseInt(localStorage.getItem("puntos")) || 0;
                let totalO = parseFloat(resTotal.innerText.replace('$', ''));

                let descuento = puntosT / 100;
                let totalF = Math.max(0, totalO - descuento);

                document.getElementById("puntosD").innerText = puntosT;
               document.getElementById("descuento").innerText = descuento.toFixed(2);
                document.getElementById("totalP").innerText = totalF.toFixed(2);
                
                this.innerText = "Quitar descuento";
                localStorage.setItem("descuento", "si");
            } else {
                this.innerText = "Usar mis puntos de lealtad";
                localStorage.removeItem("descuento");
            }
        };
    }

    let vaciar = document.getElementById("vaciar");
    if(vaciar) {
        vaciar.onclick = () => {
            if(confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
                localStorage.removeItem("carritoData");
                localStorage.setItem("carrito", 0);
                actualizar();
                alert("Carrito vaciado.");
            }
        };
    }

   function procesar(metodo, nombreCliente = "ClienteUCV") {
    if (datos === "") return;

    let totalO = parseFloat(resTotal.innerText.replace('$', ''));
    let totalP = totalO;
    let ahorro = 0;
    let descuento = localStorage.getItem("descuento") === "si";

    if (descuento) {
        totalP = parseFloat(document.getElementById("totalP").innerText);
        ahorro = totalO - totalP;
        localStorage.setItem("puntos", "0"); 
        localStorage.removeItem("descuento");
    }
	   
    let temporal = {}; 
    productos.forEach(p => {
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

    let resumen = "";
    for (let nombre in temporal) {
        resumen += `${nombre}|${temporal[nombre].cant}|${temporal[nombre].precio.toFixed(2)}|${ahorro.toFixed(2)}#`;
    }
    resumen = resumen.slice(0, -1);

    let puntosG = Math.ceil(totalP * 10); 
    if (totalP > 0 && puntosG === 0) puntosG = 1; 
   
    localStorage.setItem("puntosPen", puntosG);

    if (metodo === "online") {
        let historialPre = localStorage.getItem("historial") || "";
        let historialNu = (historialPre === "") ? resumen : resumen + "%%" + historialPre;
        localStorage.setItem("historial", historialNu);
        
        secciones.forEach(s => s.style.display = "none");
        menu.style.display = "block";
		
        alert(`Pago online exitoso. Podras canjear tus ${puntosG} a continuacion para agregarlos a tu cuenta`);
    } else {
        let pendientes = localStorage.getItem("pedidosPen") || "";
        let pedido = `${nombreCliente}|${resumen.replace(/#/g, ";")}|${totalP.toFixed(2)}`;
        let listaA = (pendientes === "") ? pedido : pedido + "%%" + pendientes;
        localStorage.setItem("pedidosPen", listaA);
        
        alert(`Pedido enviado a caja. Puntos por ganar: ${puntosG}`);
        window.location.href = "../cliente.html"; 
    }

    localStorage.removeItem("carritoData");
    localStorage.setItem("carrito", 0);
}

    document.getElementById("btn-pagar-online").onclick = () => {
        if (document.getElementById("tarjeta").value.length < 10) return alert("Tarjeta inválida");
        procesar("online");
    };

    document.getElementById("btn-confirmar-presencial").onclick = () => {
        let nombreC = document.getElementById("nombre-cliente").value.trim();
        if (nombreC === "") return alert("Ingresa tu nombre.");
        procesar("presencial", nombreC);
    };

   document.getElementById("btn-reclamar-puntos").onclick = () => {
    let pendientes = parseInt(localStorage.getItem("puntosPen")) || 0;
    if (pendientes > 0) {
        let actuales = parseInt(localStorage.getItem("puntos")) || 0;
        localStorage.setItem("puntos", actuales + pendientes);
        localStorage.setItem("puntosPen", "0");
        alert(`¡Puntos canjeados!. Obtuviste un total de ${pendientes}`);
    } else {
        alert("No tienes puntos nuevos para reclamar.");
    }
};

    document.getElementById("btn-consultar-puntos").onclick = () => {
        let saldo = localStorage.getItem("puntos") || "0";
        alert(`Tu saldo total acumulado es de: ${saldo} puntos.`);
    };

    document.getElementById("p-online").onchange = () => {
        document.getElementById("online").style.display = "flex"; 
		document.getElementById("presencial").style.display = "none";
    };
    document.getElementById("p-presencial").onchange = () => {
        document.getElementById("online").style.display = "none"; 
		document.getElementById("presencial").style.display = "flex";
    };

    actualizar();
});