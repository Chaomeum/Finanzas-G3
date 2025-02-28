document.addEventListener('DOMContentLoaded', function() {
    // Código existente para documentos
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

    // ====== CÓDIGO PARA MANEJAR CARTERAS ======

    // 1. Manejo de botones en la lista de carteras
    const btnAbrir = document.querySelectorAll('.btn-abrir');
    const btnEliminar = document.querySelectorAll('.btn-eliminar');
    
    // Agregar evento para abrir cartera
    btnAbrir.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.cells[0].textContent;
            // Redireccionar a la página de ver cartera
            window.location.href = 'verCartera.html?id=' + id;
        });
    });
    
    // Agregar evento para eliminar cartera
    btnEliminar.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.cells[0].textContent;
            const nombre = row.cells[1].textContent;
            
            const confirmar = confirm(`¿Estás seguro de que deseas eliminar la cartera ${nombre}?`);
            
            if (confirmar) {
                row.remove();
                alert('Cartera ' + id + ' eliminada.');
                
                // Actualizar carteras en localStorage
                actualizarCarterasEnStorage();
            }
        });
    });

    // 2. Función para añadir una nueva cartera a la lista
    function agregarNuevaCartera(id, nombre) {
        // Solo ejecutar si estamos en la página de lista de carteras
        const listaCarterasTable = document.querySelector('.lista-carteras-table tbody');
        if (!listaCarterasTable) return;
        
        // Crear nueva fila
        const newRow = document.createElement('tr');
        
        // Crear las celdas con los datos de la cartera
        newRow.innerHTML = `
            <td>${id}</td>
            <td>${nombre}</td>
            <td class="opciones-buttons">
                <button class="btn-abrir">Abrir</button>
                <button class="btn-eliminar">Eliminar</button>
            </td>
        `;
        
        // Añadir la nueva fila a la tabla
        listaCarterasTable.appendChild(newRow);
        
        // Añadir eventos a los nuevos botones
        const btnAbrir = newRow.querySelector('.btn-abrir');
        const btnEliminar = newRow.querySelector('.btn-eliminar');
        
        btnAbrir.addEventListener('click', function() {
            const row = this.closest('tr');
            const cartId = row.cells[0].textContent;
            // Redireccionar a la página de ver cartera
            window.location.href = 'verCartera.html?id=' + cartId;
        });
        
        btnEliminar.addEventListener('click', function() {
            const row = this.closest('tr');
            const cartId = row.cells[0].textContent;
            const cartNombre = row.cells[1].textContent;
            
            const confirmar = confirm(`¿Estás seguro de que deseas eliminar la cartera ${cartNombre}?`);
            
            if (confirmar) {
                row.remove();
                alert('Cartera ' + cartId + ' eliminada.');
                
                // Actualizar carteras en localStorage
                actualizarCarterasEnStorage();
            }
        });
    }

    // 3. Manejo del formulario de creación de cartera
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

    // 4. Funciones para manejar carteras en localStorage
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
    
    function actualizarCarterasEnStorage() {
        // Solo si estamos en la página de lista de carteras
        const tabla = document.querySelector('.lista-carteras-table tbody');
        if (!tabla) return;
        
        // Obtener todas las filas
        const filas = tabla.querySelectorAll('tr');
        
        // Crear array de carteras
        let carteras = [];
        
        filas.forEach(fila => {
            const id = fila.cells[0].textContent;
            const nombre = fila.cells[1].textContent;
            
            carteras.push({
                id: id,
                nombre: nombre
                // Los datos detallados no los tenemos aquí
            });
        });
        
        // Guardar en localStorage
        localStorage.setItem('carteras', JSON.stringify(carteras));
    }
    
    // 5. Cargar carteras existentes en la lista
    function cargarCarteras() {
        // Solo si estamos en la página de lista de carteras
        const tabla = document.querySelector('.lista-carteras-table tbody');
        if (!tabla) return;
        
        // Obtener carteras guardadas
        const carteras = JSON.parse(localStorage.getItem('carteras') || '[]');
        
        // Si no hay elementos en la tabla, cargar desde localStorage
        if (tabla.querySelectorAll('tr').length === 0) {
            // Limpiar la tabla
            tabla.innerHTML = '';
            
            // Añadir cada cartera
            carteras.forEach(cartera => {
                agregarNuevaCartera(cartera.id, cartera.nombre);
            });
        } else {
            // Si hay elementos en la tabla, actualizar el localStorage
            actualizarCarterasEnStorage();
        }
    }
    
    // Añadir esta función en script.js
    function inicializarCarterasEjemplo() {
        // Verificar si ya hay carteras en localStorage
        const carterasExistentes = JSON.parse(localStorage.getItem('carteras') || '[]');

        // Si no hay carteras, añadir ejemplos
        if (carterasExistentes.length === 0) {
            const carterasEjemplo = [
                { id: '#1', nombre: 'Cartera #1' },
                { id: '#2', nombre: 'Cartera #2' },
                { id: '#3', nombre: 'Cartera #3' },
                { id: '#4', nombre: 'Cartera #4' },
                { id: '#5', nombre: 'Cartera #5' }
            ];

            localStorage.setItem('carteras', JSON.stringify(carterasEjemplo));
        }
    }

    // Llamar a esta función al inicio (antes de cargarCarteras())
    inicializarCarterasEjemplo();
    
    // Llamar a la función para cargar carteras al iniciar
    cargarCarteras();
    
    // ====== CÓDIGO PARA MANEJAR FACTURAS ======
    
    // 1. Funciones para gestionar facturas en localStorage
    function guardarNuevaFactura(factura) {
        // Obtener facturas existentes
        let facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
        
        // Añadir la nueva factura
        facturas.push(factura);
        
        // Guardar en localStorage
        localStorage.setItem('facturas', JSON.stringify(facturas));
        
        return factura;
    }
    
    function obtenerFacturas() {
        return JSON.parse(localStorage.getItem('facturas') || '[]');
    }
    
    function eliminarFactura(id) {
        let facturas = obtenerFacturas();
        facturas = facturas.filter(factura => factura.id !== id);
        localStorage.setItem('facturas', JSON.stringify(facturas));
    }
    
    // 2. Inicializar facturas de ejemplo si no existen
    function inicializarFacturasEjemplo() {
        const facturasExistentes = obtenerFacturas();
        
        // Si no hay facturas, añadir ejemplos
        if (facturasExistentes.length === 0) {
            const hoy = new Date();
            const fechaVencimiento = new Date();
            fechaVencimiento.setDate(hoy.getDate() + 30);
            
            const facturasEjemplo = [
                {
                    id: 'F001-123',
                    monto: 1500.00,
                    fechaEmision: hoy.toISOString().split('T')[0],
                    fechaPago: fechaVencimiento.toISOString().split('T')[0],
                    cliente: 'Empresa ABC S.A.C.',
                    moneda: 'PEN',
                    tipo: 'Factura',
                    fechaRegistro: hoy.toISOString()
                },
                {
                    id: 'F001-124',
                    monto: 2300.00,
                    fechaEmision: hoy.toISOString().split('T')[0],
                    fechaPago: fechaVencimiento.toISOString().split('T')[0],
                    cliente: 'Comercial XYZ E.I.R.L.',
                    moneda: 'PEN',
                    tipo: 'Factura',
                    fechaRegistro: hoy.toISOString()
                }
            ];
            
            localStorage.setItem('facturas', JSON.stringify(facturasEjemplo));
        }
    }
    
    // 3. Manejar el formulario de registro de factura
    const facturaForm = document.getElementById('facturaForm');
    
    if (facturaForm) {
        facturaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const montoFactura = document.getElementById('montoFactura').value;
            const fechaEmision = document.getElementById('fechaEmision').value;
            const fechaPago = document.getElementById('fechaPago').value;
            const cliente = document.getElementById('cliente').value;
            const moneda = document.getElementById('moneda').value;
            
            // Crear objeto de factura
            const nuevaFactura = {
                monto: montoFactura,
                fechaEmision: fechaEmision,
                fechaPago: fechaPago,
                cliente: cliente,
                moneda: moneda,
                tipo: 'Factura',
                fechaRegistro: new Date().toISOString()
            };
            
            // Obtener facturas existentes
            let facturas = obtenerFacturas();
            
            // Generar ID para la factura
            const id = 'F' + (facturas.length + 1).toString().padStart(3, '0') + '-' + 
                      Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            
            nuevaFactura.id = id;
            
            // Guardar la factura
            guardarNuevaFactura(nuevaFactura);
            
            // Obtener el ID de la cartera si existe
            const urlParams = new URLSearchParams(window.location.search);
            const carteraId = urlParams.get('carteraId');
            
            // Si hay una cartera ID, agregar esta factura a la cartera
            if (carteraId) {
                agregarDocumentoACartera(carteraId, id);
                
                // Mostrar mensaje de éxito
                alert('Factura registrada con éxito: ' + id);
                
                // Redirigir de vuelta a la cartera
                window.location.href = 'verCartera.html?id=' + carteraId;
            } else {
                // Mostrar mensaje de éxito
                alert('Factura registrada con éxito: ' + id);
                
                // Limpiar formulario
                facturaForm.reset();
                
                // Establecer fechas predeterminadas
                establecerFechasPredeterminadasFactura();
            }
        });
        
        // Establecer fechas predeterminadas al cargar la página
        establecerFechasPredeterminadasFactura();
    }
    
    // Función para establecer fechas predeterminadas en formulario de facturas
    function establecerFechasPredeterminadasFactura() {
        const fechaEmisionInput = document.getElementById('fechaEmision');
        const fechaPagoInput = document.getElementById('fechaPago');
        
        if (fechaEmisionInput) {
            const hoy = new Date().toISOString().split('T')[0];
            fechaEmisionInput.value = hoy;
        }
        
        if (fechaPagoInput && fechaEmisionInput) {
            const treintaDiasDespues = new Date();
            treintaDiasDespues.setDate(treintaDiasDespues.getDate() + 30);
            fechaPagoInput.value = treintaDiasDespues.toISOString().split('T')[0];
            
            // Actualizar fecha de pago cuando cambie la fecha de emisión
            fechaEmisionInput.addEventListener('change', function() {
                const fechaEmision = new Date(this.value);
                const nuevaFechaPago = new Date(fechaEmision);
                nuevaFechaPago.setDate(fechaEmision.getDate() + 30);
                fechaPagoInput.value = nuevaFechaPago.toISOString().split('T')[0];
            });
        }
    }
    
    // 4. Mostrar facturas en una lista (si estamos en la página de lista de facturas)
    function mostrarFacturasEnLista() {
        const listaFacturasContainer = document.getElementById('listaFacturasContainer');
        if (!listaFacturasContainer) return;
        
        const facturas = obtenerFacturas();
        
        // Limpiar el contenedor
        listaFacturasContainer.innerHTML = '';
        
        if (facturas.length === 0) {
            listaFacturasContainer.innerHTML = '<p class="no-records">No hay facturas registradas.</p>';
            return;
        }
        
        // Crear tabla
        const tabla = document.createElement('table');
        tabla.className = 'lista-facturas-table';
        
        // Crear encabezado
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Fecha Emisión</th>
                <th>Fecha Pago</th>
                <th>Opciones</th>
            </tr>
        `;
        tabla.appendChild(thead);
        
        // Crear cuerpo de la tabla
        const tbody = document.createElement('tbody');
        
        facturas.forEach(factura => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${factura.id}</td>
                <td>${factura.cliente}</td>
                <td>${factura.moneda} ${parseFloat(factura.monto).toFixed(2)}</td>
                <td>${formatearFecha(factura.fechaEmision)}</td>
                <td>${formatearFecha(factura.fechaPago)}</td>
                <td class="opciones-buttons">
                    <button class="btn-ver" data-id="${factura.id}">Ver</button>
                    <button class="btn-eliminar" data-id="${factura.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        tabla.appendChild(tbody);
        listaFacturasContainer.appendChild(tabla);
        
        // Agregar eventos a los botones
        document.querySelectorAll('.lista-facturas-table .btn-ver').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                // Redirigir a página de detalle o mostrar modal
                alert('Ver detalles de factura: ' + id);
                // window.location.href = `detalleFactura.html?id=${id}`;
            });
        });
        
        document.querySelectorAll('.lista-facturas-table .btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const confirmar = confirm(`¿Estás seguro de que deseas eliminar la factura ${id}?`);
                
                if (confirmar) {
                    eliminarFactura(id);
                    mostrarFacturasEnLista(); // Actualizar la lista
                    alert('Factura eliminada correctamente');
                }
            });
        });
    }
    
    // ====== CÓDIGO PARA MANEJAR LETRAS DE CAMBIO ======
    
    // 1. Funciones para gestionar letras en localStorage
    function guardarNuevaLetra(letra) {
        // Obtener letras existentes
        let letras = JSON.parse(localStorage.getItem('letras') || '[]');
        
        // Añadir la nueva letra
        letras.push(letra);
        
        // Guardar en localStorage
        localStorage.setItem('letras', JSON.stringify(letras));
        
        return letra;
    }
    
    function obtenerLetras() {
        return JSON.parse(localStorage.getItem('letras') || '[]');
    }
    
    function eliminarLetra(id) {
        let letras = obtenerLetras();
        letras = letras.filter(letra => letra.id !== id);
        localStorage.setItem('letras', JSON.stringify(letras));
    }
    
    // 2. Inicializar letras de ejemplo si no existen
    function inicializarLetrasEjemplo() {
        const letrasExistentes = obtenerLetras();
        
        // Si no hay letras, añadir ejemplos
        if (letrasExistentes.length === 0) {
            const hoy = new Date();
            const fechaVencimiento = new Date();
            fechaVencimiento.setDate(hoy.getDate() + 30);
            
            const letrasEjemplo = [
                {
                    id: 'L001-123',
                    valorNominal: 3500.00,
                    fechaPago: hoy.toISOString().split('T')[0],
                    fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
                    beneficiario: 'Empresa DEF S.A.C.',
                    moneda: 'PEN',
                    tipo: 'Letra',
                    fechaRegistro: hoy.toISOString()
                },
                {
                    id: 'L001-124',
                    valorNominal: 4800.00,
                    fechaPago: hoy.toISOString().split('T')[0],
                    fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
                    beneficiario: 'Importadora GHI E.I.R.L.',
                    moneda: 'USD',
                    tipo: 'Letra',
                    fechaRegistro: hoy.toISOString()
                }
            ];
            
            localStorage.setItem('letras', JSON.stringify(letrasEjemplo));
        }
    }
    
    // 3. Manejar el formulario de registro de letra
    const letraForm = document.getElementById('letraForm');
    
    if (letraForm) {
        letraForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const valorNominal = document.getElementById('valorNominal').value;
            const fechaPago = document.getElementById('fechaPago').value;
            const fechaVencimiento = document.getElementById('fechaVencimiento').value;
            const beneficiario = document.getElementById('beneficiario').value;
            const moneda = document.getElementById('moneda').value;
            
            // Crear objeto de letra
            const nuevaLetra = {
                valorNominal: valorNominal,
                fechaPago: fechaPago,
                fechaVencimiento: fechaVencimiento,
                beneficiario: beneficiario,
                moneda: moneda,
                tipo: 'Letra',
                fechaRegistro: new Date().toISOString()
            };
            
            // Obtener letras existentes
            let letras = obtenerLetras();
            
            // Generar ID para la letra
            const id = 'L' + (letras.length + 1).toString().padStart(3, '0') + '-' + 
                      Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            
            nuevaLetra.id = id;
            
            // Guardar la letra
            guardarNuevaLetra(nuevaLetra);
            
            // Obtener el ID de la cartera si existe
            const urlParams = new URLSearchParams(window.location.search);
            const carteraId = urlParams.get('carteraId');
            
            // Si hay una cartera ID, agregar esta letra a la cartera
            if (carteraId) {
                agregarDocumentoACartera(carteraId, id);
                
                // Mostrar mensaje de éxito
                alert('Letra de cambio registrada con éxito: ' + id);
                
                // Redirigir de vuelta a la cartera
                window.location.href = 'verCartera.html?id=' + carteraId;
            } else {
                // Mostrar mensaje de éxito
                alert('Letra de cambio registrada con éxito: ' + id);
                
                // Limpiar formulario
                letraForm.reset();
                
                // Establecer fechas predeterminadas
                establecerFechasPredeterminadasLetra();
            }
        });
        
        // Establecer fechas predeterminadas al cargar la página
        establecerFechasPredeterminadasLetra();
    }
    
    // Función para establecer fechas predeterminadas en formulario de letras
    function establecerFechasPredeterminadasLetra() {
        const fechaPagoInput = document.getElementById('fechaPago');
        const fechaVencimientoInput = document.getElementById('fechaVencimiento');
        
        if (fechaPagoInput) {
            const hoy = new Date().toISOString().split('T')[0];
            fechaPagoInput.value = hoy;
        }
        
        if (fechaVencimientoInput && fechaPagoInput) {
            const treintaDiasDespues = new Date();
            treintaDiasDespues.setDate(treintaDiasDespues.getDate() + 30);
            fechaVencimientoInput.value = treintaDiasDespues.toISOString().split('T')[0];
            
            // Actualizar fecha de vencimiento cuando cambie la fecha de pago
            fechaPagoInput.addEventListener('change', function() {
                const fechaPago = new Date(this.value);
                const nuevaFechaVencimiento = new Date(fechaPago);
                nuevaFechaVencimiento.setDate(fechaPago.getDate() + 30);
                fechaVencimientoInput.value = nuevaFechaVencimiento.toISOString().split('T')[0];
            });
        }
    }
    
    // 4. Mostrar letras en una lista (si estamos en la página de lista de letras)
    function mostrarLetrasEnLista() {
        const listaLetrasContainer = document.getElementById('listaLetrasContainer');
        if (!listaLetrasContainer) return;
        
        const letras = obtenerLetras();
        
        // Limpiar el contenedor
        listaLetrasContainer.innerHTML = '';
        
        if (letras.length === 0) {
            listaLetrasContainer.innerHTML = '<p class="no-records">No hay letras de cambio registradas.</p>';
            return;
        }
        
        // Crear tabla
        const tabla = document.createElement('table');
        tabla.className = 'lista-letras-table';
        
        // Crear encabezado
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Beneficiario</th>
                <th>Valor Nominal</th>
                <th>Fecha Pago</th>
                <th>Fecha Vencimiento</th>
                <th>Opciones</th>
            </tr>
        `;
        tabla.appendChild(thead);
        
        // Crear cuerpo de la tabla
        const tbody = document.createElement('tbody');
        
        letras.forEach(letra => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${letra.id}</td>
                <td>${letra.beneficiario}</td>
                <td>${letra.moneda} ${parseFloat(letra.valorNominal).toFixed(2)}</td>
                <td>${formatearFecha(letra.fechaPago)}</td>
                <td>${formatearFecha(letra.fechaVencimiento)}</td>
                <td class="opciones-buttons">
                    <button class="btn-ver" data-id="${letra.id}">Ver</button>
                    <button class="btn-eliminar" data-id="${letra.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        tabla.appendChild(tbody);
        listaLetrasContainer.appendChild(tabla);
        
        // Agregar eventos a los botones
        document.querySelectorAll('.lista-letras-table .btn-ver').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                // Redirigir a página de detalle o mostrar modal
                alert('Ver detalles de letra: ' + id);
                // window.location.href = `detalleLetra.html?id=${id}`;
            });
        });
        
        document.querySelectorAll('.lista-letras-table .btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const confirmar = confirm(`¿Estás seguro de que deseas eliminar la letra ${id}?`);
                
                if (confirmar) {
                    eliminarLetra(id);
                    mostrarLetrasEnLista(); // Actualizar la lista
                    alert('Letra eliminada correctamente');
                }
            });
        });
    }
    
    // ====== FUNCIÓN PARA AGREGAR DOCUMENTOS A CARTERAS ======
    
    // Función para agregar un documento a una cartera
    function agregarDocumentoACartera(carteraId, documentoId) {
        // Obtener todas las carteras
        const carteras = JSON.parse(localStorage.getItem('carteras') || '[]');
        
        // Buscar la cartera específica
        const carteraIndex = carteras.findIndex(c => c.id === carteraId);
        
        if (carteraIndex !== -1) {
            // Obtener los documentos actuales
            let documentosActuales = '';
            
            if (carteras[carteraIndex].datos && carteras[carteraIndex].datos.documentos) {
                documentosActuales = carteras[carteraIndex].datos.documentos;
            }
            
            // Agregar el nuevo documento
            if (documentosActuales) {
                documentosActuales += ',' + documentoId;
            } else {
                documentosActuales = documentoId;
            }
            
            // Actualizar la cartera
            if (!carteras[carteraIndex].datos) {
                carteras[carteraIndex].datos = {};
            }
            
            carteras[carteraIndex].datos.documentos = documentosActuales;
            
            // Guardar en localStorage
            localStorage.setItem('carteras', JSON.stringify(carteras));
        }
    }
    
    // Función auxiliar para formatear fechas
    function formatearFecha(fechaStr) {
        if (!fechaStr) return 'N/A';
        
        const fecha = new Date(fechaStr);
        if (isNaN(fecha.getTime())) return fechaStr;
        
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Inicializar ejemplos
    inicializarFacturasEjemplo();
    inicializarLetrasEjemplo();
    
    // Mostrar listados si estamos en las páginas correspondientes
    mostrarFacturasEnLista();
    mostrarLetrasEnLista();
});