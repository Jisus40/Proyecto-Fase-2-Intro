document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-historial");
    const rawData = localStorage.getItem("historialData") || "";
    const modal = document.getElementById("modal-accion");
    const btnEnviar = document.getElementById("btn-enviar");
    const txtAccion = document.getElementById("texto-accion");
    
    let productoSeleccionado = "";
    let tipoAccion = ""; 

    // --- 1. RENDERIZAR EL HISTORIAL ---
    if (rawData === "") {
        contenedor.innerHTML = "<p>No hay compras registradas en tu cuenta.</p>";
    } else {
        // Separamos por bloques de compra completa (%%)
        let bloques = rawData.split("%%");
        
        bloques.forEach((bloque, index) => {
            // Contenedor visual para el grupo de productos de esta compra
            let divCompra = document.createElement("div");
            divCompra.className = "bloque-compra";
            divCompra.style.borderBottom = "2px dashed #ccc";
            divCompra.style.padding = "15px 0";
            divCompra.style.marginBottom = "10px";
            
            // Título de la compra (Compra #1, #2, etc.)
            let tituloCompra = document.createElement("h4");
            tituloCompra.innerText = `Pedido #${bloques.length - index}`;
            divCompra.appendChild(tituloCompra);

            // Separamos productos dentro de este bloque (#)
            let productos = bloque.split("#");
            
            productos.forEach(p => {
                let d = p.split("|"); 
                // d[0]=Nombre, d[1]=Cant, d[2]=PrecioPagado, d[3]=Ahorro
                if (d.length < 3) return;

                // Crear el elemento visual del producto
                let itemDiv = document.createElement("div");
                itemDiv.className = "item-historial";
                itemDiv.style.margin = "10px 0";
                
                // Lógica para mostrar el descuento si existió ahorro
                let descuentoHTML = "";
                let ahorroNum = parseFloat(d[3]) || 0;
                if (ahorroNum > 0) {
                    descuentoHTML = `<span style="color: #27ae60; font-weight: bold; margin-left: 10px;">
                        (Descuento aplicado: -${ahorroNum.toFixed(2)}$)
                    </span>`;
                }

                itemDiv.innerHTML = `
                    <p>
                        <strong>${d[0]}</strong> — Cantidad: ${d[1]} — Total: ${d[2]}$
                        ${descuentoHTML}
                    </p>
                    <div class="acciones">
                        <button class="btn-puntos" onclick="abrirModal('${d[0]}', 'resena')" style="background: #000; color: #fff; border: none; padding: 5px 10px; cursor: pointer;">Añadir Reseña</button>
                        <button class="btn-link" onclick="abrirModal('${d[0]}', 'queja')" style="background: none; border: none; color: #e74c3c; text-decoration: underline; cursor: pointer; margin-left: 10px;">Realizar Queja</button>
                    </div>
                `;
                divCompra.appendChild(itemDiv);
            });
            
            contenedor.appendChild(divCompra);
        });
    }

    // --- 2. FUNCIONES DEL MODAL (RESEÑA / QUEJA) ---
    window.abrirModal = (nombre, tipo) => {
        productoSeleccionado = nombre;
        tipoAccion = tipo;
        
        // Cambiar títulos según la acción
        document.getElementById("modal-titulo").innerText = (tipo === 'resena') 
            ? `Escribir reseña para: ${nombre}` 
            : `Reportar queja para: ${nombre}`;
            
        txtAccion.placeholder = (tipo === 'resena') 
            ? "Cuéntanos qué te pareció el producto..." 
            : "Describe el problema con tu pedido...";
            
        modal.classList.remove("oculto");
    };

    window.cerrarModal = () => {
        modal.classList.add("oculto");
        txtAccion.value = "";
    };

    // Asignar evento al botón cancelar del HTML
    const btnCancelar = document.getElementById("btn-cancelar");
    if(btnCancelar) btnCancelar.onclick = cerrarModal;

    // --- 3. PROCESAR EL ENVÍO DEL MODAL ---
    btnEnviar.onclick = () => {
        let mensaje = txtAccion.value.trim();
        if (mensaje === "") {
            alert("Por favor, escribe un mensaje antes de enviar.");
            return;
        }

        if (tipoAccion === 'resena') {
            // Guardar en resenasData: Nombre|Texto#Nombre|Texto
            let resenasPrevias = localStorage.getItem("resenasData") || "";
            let nuevaResena = `${productoSeleccionado}|${mensaje}`;
            
            let dataFinal = (resenasPrevias === "") 
                ? nuevaResena 
                : resenasPrevias + "#" + nuevaResena;
            
            localStorage.setItem("resenasData", dataFinal);
            alert("¡Muchas gracias! Tu reseña ha sido guardada y aparecerá en la página del producto.");
        } else {
            // Las quejas solo muestran alerta por ahora
            alert("Su queja ha sido enviada con éxito. Nuestro equipo la revisará pronto.");
        }

        cerrarModal();
    };
});