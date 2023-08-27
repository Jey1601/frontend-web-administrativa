async function fetchMotoristas() {

    try {
        const response = await fetch(`http://localhost:3000/motoristas`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.motoristas;
    } catch (error) {
        console.error('Error fetching company:', error);
        return []; // Retornar un array vacío en caso de error
    }
}

async function fetchMotorista(id) {

    try {
        const response = await fetch(`http://localhost:3000/motoristas/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.motorista;
    } catch (error) {
        console.error('Error fetching company:', error);
        return []; // Retornar un array vacío en caso de error
    }
}


async function renderizarListaMotoristas(){
    const driversList =document.getElementById('driversList');
    driversList.innerHTML="";

    const motoristas = await fetchMotoristas();
    let count=0;

        motoristas.forEach(motorista=>{
            count+=1;

            driversList.innerHTML+=
            `<tr>
            <th scope="row">${count}</th>
            <td>${motorista._id}</td>
            <td>${motorista.nombre}</td>
            <td>${motorista.apellido}</td>
            <td>
            
                <i type="button" onclick="cargarInformacion('${motorista._id}')" class="fa-solid fa-eye" style="color: #878787;"></i>
                <i id="eliminar-${motorista._id}" onclick="advertir('${motorista._id}')" type="button" class="fa-solid fa-trash" style="color: #878787;"></i>
            </td>
        </tr>`



        })
        
    

}

async  function cargarInformacion(id){
    const motorista= await fetchMotorista(id);

    
    document.getElementById('driverName').value=motorista.nombre;
    document.getElementById('driverLastName').value=motorista.apellido;
    document.getElementById('driverId').value=motorista.identificacion;
    document.getElementById('driverDirection').value=motorista.direccion;
    document.getElementById('driverPhone').value=motorista.telefono;
    document.getElementById('driverEmail').value=motorista.email;
    document.getElementById('driverPlate').value=motorista.placa;

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

    const respuesta = window.confirm('¿Estás seguro de que deseas eliminar a el motorista?');
    if (respuesta) {
        eliminarMotorista(id);
    }

    btnEliminar.disabled = false;
    btnEliminar.removeEventListener('click', confirmarEliminacion);
    btnEliminar.addEventListener('click', () => advertir(id));
}

async function eliminarMotorista(id) {


    try {
        const response = await fetch(`http://localhost:3000/motoristas/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log(`Motorista con ID ${id} eliminado exitosamente.`);
            vaciarInputs();
        } else {
            console.error(`No se pudo eliminar el motorista con ID ${id}.`);
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }

    

    
renderizarListaMotoristas();
}

const alertPlaceholder = document.getElementById('advertenciaEliminacion');
const appendAlert = () => {
    const alertWrapper = document.createElement('div');
    alertWrapper.innerHTML = `
        <div class="alert alert-warning alert-dismissible" role="alert">
            <div>Estás a punto de eliminar un motorista. Si deseas continuar con la eliminación, vuelve a presionar el botón de eliminar.</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    alertPlaceholder.appendChild(alertWrapper);
};

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

renderizarListaMotoristas();
