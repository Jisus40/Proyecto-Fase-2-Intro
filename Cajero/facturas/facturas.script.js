document.addEventListener("DOMContentLoaded", () => {
    let contenedor = document.getElementById("lista");
    let recibos = localStorage.getItem("recibos") || "";

    if (recibos === "") {
        contenedor.innerHTML = "<p class='error'>No hay facturas emitidas hoy.</p>";
        return;
    }

    let facturas = recibos.split("%%");
    contenedor.innerHTML = "";

    facturas.forEach(f => {
        let ultimoPF = f.lastIndexOf("|");
        let fecha = f.substring(ultimoPF + 1);
        let cuerpo = f.substring(0, ultimoPF);

        let primerP = cuerpo.indexOf("|");
        let ultimoP = cuerpo.lastIndexOf("|");

        let nombre = cuerpo.substring(0, primerP);
        let total = cuerpo.substring(ultimoP + 1);
        let productos1 = cuerpo.substring(primerP + 1, ultimoP);

        let card = document.createElement("div");
        card.className = "factura-bloque";

        let lista = "";
        let productos2 = productos1.split(";");
        productos2.forEach(p => {
            let d = p.split("|");
            if (d.length >= 2) {
                lista += `
                <li>
                    <span>${d[0].trim()} (x${d[1]})</span>
                    <span>${d[2]}$</span>
                </li>`;
            }
        });

        card.innerHTML = `
            <div class="etiqueta-finalizado">COMPRA FINALIZADA</div>
            <div class="cliente-info">
                <h2>${nombre}</h2>
                <p>Emitido el: ${fecha}</p>
            </div>
            <ul style="list-style: none; padding: 0; margin: 30px 0;">
                ${lista}
            </ul>
            <div class="total-final">
                <span>TOTAL PAGADO:</span> ${total}$
            </div>
        `;
        contenedor.appendChild(card);
    });
});