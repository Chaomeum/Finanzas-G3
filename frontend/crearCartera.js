document.addEventListener('DOMContentLoaded', function() {
    // Código específico para la página de crear cartera
    const addBtn = document.getElementById('addDocumentoBtn');
    const modal = document.getElementById('documentoModal');
    const closeModal = document.querySelector('.close-modal');
    const documentoOptions = document.querySelectorAll('.documento-option');
    const modalSearch = document.getElementById('modalSearch');
    const documentosList = document.getElementById('documentosList');
    const documentosIds = document.getElementById('documentosIds');
    
    // Documentos seleccionados
    let selectedDocumentos = [];
    
    // Abrir modal - solo si existe el botón
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }
    
    // Cerrar modal - solo si existe el elemento
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Cerrar al hacer clic fuera del modal
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Búsqueda en el modal
    if (modalSearch) {
        modalSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            documentoOptions.forEach(option => {
                if (option.textContent.toLowerCase().includes(searchTerm)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            });
        });
    }
    
    // Seleccionar documento
    documentoOptions.forEach(option => {
        option.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const type = this.getAttribute('data-type');
            const number = this.getAttribute('data-number');
            
            // Verificar si ya está seleccionado
            if (!selectedDocumentos.some(doc => doc.id === id)) {
                selectedDocumentos.push({
                    id: id,
                    type: type,
                    number: number,
                    text: this.textContent.trim()
                });
                
                updateDocumentosList();
                updateHiddenField();
            }
            
            modal.style.display = 'none';
        });
    });
    
    // Actualizar lista de documentos seleccionados
    function updateDocumentosList() {
        if (!documentosList) return;
        
        documentosList.innerHTML = '';
        
        selectedDocumentos.forEach((doc, index) => {
            const docItem = document.createElement('div');
            docItem.className = 'documento-item-container';
            docItem.innerHTML = `
                <div class="documento-info">
                    ${doc.text}
                </div>
                <button type="button" class="btn-remove-documento" data-index="${index}">×</button>
            `;
            documentosList.appendChild(docItem);
        });
        
        // Agregar evento de eliminación
        document.querySelectorAll('.btn-remove-documento').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                selectedDocumentos.splice(index, 1);
                updateDocumentosList();
                updateHiddenField();
            });
        });
    }
    
    // Actualizar campo oculto para envío
    function updateHiddenField() {
        if (!documentosIds) return;
        documentosIds.value = selectedDocumentos.map(doc => doc.id).join(',');
    }
    
    // Manejo del formulario de creación de cartera
    const formCrearCartera = document.querySelector('.newCartera-form form');
    
    if (formCrearCartera) {
        formCrearCartera.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const tipoTasa = document.getElementById('tipoTasa').value;
            const tasa = document.getElementById('tasa').value;
            const plazoTasa = document.getElementById('plazoTasa').value;
            const capitalizacion = document.getElementById('capitalizacion').value;
            const moneda = document.getElementById('moneda').value;
            const documentos = document.getElementById('documentosIds').value;
            
            // Crear objeto de cartera
            const nuevaCartera = {
                tipoTasa,
                tasa,
                plazoTasa,
                capitalizacion,
                moneda,
                documentos,
                fechaCreacion: new Date().toISOString()
            };
            
            // Obtener carteras existentes para calcular el siguiente número
            let carteras = JSON.parse(localStorage.getItem('carteras') || '[]');
            const siguienteNumero = carteras.length + 1;
            
            // Generar nombre en el formato "Cartera #X"
            const nombreCartera = `Cartera #${siguienteNumero}`;
            
            // Guardar en localStorage
            guardarNuevaCartera(nombreCartera, nuevaCartera);
            
            // Mensaje de éxito
            alert('Cartera creada con éxito');
            
            // Redireccionar a la lista de carteras
            window.location.href = 'listaCarteras.html';
        });
    }
    
    // Función para guardar una nueva cartera
    function guardarNuevaCartera(nombre, datos) {
        // Obtener carteras existentes
        let carteras = JSON.parse(localStorage.getItem('carteras') || '[]');
        
        // Generar un ID único
        const nuevoId = '#' + (carteras.length + 1);
        
        // Añadir la nueva cartera
        carteras.push({
            id: nuevoId,
            nombre: nombre,
            datos: datos
        });
        
        // Guardar en localStorage
        localStorage.setItem('carteras', JSON.stringify(carteras));
    }
});