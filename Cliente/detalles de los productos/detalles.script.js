let parametros = window.location.search;
let url = new URLSearchParams(parametros);
const idProducto = url.get('id');

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
} else {
    document.body.innerHTML = "<h1>Producto no encontrado</h1>";
}

let contador = document.getElementById("contador");
let cantidad = document.getElementById("cantidad");
let total = document.getElementById("total");
let añadir = document.getElementById("añadir");

let precio = parseFloat(producto.precio.replace('$', ''));

function actualizar() {
    let carrito = localStorage.getItem('carrito') || 0;
    contador.textContent = carrito;
}
actualizar();

cantidad.addEventListener("input", () => {
    let cant = parseInt(cantidad.value);
    
    if (isNaN(cant) || cant < 1) {
        total.innerText = "0$";
        return;
    }

    let calculo = (precio * cant).toFixed(2);
    total.innerText = `${calculo}$`;
});

añadir.addEventListener("click", () => {
    let cantidadSe = parseInt(cantidad.value);
    let stock = parseInt(producto.disponible);
    
    if (cantidadSe > stock) {
        alert(`Lo sentimos, solo quedan ${stock} unidades disponibles.`);
        cantidad.value = stock; //
        return; 
    }
    
    if (isNaN(cantidadSe) || cantidadSe < 1) return;

    let carritoDatosP = localStorage.getItem('carritoData') || "";
    let productos = carritoDatosP ? carritoDatosP.split("#") : [];
    
    let productoEncontrado = false;
    let nuevoCarrito = [];

    // 2. Revisar si el producto ya existe para agruparlo
    for (let i = 0; i < productos.length; i++) {
        let datos = productos[i].split("|"); // [titulo, cantidad, total]
        if (datos[0] === producto.titulo) {
            let nuevaCant = parseInt(datos[1]) + cantidadSe;
            let nuevoTotal = (parseFloat(datos[2]) + (precio * cantidadSe)).toFixed(2);
            nuevoCarrito.push(`${datos[0]}|${nuevaCant}|${nuevoTotal}`);
            productoEncontrado = true;
        } else {
            nuevoCarrito.push(productos[i]);
        }
    }

    // 3. Si es nuevo, lo agregamos al final
    if (!productoEncontrado) {
        let totalFila = (precio * cantidadSe).toFixed(2);
        nuevoCarrito.push(`${producto.titulo}|${cantidadSe}|${totalFila}`);
    }

    // 4. Guardar de nuevo como string unido por #
    localStorage.setItem('carritoData', nuevoCarrito.join("#"));
    
    // Actualizar contador global (suma de cantidades)
    let totalItems = 0;
    nuevoCarrito.forEach(p => totalItems += parseInt(p.split("|")[1]));
    localStorage.setItem('carrito', totalItems);
    
    actualizar();
    alert("Añadido al carrito con éxito");
});


// --- LÓGICA DE RESEÑAS DINÁMICAS ---

function cargarResenas() {
    // 1. Buscamos el contenedor en el HTML
    let contenedorHTML = document.getElementById("reseñas"); 
    if (!contenedorHTML) return; // Si no existe el div, no hace nada

    // 2. Limpiamos por si hay contenido viejo
    contenedorHTML.innerHTML = "";

    // 3. Obtenemos los datos del LocalStorage
    let todasResenasRaw = localStorage.getItem("resenasData") || "";
    
    if (todasResenasRaw === "") {
        contenedorHTML.innerHTML = "<p style='color: gray;'>Este producto aún no tiene reseñas. ¡Sé el primero en comprarlo y opinar!</p>";
        return;
    }

    // 4. Separamos y filtramos por el título del producto actual
    let lista = todasResenasRaw.split("#");
    let hayResenas = false;

    lista.forEach(r => {
        let datos = r.split("|"); // [0]: Nombre Producto, [1]: Texto
        
        // Comparamos con el título que sacamos del catálogo arriba
        if (datos[0] === producto.titulo) {
            hayResenas = true;
            let divResena = document.createElement("div");
            divResena.className = "reseña-item"; // Para que le des estilo en CSS
            divResena.style.borderBottom = "1px solid #ddd";
            divResena.style.padding = "10px 0";
            divResena.innerHTML = `
                <p style="margin: 0; font-style: italic;">"${datos[1]}"</p>
                <small>⭐ Cliente Verificado</small>
            `;
            contenedorHTML.appendChild(divResena);
        }
    });

    if (!hayResenas) {
        contenedorHTML.innerHTML = "<p style='color: gray;'>Aún no hay reseñas para este producto.</p>";
    }
}

// --- EJECUCIÓN ---
// Llamamos a la función justo después de cargar los datos del producto
if (producto) {
    cargarResenas();
}