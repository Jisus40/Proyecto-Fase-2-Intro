document.addEventListener("DOMContentLoaded", () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    if (sesionActiva !== "true") {
        console.warn("Intento de acceso no autorizado detectado.");
        window.location.href = "../index.html"; 
        return;
    }

    let cerrarSesion = document.getElementById("cerrar-sesion");
    
    cerrarSesion.addEventListener("click", () => {
        if (confirm("¿Está seguro de que desea cerrar la sesión de administración?")) {
            localStorage.removeItem("sesionActiva");
            window.location.href = "../index.html";
        }
    });
});