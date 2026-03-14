let parametros = window.location.search;
let url = new URLSearchParams(parametros);
let idProducto = url.get('id');

let catalogo = {
    "pr1": {
        titulo: "Empanadas",
        imagen: "../imagenes/empanadas.jpg",
        precio: "1.50$",
        descripcion: "Unas deliciosas empanadas rellenas de carne molida",
        disponible: "30",
        total: "1.50$"
    },
    "pr2": {
        titulo: "Pan Relleno",
        imagen: "../imagenes/pan%20relleno.jpg",
        precio: "1$",
        descripcion: "Deliciosos panes rellenos de dulce de guallaba",
        disponible: "70",
        total: "1$"
    },
    "pr3": {
        titulo: "Tequeños",
        imagen: "../imagenes/tequeños.jpg",
        precio: "1.50$",
        descripcion: "Increibles tequeños rellenos de mucho queso",
        disponible: "20",
        total: "1.50$"
    },
    "pr4": {
        titulo: "Postre de frambuesas con crema",
        imagen: "../imagenes/postre%20de%20frambuesas%20con%20crema.jpg",
        precio: "3$",
        descripcion: "Un postre para disfrutar de un dia maravilloso",
        disponible: "15",
        total: "3$"
    },
    "pr5": {
        titulo: "Salchipapas",
        imagen: "../imagenes/salchipapas.jpg",
        precio: "3.50$",
        descripcion: "Deleitate con este festin de un monton de papas y salchichas cubiertas de mucha salsa",
        disponible: "20",
        total: "3.50$"
    },
    "pr6": {
        titulo: "Sandwich",
        imagen: "../imagenes/sandwich.jpg",
        precio: "2$",
        descripcion: "Delicioso sandwich para quedar satisfecho",
        disponible: "30",
        total: "2$"
    },
    "pr7": {
        titulo: "Hamburguesa",
        imagen: "../imagenes/hamburguesas.jpg",
        precio: "5$",
        descripcion: "Perfecto para esas salidas universitarias",
        disponible: "45",
        total: "5$"
    },
    "pr8": {
        titulo: "Postre de mandarinas con crema",
        imagen: "../imagenes/postre%20de%20mandarinas%20con%20crema.jpg",
        precio: "3$",
        descripcion: "Unico e inolvidable sabor y experiencia que este postre puede ofrecerte",
        disponible: "20",
        total: "3$"
    },
    "pr9": {
        titulo: "Pizza",
        imagen: "../imagenes/pizza.jpg",
        precio: "20$",
        descripcion: "Una gran y deliciosa pizza para comer con amigos y quedar completamente llenos",
        disponible: "30",
        total: "20$"
    },
    "pr10": {
        titulo: "Pollo frito",
        imagen: "../imagenes/pollo%20frito.jpg",
        precio: "10$",
        descripcion: "El perfecto almuerzo que todo universitario quiere",
        disponible: "17",
        total: "10$"
    }
};

let producto = catalogo[idProducto];

if (producto) {
    document.getElementById('titulo').innerText = producto.titulo;
    document.getElementById('imagen').style.backgroundImage = `url('${producto.imagen}')`;
    document.getElementById("descripcion").innerText = producto.descripcion;
    document.getElementById("precio").innerHTML = producto.precio;
    document.getElementById("disponible").innerHTML = producto.disponible;
    document.getElementById("total").innerHTML = producto.total;
    
    let cantidad = document.getElementById("cantidad");
    cantidad.max = producto.disponible; 
    cantidad.min = 1;

    agregar();
    cargarReseñas();

} else {
    let datos = localStorage.getItem("productos") || "";
    let otroP = datos.split("#").some(p => p.split("|")[0] === idProducto);

    if (otroP) {
        document.body.innerHTML = `
            <div class="otroDiv">
                <h1>📦 Producto en proceso de almacenamiento</h1>
                <p>Este producto ha sido añadido recientemente al menú y sus detalles (precio y stock) se están actualizando.</p>
                <br>
                <a href="../cliente.html">Volver al catálogo</a>
            </div>
        `;
    } else {
        document.body.innerHTML = "<h1 class='error'>Producto no encontrado</h1>";
    }
}

function agregar() {
    let contador = document.getElementById("contador");
    let cantidad = document.getElementById("cantidad");
    let total = document.getElementById("total");
    let añadir = document.getElementById("añadir");
    let precioBase = parseFloat(producto.precio.replace('$', ''));

    function actualizar() {
        let carrito = localStorage.getItem('carrito') || 0;
        if(contador) contador.textContent = carrito;
    }
    actualizar();

    cantidad.addEventListener("input", () => {
        let cant = parseInt(cantidad.value);
        if (isNaN(cant) || cant < 1) {
            total.innerText = "0$";
            return;
        }
        let calculo = (precioBase * cant).toFixed(2);
        total.innerText = `${calculo}$`;
    });

    añadir.addEventListener("click", () => {
        let seleccionada = parseInt(cantidad.value);
        let disponible = parseInt(producto.disponible);
        
        if (seleccionada > disponible) {
            alert(`Lo sentimos, solo quedan ${disponible} unidades disponibles.`);
            cantidad.value = disponible;
            return; 
        }
        
        if (isNaN(seleccionada) || seleccionada < 1) return;

        let carritoDatos = localStorage.getItem('carritoData') || "";
        let enCarrito = carritoDatos ? carritoDatos.split("#") : [];
        let encontrado = false;
        let nuevoCarrito = [];

        for (let i = 0; i < enCarrito.length; i++) {
            let datos = enCarrito[i].split("|"); 
            if (datos[0] === producto.titulo) {
                let nuevaCant = parseInt(datos[1]) + seleccionada;
                let nuevoTotal = (parseFloat(datos[2]) + (precioBase * seleccionada)).toFixed(2);
                nuevoCarrito.push(`${datos[0]}|${nuevaCant}|${nuevoTotal}`);
                encontrado = true;
            } else {
                nuevoCarrito.push(enCarrito[i]);
            }
        }

        if (!encontrado) {
            let totalFila = (precioBase * seleccionada).toFixed(2);
            nuevoCarrito.push(`${producto.titulo}|${seleccionada}|${totalFila}`);
        }

        localStorage.setItem('carritoData', nuevoCarrito.join("#"));
        
        let totalItems = 0;
        nuevoCarrito.forEach(p => totalItems += parseInt(p.split("|")[1]));
        localStorage.setItem('carrito', totalItems);
        
        actualizar();
        alert("Añadido al carrito con éxito");
    });
}

function cargarReseñas() {
    let contenedor = document.getElementById("reseñas"); 
    if (!contenedor) return; 

    contenedor.innerHTML = "";
    let todas = localStorage.getItem("reseñas") || "";
    
    if (todas === "") {
        contenedor.innerHTML = "<p style='color: gray;'>Este producto aún no tiene reseñas. ¡Sé el primero en opinar!</p>";
        return;
    }

    let lista = todas.split("#");
    let hayReseñas = false;

    lista.forEach(r => {
        let datos = r.split("|"); 
        if (datos[0] === producto.titulo) {
            hayReseñas = true;
            let divReseña = document.createElement("div");
            divReseña.className = "reseña-item";
            divReseña.innerHTML = `
                <p>"${datos[1]}"</p>
                <small>⭐ Cliente Verificado</small>
            `;
            contenedor.appendChild(divReseña);
        }
    });

    if (!hayReseñas) {
        contenedor.innerHTML = "<p style='color: gray;'>Aún no hay reseñas para este producto.</p>";
    }
}