<<<<<<< HEAD
let iniciarSesion = document.getElementById("iniciar");
let mostrar = document.getElementById("iniciar-sesion");
let formulario = document.getElementById("formulario");
let entrar = document.getElementById("entrar");
let usuario = document.getElementById("usuario");
let contraseña = document.getElementById("contraseña");

iniciarSesion.addEventListener('click', () => {
    mostrar.style.display = "flex";
    formulario.style.display = "flex";
    mostrar.scrollIntoView({ behavior: 'smooth' });
});

entrar.onclick = function(event){
    event.preventDefault();
    if(usuario.value == "ClienteUCV" && contraseña.value == "Central_123"){
        window.location.href = "Cliente/cliente.html";
    }else if(usuario.value == "adminRoot" && contraseña.value == "cafetinAdmin"){
        alert("funciono");
        window.location.href = "Administrador/admin.html";
    }
    else if(usuario.value == "Reparto12" && contraseña.value == "rep4568"){
        alert("funciono");
        window.location.href = "Reparto/reparto.html";
    }else if(usuario.value == "Cocinero45" && contraseña.value == "coci1397"){
        alert("funciono");
        window.location.href = "Cocina/cocina.html";
    }else if(usuario.value == "caja_01" && contraseña.value == "Cajero#123"){
        alert("funciono");
        window.location.href = "Cajero/cajero.html";
    }else{
        alert("usuario o contraseña invalidos");
    }
};

=======
let iniciarSesion = document.getElementById("iniciar");
let mostrar = document.getElementById("iniciar-sesion");
let formulario = document.getElementById("formulario");
let entrar = document.getElementById("entrar");
let usuario = document.getElementById("usuario");
let contraseña = document.getElementById("contraseña");

iniciarSesion.onclick = function(){
	mostrar.style.display = "flex";
	formulario.style.display = "flex";
};

entrar.onclick = function(event){
    event.preventDefault();
    if(usuario.value == "Cliente26" && contraseña.value == 123456789){
        window.location.href = "Cliente/cliente.html";
    }else if(usuario.value == "Admin" && contraseña.value == "2589vml12"){
        alert("funciono");
        window.location.href = "Administrador/admin.html";
    }
    else if(usuario.value == "Reparto12" && contraseña.value == "rep4568"){
        alert("funciono");
        window.location.href = "Reparto/reparto.html";
    }else if(usuario.value == "Cocinero45" && contraseña.value == "coci1397"){
        alert("funciono");
        window.location.href = "Cocina/cocina.html";
    }else if(usuario.value == "Cajero11" && contraseña.value == "Caj2956"){
        alert("funciono");
        window.location.href = "Cajero/cajero.html";
    }else{
        alert("usuario o contraseña invalidos");
    }
};

>>>>>>> 040ef4d (commit 5)
