async function fetchProducto(id) {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.producto;
    } catch (error) {
        console.error('Error fetching product:', error);
        return [];
    }
}

async function fetchOrden(id) {
    try {
        const response = await fetch(`http://localhost:3000/ordenes/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.orden;
    } catch (error) {
        console.error('Error fetching order:', error);
        return [];
    }
}

async function fetchOrdenes() {
    try {
        const response = await fetch(`http://localhost:3000/ordenes/pendientes`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.ordenes;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

async function fetchUsuario(id) {
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${id}/datos`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.usuario;
    } catch (error) {
        console.error('Error fetching user:', error);
        return [];
    }
}

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

async function renderizarOrdenes() {
     const ordersList=document.getElementById('ordersList');
     const ordenes = await fetchOrdenes();

    ordersList.innerHTML="";
   
    let count=0;
    ordenes.forEach(async orden => {
    const usuario = await fetchUsuario(orden.idUsuario)
    count+=1;    
    ordersList.innerHTML+= 
                    `<tr>
                        <th scope="row">${count}</th>
                        <td>${orden._id.substr(-4)}</td>
                        <td>${usuario._id}</td>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.apellido}</td>
                        <td>
                            <i onclick="mostrarDetalle('${usuario.nombre}','${usuario.apellido}','${usuario.telefono}','${orden._id}')" type="button" data-bs-toggle="modal" data-bs-target="#detailOrderModal" class="fa-solid fa-eye" style="color: #878787;"></i>
                            <i onclick="cargarMotoristas('${orden._id}')"  type="button"  class="fa-solid fa-truck" style="color: #878787;"></i>
                            <i type="button" id="eliminar-${orden._id}" onclick="advertir('${orden._id}')" class="fa-solid fa-trash" style="color: #878787;"></i>
                        </td>
                    </tr>`;
   
    });
                
               
                    
            
         

}

function cargarMotoristas(ordenId){
    renderDriversList(ordenId);

    const modalMotorista = new bootstrap.Modal(document.getElementById('selectDelivery'));
    modalMotorista.show();

}   

async function renderDriversList(ordenId){
    const driversList = document.getElementById('driversList');
    const footer=document.getElementById('driversFooter');
    driversList.innerHTML="";

    const motoristas = await fetchMotoristas();
    let count=0;
    motoristas.forEach(motorista=>{
        count+=1;
        driversList.innerHTML+=
        `<tr>
            <th scope="row">${count}</th>
            <td>${motorista.identificacion}</td>
            <td>${motorista.nombre}</td>
            <td>${motorista.apellido}</td>
            <td><input value="${motorista._id}" name="select" id="select-${motorista._id}" type="radio"><label for="select-${motorista._id}"> Seleccionar</label></td>
        </tr>`
    })
   
    footer.innerHTML=
    ` <button onclick="asignarOrden('${ordenId}')" data-bs-dismiss="modal" type="button" class="btn-proceed">Asignar Orden</button>
    <button type="button" class="btn-cancel " data-bs-dismiss="modal">Cancelar</button>`
    

}


async function asignarOrden(ordenId){
    const radios = document.getElementsByName('select');
    let motoristaId="";
    for (const radio of radios) {
        if (radio.checked) {
            console.log('Valor seleccionado:', radio.value);
            motoristaId=radio.value;
            break; // Detener el bucle después de encontrar el seleccionado
        }
    }

    actualizarOrden(ordenId,motoristaId);
    
}

async function mostrarDetalle(nombreUsuario, apellidoUsuario, telefonoUsuario, ordenId) {
    const numerOrden = document.getElementById('orden');
    const nombre = document.getElementById('nombreClient');
    const apellido = document.getElementById('apellidoClient');
    const telefono = document.getElementById('telefonoClient');
    const direccion = document.getElementById('direccionClient');
   
    const orden = await fetchOrden(ordenId);

    numerOrden.innerHTML = ordenId.substr(-4);
    nombre.innerHTML = nombreUsuario;
    apellido.innerHTML = apellidoUsuario;
    telefono.innerHTML = telefonoUsuario;
    direccion.innerHTML = orden.ubicacion;

    const tabla = document.getElementById('cuerpoTabla');
    tabla.innerHTML = "";

    let count = 0;
    for (const item of orden.productos) {
        const producto = await fetchProducto(item._id.$oid);//.$oid
        count += 1;
        tabla.innerHTML += `
            <tr>
                <th scope="row">${count}</th>
                <td>${producto.nombre}</td>
                <td>${producto.empresa}</td>
                <td>${item.cantidad}</td>
            </tr>`;
    }

    
}

async function actualizarOrden(ordeniId,motoristaId) {
    const datos = {
        estado: "tomada",
        idMotorista: motoristaId
    };

    try {
        let respuesta = await fetch(`http://localhost:3000/ordenes/${ordeniId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            
            throw new Error(`HTTP error! Status: ${respuesta.status}`);
            
        }

        let mensaje = await respuesta.json();
        console.log(mensaje);

       const res = window.confirm("¡Orden actualizada con exito!");
        if(res){
            renderizarOrdenes();
        }
    } catch (error) {
        console.error('Error:', error);
    }

}

async function eliminarOrden(id) {

    try {
        const response = await fetch(`http://localhost:3000/ordenes/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log(`Orden con ID ${id} eliminada exitosamente.`);
        } else {
            console.error(`No se pudo eliminar la orden con ID ${id}.`);
        }
    } catch (error) {
        console.error('Error al eliminar lar orden:', error);
    }


    renderizarOrdenes();
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

    const respuesta = window.confirm('¿Estás seguro de que deseas eliminar el producto?');
    if (respuesta) {
        eliminarOrden(id);
    }

    btnEliminar.disabled = false;
    btnEliminar.removeEventListener('click', confirmarEliminacion);
    btnEliminar.addEventListener('click', () => advertir(id));
}

const alertPlaceholder = document.getElementById('advertenciaEliminacion');
const appendAlert = () => {
    const alertWrapper = document.createElement('div');
    alertWrapper.innerHTML = `
        <div class="alert alert-warning alert-dismissible" role="alert">
            <div>Estás a punto de eliminar un producto. Si deseas continuar con la eliminación, vuelve a presionar el botón de eliminar.</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    alertPlaceholder.appendChild(alertWrapper);
};
renderizarOrdenes();