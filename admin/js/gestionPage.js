var gestionCompanie = JSON.parse(localStorage.getItem('gestionCompanie'));;

async function fetchEmpresa() {

    try {
        const response = await fetch(`http://localhost:3000/empresas/${this.gestionCompanie}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.empresa;
    } catch (error) {
        console.error('Error fetching company:', error);
        return []; // Retornar un array vacío en caso de error
    }
}

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


async function eliminarProducto(id) {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log(`Producto con ID ${id} eliminado exitosamente.`);
        } else {
            console.error(`No se pudo eliminar el producto con ID ${id}.`);
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
}

async function eliminarProductoEmpresa(id) {
    try {
        const response = await fetch(`http://localhost:3000/empresas/${this.gestionCompanie}/productos/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log(`Producto con ID ${id} eliminado exitosamente.`);
        } else {
            console.error(`No se pudo eliminar el producto con ID ${id}.`);
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
}


async function cargarInformacion() {

    const companieName = document.getElementById('companieName');
    const companieDescripcion = document.getElementById('companieDescripcion');
    //const companieCategory= document.getElementById('companieCategory');
    const companieDirection = document.getElementById('companieDirection');
    const companiePhone = document.getElementById('companiePhone');
    const companieEmail = document.getElementById('companieEmail');
    const productsList = document.getElementById('productsList');
    const btnGuardar = document.getElementById('btn-guardar');

   

    const empresa = await fetchEmpresa();


    document.getElementById('containerImgcardInfo').innerHTML = "";
    document.getElementById('containerImgcardInfo').innerHTML +=
        ` <img  src="${empresa.imagen}" class="card-img-top" alt="...">`;

    companieName.value = empresa.nombre;
    companieDescripcion.value = empresa.descripcion;
    //companieCategory.value=empresa.categoria;
    companieDirection.value = empresa.direccion;
    companiePhone.value = empresa.telefono;
    companieEmail.value = empresa.email;

    productsList.innerHTML = "";

    let count = 0;
    empresa.productos.forEach(async item => {

        const producto = await fetchProducto(item);
        count += 1;
        productsList.innerHTML +=
            `<tr>
                <th scope="row">${count}</th>
                <td>${producto._id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.precio}</td>
                <td>

                    <i type="button" onclick="renderModal('${producto._id}')"  data-bs-toggle="modal" data-bs-target="#detailProduct" class="fa-solid fa-pen-to-square" style="color: #878787;"></i>
                    <i type="button" id="eliminar-${producto._id}" onclick="advertir('${producto._id}')" class="fa-solid fa-trash" style="color: #878787;"></i>
                </td>
            </tr>`;


    });





}



function advertir(id) {
    const btnEliminar = document.getElementById(`eliminar-${id}`);

    if (!btnEliminar.disabled) {
        appendAlert("Esta apunto de eliminar un producto, si desea continuar presione el boton de eliminar de nuevo","warning");
        btnEliminar.disabled = true;
        btnEliminar.addEventListener('click', () => confirmarEliminacion(id));
    }
}

function confirmarEliminacion(id) {
    const btnEliminar = document.getElementById(`eliminar-${id}`);
    btnEliminar.disabled = true;

    const respuesta = window.confirm('¿Estás seguro de que deseas eliminar el producto?');
    if (respuesta) {
        eliminarProducto(id);
    }

    btnEliminar.disabled = false;
    btnEliminar.removeEventListener('click', confirmarEliminacion);
    btnEliminar.addEventListener('click', () => advertir(id));
}

async function eliminarProducto(id) {


    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log(`Producto con ID ${id} eliminado exitosamente.`);
        } else {
            console.error(`No se pudo eliminar el producto con ID ${id}.`);
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }

    try {
        const response = await fetch(`http://localhost:3000/empresas/${this.gestionCompanie}/productos/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log(`Producto con ID ${id} eliminado exitosamente.`);
        } else {
            console.error(`No se pudo eliminar el producto con ID ${id}.`);
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }

    cargarInformacion();
}

const alertPlaceholder = document.getElementById('advertenciaEliminacion');
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}


async function actualizarProducto(id) {
    const nombre = document.getElementById('productModalName').value
    const descripcion = document.getElementById('productModalDescripcion').value
    const precio = parseInt(document.getElementById('productModalPrecio').value)


    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion,
                precio: precio
            }),
        });
        const responseData = await response.json();
        console.log(responseData);
        appendAlert("Producto actualizado con exito","success");
    } catch (error) {
        console.error('Error en la solicitud:', error); // Manejo de errores de red u otros
    }

    cargarInformacion();
}

async function actualizarEmpresa() {
    const nombre = document.getElementById('companieName').value;
    const descripcion = document.getElementById('companieDescripcion').value;
    const direccion = document.getElementById('companieDirection').value;
    const telefono = document.getElementById('companiePhone').value;
    const email = document.getElementById('companieEmail').value;


    try {
        const response = await fetch(`http://localhost:3000/empresas/${this.gestionCompanie}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion,
                direccion: direccion,
                telefono: telefono,
                email: email
            }),
        });
        const responseData = await response.json();
        console.log(responseData);
        appendAlert("Empresa actualizada con exito","success");
    } catch (error) {
        console.error('Error en la solicitud:', error); // Manejo de errores de red u otros
    }

    cargarInformacion();
}

