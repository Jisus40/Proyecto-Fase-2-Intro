document.addEventListener("DOMContentLoaded", () => {
    let contenedor = document.getElementById("lista");

    function reseñas() {
        let datos = localStorage.getItem("reseñas") || "";
        contenedor.innerHTML = "";

        if (datos === "") {
            contenedor.innerHTML = "<tr><td colspan='3' class='empty-msg'>No hay reseñas registradas por clientes.</td></tr>";
            return;
        }

        let lista = datos.split("#");

        lista.forEach((item, index) => {
            let d = item.split("|");
            
            if (d.length < 2) return;

            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td><strong>${d[0]}</strong></td>
                <td>"${d[1]}"</td>
                <td>
                    <button class="btn-borrar" onclick="eliminarResena(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            contenedor.appendChild(fila);
        });
    }

    window.eliminarResena = (idx) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este comentario?")) return;

        let datos = localStorage.getItem("reseñas") || "";
        let lista = datos.split("#");

        lista.splice(idx, 1);

        localStorage.setItem("reseñas", lista.join("#"));

        reseñas();
    };

    reseñas();
});