(function verificarAcceso() {
    // Verificamos si la llave existe
    if (localStorage.getItem("sesionActiva") !== "true") {
        alert("Acceso denegado. Por favor, inicie sesión.");
        // Ajusta la ruta para salir de la carpeta Cliente y llegar al index
        window.location.href = "../index.html"; 
    }
})();

let productos = document.querySelectorAll(".producto");

productos.forEach(producto => {
    producto.addEventListener('click', () => {
        let idProducto = producto.getAttribute('data-id');
        window.location.href = `detalles de los productos/detalles.html?id=${idProducto}`;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    let contador = document.getElementById("contador");
    if(contador) {
        contador.textContent = localStorage.getItem('carrito') || 0;
    }
});

document.getElementById("cerrarSesion").onclick = () => {
    // Quitamos la llave pero NO borramos historial ni puntos
    localStorage.removeItem("sesionActiva");
    
    alert("Sesión cerrada. ¡Vuelva pronto!");
    window.location.href = "../index.html";
};
