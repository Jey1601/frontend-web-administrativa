async function fetchEmpresas() {
    try {
        const response = await fetch(`http://localhost:3000/empresas`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.empresas;
    } catch (error) {
        console.error('Error fetching company:', error);
        return []; // Retornar un array vacío en caso de error
    }
}

async function renderizarEmpresas() {
    const panel = document.getElementById('companiesPanel');
    panel.innerHTML = "";

    const empresas = await fetchEmpresas();

    empresas.forEach(function (empresa) {
        panel.innerHTML += `
            <div class="col-xxl-2 col-xl-2">
                <div class="card" style="width: auto;">
                    <div class="containerImgCard">
                        <img src="${empresa.imagen}" class="card-img-top" alt="...">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${empresa.nombre}</h5>
                        <p class="card-text">${empresa.descripcion}.</p>
                        <a onclick="changeGestionCompanie('${empresa._id}')"  href="./gestionPage.html" class="manageCompanie">Gestionar</a>
                    </div>
                </div>
            </div>`;
    });
}

function changeGestionCompanie(id) {
    localStorage.setItem('gestionCompanie', JSON.stringify(id));
}

renderizarEmpresas();
