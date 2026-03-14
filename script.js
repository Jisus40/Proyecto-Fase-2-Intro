let iniciarSesion = document.getElementById("iniciar");
let mostrar = document.getElementById("iniciar-sesion");
let formulario = document.getElementById("formulario");
let entrar = document.getElementById("entrar");
let usuario = document.getElementById("usuario");
let contraseña = document.getElementById("contraseña");
let bloqueados = localStorage.getItem("bloqueados") || "";
let listaBloqueados = bloqueados !== "" ? bloqueados.replace(/['"]+/g, '').split("#") : [];

iniciarSesion.addEventListener('click', () => {
    mostrar.style.display = "flex";
    mostrar.scrollIntoView({ behavior: 'smooth' });
});

entrar.onclick = function(event){
    event.preventDefault();
	
    let nombre = usuario.value.trim().replace(/['"]+/g, '');

    if (listaBloqueados.includes(nombre)) {
        alert("⛔ ACCESO DENEGADO: Tu cuenta ha sido suspendida por el administrador.");
        return; 
    }
    if(nombre == "ClienteUCV" && contraseña.value == "Central_123"){
		localStorage.setItem("sesionActiva", "true");
         window.location.href = "Cliente/cliente.html";	
    }else if(nombre == "adminRoot" && contraseña.value == "cafetinAdmin"){
			localStorage.setItem("sesionActiva", "true");
        	window.location.href = "Administrador/admin.html";	
    }else if(nombre == "caja_01" && contraseña.value == "Cajero#123"){
			localStorage.setItem("sesionActiva", "true");
        	window.location.href = "Cajero/cajero.html";	
    }else{
        alert("usuario o contraseña invalidos");
    }
};
