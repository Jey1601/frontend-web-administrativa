async function fetchNotificaciones() {

    try {
        const response = await fetch(`http://localhost:3000/notificaciones`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.notificaciones;
    } catch (error) {
        console.error('Error fetching company:', error);
        return []; // Retornar un array vacío en caso de error
    }
}

async function fetchNotificacion(id) {

    try {
        const response = await fetch(`http://localhost:3000/notificaciones/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.notificacion;
    } catch (error) {
        console.error('Error fetching company:', error);
        return []; // Retornar un array vacío en caso de error
    }
}






async function renderizarNotificaciones(){
    const driversList =document.getElementById('driversList');
    driversList.innerHTML="";

    const notificaciones = await fetchNotificaciones();
    let count=0;

        notificaciones.forEach(notificacion=>{
            if(notificacion.estado!="atendida"){
            count+=1;
            const motorista=notificacion.informacion;
            
            driversList.innerHTML+=
            `<tr>
            <th scope="row">${count}</th>
            <td>${motorista.identificacion}</td>
            <td>${motorista.nombre}</td>
            <td>${motorista.apellido}</td>
            <td>
            
                <i type="button" onclick="cargarInformacion('${motorista.nombre}','${motorista.apellido}','${motorista.identificacion}','${motorista.direccion}','${motorista.telefono}','${motorista.email}','${motorista.placa}', '${notificacion._id}')" class="fa-solid fa-eye" style="color: #878787;"></i>
                <i type="button"  onclick="aceptarSolicitud('${notificacion._id}')" class="fa-solid fa-circle-check" style="color: #878787;"></i>
                <i id="eliminar-${notificacion._id}" onclick="advertir('${notificacion._id}')" type="button" class="fa-solid fa-trash" style="color: #878787;"></i>
            </td>
        </tr>`}



        })
        
    

}

async  function cargarInformacion(nombre,apellido,identificacion,direccion,telefono,email,placa, ordenId){
    

    
    document.getElementById('driverName').value=nombre;
    document.getElementById('driverLastName').value=apellido;
    document.getElementById('driverId').value=identificacion;
    document.getElementById('driverDirection').value=direccion;
    document.getElementById('driverPhone').value=telefono;
    document.getElementById('driverEmail').value=email;
    document.getElementById('driverPlate').value=placa;

}


function advertir(id) {
    const btnEliminar = document.getElementById(`eliminar-${id}`);

    if (!btnEliminar.disabled) {
        appendAlert();
        btnEliminar.disabled = true;
        btnEliminar.addEventListener('click', () => confirmarEliminacion(id));
    }
}

function confirmarEliminacion(id) {
    const btnEliminar = document.getElementById(`eliminar-${id}`);
    btnEliminar.disabled = true;

    const respuesta = window.confirm('¿Estás seguro de que deseas eliminar  la solicitud?');
    if (respuesta) {
        eliminarNotificacion(id);
    }

    btnEliminar.disabled = false;
    btnEliminar.removeEventListener('click', confirmarEliminacion);
    btnEliminar.addEventListener('click', () => advertir(id));
}

async function eliminarNotificacion(id) {


    try {
        const response = await fetch(`http://localhost:3000/notificaciones/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log(`Solicitud con ID ${id} eliminado exitosamente.`);
            vaciarInputs();
        } else {
            console.error(`No se pudo eliminar la solicitud  con ID ${id}.`);
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }

    

    
    renderizarNotificaciones();
}

const alertPlaceholder = document.getElementById('advertenciaEliminacion');
const appendAlert = () => {
    const alertWrapper = document.createElement('div');
    alertWrapper.innerHTML = `
        <div class="alert alert-warning alert-dismissible" role="alert">
            <div>Estás a punto de eliminar una solicitud. Si deseas continuar con la eliminación, vuelve a presionar el botón de eliminar.</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    alertPlaceholder.appendChild(alertWrapper);
};

async function aceptarSolicitud(id){
    const respuesta = window.confirm('¿Estás seguro de que deseas  aceptar  la solicitud?');
    
    if (respuesta) {
    const notificacion=await fetchNotificacion(id);
    
    try {
        let respuesta = await fetch(`http://localhost:3000/motoristas`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json", // MIME Type
            },
            
            body: JSON.stringify(notificacion.informacion)
            
        });
        console.log("el motoristas a guardar es",notificacion.informacion)
        if (!respuesta.ok) {

            throw new Error(`HTTP error! Status: ${respuesta.status}`);

        }

        let mensaje = await respuesta.json();
        console.log(mensaje);


    } catch (error) {
        console.error('Error:', error);
    }

    //Actualizamos el estado de la notificacion
    try {
        let respuesta = await fetch(`http://localhost:3000/notificaciones/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({estado:"atendida"})
        });

        if (!respuesta.ok) {
            
            throw new Error(`HTTP error! Status: ${respuesta.status}`);
            
        }

        let mensaje = await respuesta.json();
        console.log(mensaje);

       const res = window.confirm("¡Motorista agregado con exito!");
       
        if(res){
           renderizarNotificaciones();
           vaciarInputs();
        }
    } catch (error) {
        console.error('Error:', error);
    }
    }
}

function vaciarInputs() {
    const inputs = document.querySelectorAll('input'); // Seleccionar todos los inputs

    inputs.forEach(input => {
        if (input.type !== 'submit' && input.type !== 'button') {
            input.value = ''; // Vaciar el valor del input, excepto para botones de envío
        }
    });

    const areas = document.querySelectorAll('textarea');
    areas.forEach(area=>{
        area.value=""
    });
}
renderizarNotificaciones();