async function renderModal(id) {
    const modalFooter = document.getElementById('modalfooter');
    modalFooter.innerHTML = ""
    modalFooter.innerHTML =
        `<button onclick="actualizarProducto('${id}')" type="button" class="btn-proceed" data-bs-dismiss="modal">Guardar</button>
    <button type="button" class="btn-cancel " data-bs-dismiss="modal">Cancelar</button>`
    const producto = await fetchProducto(id);

    document.getElementById('productModalName').value = producto.nombre;
    document.getElementById('productModalCodigo').value = producto._id;
    document.getElementById('productModalCodigo').disabled = true;
    document.getElementById('productModalDescripcion').value = producto.descripcion;
    document.getElementById('productModalPrecio').value = producto.precio;

}

async function abrirModalAgregar(){
    const companie = await fetchEmpresa(this.gestionCompanie);
    const empresa=document.getElementById('agregarProductModalEmpresa');
    empresa.value=companie.nombre;
    empresa.disabled=true;

    const miModal = new bootstrap.Modal(document.getElementById('agregarProducto'));
    miModal.show();
}
async function agregarProducto(){
    let productId="";

    const nombre=document.getElementById('agregarProductModalName').value;
    const descripcion=document.getElementById('agregarProductModalDescripcion').value;
    const empresa=document.getElementById('agregarProductModalEmpresa').value;
    const imagen=document.getElementById('agregarProductModalImagen').value;
    const precio=parseInt(document.getElementById('agregarProductModalPrecio').value);

    

    //Ahora se debe agregar el producto a la colección de productos
    try {
        const response = await fetch(`http://localhost:3000/productos`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre:nombre,
                descripcion:descripcion,
                empresa:empresa,
                imagen:imagen,
                precio:precio
        }),
        });
        const responseData = await response.json();
        
        if (responseData.producto) {
            productId=responseData.producto._id;
            console.log("la prueba actual es", productId)
            
        } else {
            console.log('Notificacion fallido'); // Opcional: Manejo de error
            
        }
    } catch (error) {
        console.error('Error en la solicitud:', error); // Manejo de errores de red u otros
    }


    ///Ahora asociamos dicho producto a su empresa correspondiente

    try {
        const response = await fetch(`http://localhost:3000/empresas/${this.gestionCompanie}/productos`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id:productId
        }),
        });
        const responseData = await response.json();
        appendAlert("¡Enhorabuena!, has agregado un producto nuevo", "success");
    
        
    } catch (error) {
        console.error('Error en la solicitud:', error); // Manejo de errores de red u otros
    }
}



cargarInformacion();