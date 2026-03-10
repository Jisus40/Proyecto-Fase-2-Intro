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
