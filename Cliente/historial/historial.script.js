document.addEventListener("DOMContentLoaded", () => {
    let contenedor = document.getElementById("contenedor");
    let historial = localStorage.getItem("historial") || "";
    let modal = document.getElementById("modal");
    let enviar = document.getElementById("btn-enviar");
    let accion = document.getElementById("texto");
    
    let productoSe = "";
    let tipoAccion = ""; 

    if (historial === "") {
        contenedor.innerHTML = "<p>No hay compras registradas en tu cuenta.</p>";
    } else {
        let bloques = historial.split("%%");
        
        bloques.forEach((bloque, index) => {
            let divCompra = document.createElement("div");
            divCompra.className = "bloque-compra";
            
            let titulo = document.createElement("h4");
            titulo.innerText = `Pedido #${bloques.length - index}`;
            divCompra.appendChild(titulo);

            let productos = bloque.split("#");
            
            productos.forEach(p => {
                let d = p.split("|"); 
                if (d.length < 3) return;
				
                let itemDiv = document.createElement("div");
                itemDiv.className = "item";
             
                let descuento = "";
                let ahorro = parseFloat(d[3]) || 0;
                if (ahorro > 0) {
                    descuento = `<span style="color: #27ae60; font-weight: bold; margin-left: 10px;">
					(Descuento aplicado: -${ahorro.toFixed(2)}$)</span>`;
                }

                itemDiv.innerHTML = `
                    <p>
                        <strong>${d[0]}</strong> — Cantidad: ${d[1]} — Total: ${d[2]}$
                        ${descuento}
                    </p>
                    <div class="acciones">
                        <button class="btn-reseña" onclick="abrirModal('${d[0]}', 'reseña')">Añadir Reseña</button>
                        <button class="btn-link" onclick="abrirModal('${d[0]}', 'queja')">Realizar Queja</button>
                    </div>
                `;
                divCompra.appendChild(itemDiv);
            });
            
            contenedor.appendChild(divCompra);
        });
    }

    window.abrirModal = (nombre, tipo) => {
        productoSe = nombre;
        tipoAccion = tipo;
        
        document.getElementById("modal-titulo").innerText = (tipo === 'reseña') 
            ? `Escribir reseña para: ${nombre}` 
            : `Reportar queja para: ${nombre}`;
            
        accion.placeholder = (tipo === 'reseña') 
            ? "Cuéntanos qué te pareció el producto..." 
            : "Describe el problema con tu pedido...";
            
        modal.classList.remove("oculto");
    };

    window.cerrarModal = () => {
        modal.classList.add("oculto");
        accion.value = "";
    };

    let cancelar = document.getElementById("btn-cancelar");
    if(cancelar) cancelar.onclick = cerrarModal;

    enviar.onclick = () => {
        let mensaje = accion.value.trim();
        if (mensaje === "") {
            alert("Por favor, escribe un mensaje antes de enviar.");
            return;
        }

        if (tipoAccion === 'reseña') {
            let reseñas = localStorage.getItem("reseñas") || "";
            let nuevaReseña = `${productoSe}|${mensaje}`;
            
            let dataFinal = (reseñas === "") 
                ? nuevaReseña 
                : reseñas + "#" + nuevaReseña;
            
            localStorage.setItem("reseñas", dataFinal);
            alert("¡Muchas gracias! Tu reseña ha sido guardada y aparecerá en la página del producto.");
        } else {
            alert("Su queja ha sido enviada con éxito. Nuestro equipo la revisará pronto.");
        }

        cerrarModal();
    };
});