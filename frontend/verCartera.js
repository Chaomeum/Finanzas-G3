document.addEventListener('DOMContentLoaded', function() {
    // Script específico para la página de ver cartera
    
    // Obtener el ID de la cartera de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const carteraId = urlParams.get('id') || '#1';
    
    // Actualizar el título de la cartera
    document.getElementById('carteraTitulo').textContent = `CARTERA ${carteraId}`;
    
    // Variables para la paginación
    let currentPage = 1;
    let rowsPerPage = 10;
    let documentosCartera = []; // Variable para almacenar los documentos de la cartera
    
    // Cargar los documentos asociados a esta cartera desde localStorage
    cargarDocumentosDesdeStorage();
    
    // Configurar eventos de paginación
    document.getElementById('firstPage').addEventListener('click', function() {
        currentPage = 1;
        cargarTabla();
    });
    
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            cargarTabla();
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', function() {
        const maxPages = Math.ceil(documentosCartera.length / rowsPerPage);
        if (currentPage < maxPages) {
            currentPage++;
            cargarTabla();
        }
    });
    
    document.getElementById('lastPage').addEventListener('click', function() {
        currentPage = Math.ceil(documentosCartera.length / rowsPerPage);
        cargarTabla();
    });
    
    document.getElementById('rowsPerPage').addEventListener('change', function() {
        rowsPerPage = parseInt(this.value);
        currentPage = 1; // Reiniciar a la primera página
        cargarTabla();
    });
    
    // Configurar el botón de nuevo registro
    document.getElementById('btnNuevoRegistro').addEventListener('click', function() {
        mostrarModalSeleccionTipoDocumento();
    });
    
    // Función para cargar datos en la tabla
    function cargarTabla() {
        const tableBody = document.getElementById('carteraTableBody');
        tableBody.innerHTML = '';
        
        if (documentosCartera.length === 0) {
            // Si no hay documentos, mostrar mensaje
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="10" style="text-align: center; padding: 20px;">No hay documentos en esta cartera. Haga clic en "Nuevo registro" para agregar documentos.</td>`;
            tableBody.appendChild(row);
            
            // Actualizar la información de paginación
            document.getElementById('paginationInfo').textContent = '0 to 0 of 0';
            return;
        }
        // Calcular los índices de inicio y fin para la paginación
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, documentosCartera.length);
        
        // Actualizar la información de paginación
        const totalItems = documentosCartera.length;
        document.getElementById('paginationInfo').textContent = 
            `${startIndex + 1} to ${endIndex} of ${totalItems}`;
        
        // Cargar los documentos para la página actual
        for (let i = startIndex; i < endIndex; i++) {
            const doc = documentosCartera[i];
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${doc.id}</td>
                <td>
                    <div class="documento-badge">${doc.tipo}</div>
                </td>
                <td>${doc.monto}</td>
                <td>${doc.tasa}</td>
                <td>${doc.tipoTasa}</td>
                <td>${doc.plazoTasa}</td>
                <td>${doc.periodoCap}</td>
                <td>${doc.fechaVencimiento}</td>
                <td>${doc.cliente}</td>
                <td>${doc.moneda}</td>
            `;
            
            tableBody.appendChild(row);
        }
    }
    
    // Función para calcular la TCEA (simplificada para este ejemplo)
    function calcularTCEA(documentos) {
        if (documentos.length === 0) return '0.00';
        
        // Este es solo un cálculo de ejemplo, la TCEA real requeriría una fórmula financiera más compleja
        let sumaTasas = 0;
        documentos.forEach(doc => {
            // Convertir la tasa de string a número
            const tasa = parseFloat(doc.tasa.replace('%', ''));
            sumaTasas += tasa;
        });
        
        // Promedio simple como ejemplo
        const tceaPromedio = (sumaTasas / documentos.length).toFixed(2);
        return tceaPromedio;
    }
    
    // Función para mostrar modal de selección de tipo de documento
    function mostrarModalSeleccionTipoDocumento() {
        // Crear elementos para el modal
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modalContainer.style.display = 'flex';
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.zIndex = '1000';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '10px';
        modalContent.style.maxWidth = '400px';
        modalContent.style.width = '100%';
        modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalHeader.style.marginBottom = '20px';
        modalHeader.style.textAlign = 'center';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Seleccione tipo de documento';
        modalTitle.style.margin = '0';
        
        const closeButton = document.createElement('span');
        closeButton.className = 'close-modal';
        closeButton.textContent = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '20px';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#333';
        
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.style.display = 'flex';
        modalBody.style.flexDirection = 'column';
        modalBody.style.gap = '10px';
        
        const btnFactura = document.createElement('button');
        btnFactura.textContent = 'Factura';
        btnFactura.className = 'btn-tipo-documento';
        btnFactura.style.padding = '10px';
        btnFactura.style.backgroundColor = '#1E223B';
        btnFactura.style.color = 'white';
        btnFactura.style.border = 'none';
        btnFactura.style.borderRadius = '5px';
        btnFactura.style.cursor = 'pointer';
        btnFactura.style.fontSize = '16px';
        
        const btnLetra = document.createElement('button');
        btnLetra.textContent = 'Letra de Cambio';
        btnLetra.className = 'btn-tipo-documento';
        btnLetra.style.padding = '10px';
        btnLetra.style.backgroundColor = '#1E223B';
        btnLetra.style.color = 'white';
        btnLetra.style.border = 'none';
        btnLetra.style.borderRadius = '5px';
        btnLetra.style.cursor = 'pointer';
        btnLetra.style.fontSize = '16px';
        
        // Estructurar el modal
        modalHeader.appendChild(modalTitle);
        modalContent.appendChild(closeButton);
        modalContent.appendChild(modalHeader);
        
        modalBody.appendChild(btnFactura);
        modalBody.appendChild(btnLetra);
        modalContent.appendChild(modalBody);
        
        modalContainer.appendChild(modalContent);
        
        // Añadir el modal al body
        document.body.appendChild(modalContainer);
        
        // Eventos
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modalContainer);
        });
        
        modalContainer.addEventListener('click', function(e) {
            if (e.target === modalContainer) {
                document.body.removeChild(modalContainer);
            }
        });
        
        btnFactura.addEventListener('click', function() {
            document.body.removeChild(modalContainer);
            window.location.href = 'registroFactura.html?carteraId=' + encodeURIComponent(carteraId);
        });
        
        btnLetra.addEventListener('click', function() {
            document.body.removeChild(modalContainer);
            window.location.href = 'registroLetra.html?carteraId=' + encodeURIComponent(carteraId);
        });
    }
    
    // Función para cargar los documentos asociados a esta cartera desde localStorage
    function cargarDocumentosDesdeStorage() {
        // 1. Obtener todas las facturas
        const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
        
        // 2. Obtener todas las letras
        const letras = JSON.parse(localStorage.getItem('letras') || '[]');
        
        // 3. Obtener la información de la cartera
        const carteras = JSON.parse(localStorage.getItem('carteras') || '[]');
        const carteraActual = carteras.find(c => c.id === carteraId);

        if (!carteraActual) {
            // Si no se encuentra la cartera, mostrar tabla vacía
            documentosCartera = [];
            cargarTabla();
            document.getElementById('tceaDisplay').textContent = `TCEA: 0.00%`;
            return;
        }
        
        // 4. Obtener los IDs de documentos asociados a esta cartera
        let documentosIds = [];
        
        if (carteraActual.datos && carteraActual.datos.documentos) {
            documentosIds = carteraActual.datos.documentos.split(',').filter(id => id.trim() !== '');
        }
        
        // 5. Filtrar las facturas y letras que pertenecen a esta cartera
        documentosCartera = [];
        
        facturas.forEach(factura => {
            if (documentosIds.includes(factura.id)) {
                documentosCartera.push({
                    id: factura.id,
                    tipo: "Factura",
                    monto: `$${parseFloat(factura.monto).toFixed(2)}`,
                    tasa: carteraActual.datos.tasa ? `${carteraActual.datos.tasa}%` : "0.00%", // Usar la tasa de la cartera
                    tipoTasa: carteraActual.datos.tipoTasa || "Nominal",
                    plazoTasa: carteraActual.datos.plazoTasa || "360",
                    periodoCap: carteraActual.datos.capitalizacion || "-",
                    fechaVencimiento: window.formatearFecha(factura.fechaPago),
                    cliente: factura.cliente,
                    moneda: factura.moneda
                });
            }
        });
        
        letras.forEach(letra => {
            if (documentosIds.includes(letra.id)) {
                documentosCartera.push({
                    id: letra.id,
                    tipo: "Bill of Exchange",
                    monto: `$${parseFloat(letra.valorNominal).toFixed(2)}`,
                    tasa: carteraActual.datos.tasa ? `${carteraActual.datos.tasa}%` : "0.00%", // Usar la tasa de la cartera
                    tipoTasa: carteraActual.datos.tipoTasa || "Nominal",
                    plazoTasa: carteraActual.datos.plazoTasa || "360",
                    periodoCap: carteraActual.datos.capitalizacion || "-",
                    fechaVencimiento: window.formatearFecha(letra.fechaVencimiento),
                    cliente: letra.beneficiario,
                    moneda: letra.moneda
                });
            }
        });
        
        // 6. Calcular la TCEA y actualizar el elemento en el DOM
        const tcea = calcularTCEA(documentosCartera);
        document.getElementById('tceaDisplay').textContent = `TCEA: ${tcea}%`;
        
        // 7. Cargar la tabla con los documentos de la cartera
        cargarTabla();
    }
});