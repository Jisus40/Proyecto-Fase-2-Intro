document.addEventListener("DOMContentLoaded", () => {
    let lista = document.getElementById("lista-bloqueados");
    let usuario = document.getElementById("usuario-a-bloquear");
    let bloquear = document.getElementById("btn-bloquear");

    function cargarBloqueados() {
        let datos = localStorage.getItem("bloqueados") || "";
        lista.innerHTML = "";

        if (datos === "") {
            lista.innerHTML = "<tr><td colspan='2'>No hay usuarios bloqueados.</td></tr>";
            return;
        }

        let bloqueados = datos.split("#");
        bloqueados.forEach((user, index) => {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${user}</td>
                <td><button class="btn-desbloquear" onclick="desbloquear(${index})">Levantar Bloqueo</button></td>
            `;
            lista.appendChild(fila);
        });
    }

bloquear.onclick = () => {
    let user = usuario.value.trim().replace(/['"]+/g, ''); 
    
    if (user === "") return;

    let datos = localStorage.getItem("bloqueados") || "";
    let bloqueados = datos === "" ? [] : datos.replace(/['"]+/g, '').split("#");

    if (bloqueados.includes(user)) {
        alert("Este usuario ya está bloqueado.");
    } else {
        bloqueados.push(user);
        localStorage.setItem("bloqueados", bloqueados.join("#"));
        usuario.value = "";
        cargarBloqueados();
    }
};

    window.desbloquear = (index) => {
        let bloqueados = localStorage.getItem("bloqueados").split("#");
        bloqueados.splice(index, 1);
        localStorage.setItem("bloqueados", bloqueados.join("#"));
        cargarBloqueados();
    };

    cargarBloqueados();
});