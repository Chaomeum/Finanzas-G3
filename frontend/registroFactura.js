document.addEventListener('DOMContentLoaded', function() {
    // Script específico para la página de registro de factura
    
    // Obtener el ID de la cartera de la URL (si existe)
    const urlParams = new URLSearchParams(window.location.search);
    const carteraId = urlParams.get('carteraId');
    
    // Si hay una cartera ID, mostrar el nombre de la cartera
    if (carteraId) {
        // Podríamos añadir un elemento en el HTML para mostrar a qué cartera se agregará
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = `Agregar Factura a ${carteraId}`;
        }
    }
    
    // Obtener el formulario de factura
    const facturaForm = document.getElementById('facturaForm');
    
    // Agregar evento al enviar el formulario
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
            let facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
            
            // Generar ID para la factura
            const id = 'F' + (facturas.length + 1).toString().padStart(3, '0') + '-' + 
                      Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            
            nuevaFactura.id = id;
            
            // Guardar la factura
            guardarNuevaFactura(nuevaFactura);
            
            // Si hay una cartera ID, agregar esta factura a la cartera
            if (carteraId) {
                window.agregarDocumentoACartera(carteraId, id);
                
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
                establecerFechasPredeterminadas();
            }
        });
        
        // Establecer fechas predeterminadas al cargar la página
        establecerFechasPredeterminadas();
    }
    
    // Función para establecer fechas predeterminadas
    function establecerFechasPredeterminadas() {
        const fechaEmisionInput = document.getElementById('fechaEmision');
        if (fechaEmisionInput) {
            const hoy = new Date().toISOString().split('T')[0];
            fechaEmisionInput.value = hoy;
        }
        
        const fechaPagoInput = document.getElementById('fechaPago');
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
    
    function guardarNuevaFactura(factura) {
        // Obtener facturas existentes
        let facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
        
        // Añadir la nueva factura
        facturas.push(factura);
        
        // Guardar en localStorage
        localStorage.setItem('facturas', JSON.stringify(facturas));
        
        return factura;
    }
});