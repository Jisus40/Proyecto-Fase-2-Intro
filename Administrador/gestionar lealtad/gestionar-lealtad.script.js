document.addEventListener("DOMContentLoaded", () => {
    let display = document.getElementById("puntos");
    let ajustes = document.getElementById("ajuste");

    function actualizar() {
        let puntos = parseInt(localStorage.getItem("puntos")) || 0;
        display.innerText = puntos;
        
        display.style.color = puntos > 0 ? "#2ecc71" : "#e74c3c";
    }

    function guardar(nuevoTotal) {
        if (nuevoTotal < 0) nuevoTotal = 0;
        localStorage.setItem("puntos", nuevoTotal);
        actualizar();
    }

    document.getElementById("btn-sumar").onclick = () => {
        let actual = parseInt(localStorage.getItem("puntos")) || 0;
        let ajuste = parseInt(ajustes.value) || 0;
        guardar(actual + ajuste);
    };

    document.getElementById("btn-restar").onclick = () => {
        let actual = parseInt(localStorage.getItem("puntos")) || 0;
        let ajuste = parseInt(ajustes.value) || 0;
        guardar(actual - ajuste);
    };

    document.getElementById("btn-reset").onclick = () => {
        if(confirm("¿Estás seguro de que quieres poner a 0 los puntos de este usuario?")) {
            guardar(0);
        }
    };

    actualizar();
});