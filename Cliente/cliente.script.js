(function verificarAcceso() {
    if (localStorage.getItem("sesionActiva") !== "true") {
        alert("Acceso denegado. Por favor, inicie sesión.");
        window.location.href = "../index.html"; 
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    let contenedor = document.getElementById("catalogo");
    let contador = document.getElementById("contador");

    if (contador) contador.textContent = localStorage.getItem('carrito') || 0;

    let productosDefault = "pr1|Empanadas|img1#pr2|Pan Relleno|img2#pr3|Tequeños|img3#pr4|Postre de frambuesas|img4#pr5|Salchipapas|img5#pr6|Sandwich|img6#pr7|Hamburguesa|img7#pr8|Postre de mandarinas|img8#pr9|Pizza|img9#pr10|Pollo frito|img10";

    let datos = localStorage.getItem("productos") || productosDefault;
    
    if (datos.trim() === "") {
        contenedor.innerHTML = "<p>No hay productos disponibles.</p>";
    } else {
        contenedor.innerHTML = ""; 
        let lista = datos.split("#");

        lista.forEach(item => {
            let dato = item.split("|");
            if (dato.length < 3) return;

            let divProduc = document.createElement("div");
            divProduc.className = "producto";
            divProduc.setAttribute("data-id", dato[0]);

            let imagen = "";

            if (datos[2].startsWith("http")) {
                imagen = `<div class="pr-img" style="background-image: url('${dato[2]}');></div>`;
            } else {
                imagen = `<div class="pr-img ${dato[2]}"></div>`;
            }

            divProduc.innerHTML = `${imagen}<h2 class="pr-titulo">${dato[1]}</h2>`;

            divProduc.addEventListener("click", () => {
                window.location.href = `detalles de los productos/detalles.html?id=${dato[0]}`;
            });

            contenedor.appendChild(divProduc);
        });
    }
});

document.getElementById("cerrarSesion").onclick = (e) => {
    e.preventDefault();
    localStorage.removeItem("sesionActiva");
    alert("Sesión cerrada. ¡Vuelva pronto!");
    window.location.href = "../index.html";
};