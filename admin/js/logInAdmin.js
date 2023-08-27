
var localstorage = window.localStorage;

async function login(event) {
    event.preventDefault();

    const adminUser = document.getElementById("adminUser");
    const passwordInput = document.getElementById("adminPassword");

    const usuario = adminUser.value;
    const password = passwordInput.value;


    try {
        const response = await fetch(`http://localhost:3000/administradores/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario:usuario,
                contrasena: password,
            }),
        });
        const responseData = await response.json();
        if (responseData.administrador) {
            localStorage.setItem('admin', JSON.stringify(responseData.administrador));
            window.location.href = "./companies.html";
        } else {
            console.log('Inicio de sesión fallido'); // Opcional: Manejo de error
            appendAlert("¡oh!, parece que no recuerdas tus datos", "danger");
        }
    } catch (error) {
        console.error('Error en la solicitud:', error); // Manejo de errores de red u otros
    }
}

const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
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