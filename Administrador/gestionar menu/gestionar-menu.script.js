document.addEventListener("DOMContentLoaded", () => {
    let lista = document.getElementById("lista");
    let form = document.getElementById("form");

    let prDefaults = "pr1|Empanadas|img1#pr2|Pan Relleno|img2#pr3|Tequeños|img3#pr4|Postre de frambuesas|img4#pr5|Salchipapas|img5#pr6|Sandwich|img6#pr7|Hamburguesa|img7#pr8|Postre de mandarinas|img8#pr9|Pizza|img9#pr10|Pollo frito|img10";

    if (!localStorage.getItem("productos")) {
        localStorage.setItem("productos", prDefaults);
    }

    function cargarYMostrar() {
        let datos = localStorage.getItem("productos") || "";
        lista.innerHTML = "";
        if (datos === "") return;

        let productos = datos.split("#");
       productos.forEach((p, index) => {
            let d = p.split("|"); 
            if (d.length < 3) return;

            let fila = document.createElement("tr");
            
            fila.innerHTML = `
                <td><strong>${d[0]}</strong></td>
                <td>${d[1]}</td>
                <td><button class="btn-rojo" onclick="eliminar(${index})">Eliminar</button></td>
            `;
            lista.appendChild(fila);
        });
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        let id = document.getElementById("prod-id").value.trim();
        let nom = document.getElementById("prod-nombre").value.trim();
        let img = document.getElementById("prod-img").value.trim();

        let datosAc = localStorage.getItem("productos") || "";
        let nuevoPr = `${id}|${nom}|${img}`;

        let resultado = (datosAc === "") ? nuevoPr : datosAc + "#" + nuevoPr;
        
        localStorage.setItem("productos", resultado);
        form.reset();
        cargarYMostrar();
    };

    window.eliminar = (idx) => {
        if(!confirm("¿Deseas quitar este producto del menú?")) return;
        let productos = localStorage.getItem("productos").split("#");
        productos.splice(idx, 1);
        localStorage.setItem("productos", productos.join("#"));
        cargarYMostrar();
    };

    cargarYMostrar();
});