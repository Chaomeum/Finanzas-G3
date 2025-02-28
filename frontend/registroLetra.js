document.addEventListener('DOMContentLoaded', function() {
    // Script específico para la página de registro de letra de cambio
    
    // Obtener el ID de la cartera de la URL (si existe)
    const urlParams = new URLSearchParams(window.location.search);
    const carteraId = urlParams.get('carteraId');
    
    // Si hay una cartera ID, mostrar el nombre de la cartera
    if (carteraId) {
        // Podríamos añadir un elemento en el HTML para mostrar a qué cartera se agregará
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = `Agregar Letra de Cambio a ${carteraId}`;
        }
    }
    
    // Obtener el formulario de letra
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
            let letras = JSON.parse(localStorage.getItem('letras') || '[]');
            
            // Generar ID para la letra
            const id = 'L' + (letras.length + 1).toString().padStart(3, '0') + '-' + 
                      Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            
            nuevaLetra.id = id;
            
            // Guardar la letra
            guardarNuevaLetra(nuevaLetra);
            
            // Si hay una cartera ID, agregar esta letra a la cartera
            if (carteraId) {
                window.agregarDocumentoACartera(carteraId, id);
                
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
                establecerFechasPredeterminadas();
            }
        });
        
        // Establecer fechas predeterminadas al cargar la página
        establecerFechasPredeterminadas();
    }
    
    // Función para establecer fechas predeterminadas
    function establecerFechasPredeterminadas() {
        const fechaPagoInput = document.getElementById('fechaPago');
        if (fechaPagoInput) {
            const hoy = new Date().toISOString().split('T')[0];
            fechaPagoInput.value = hoy;
        }
        
        const fechaVencimientoInput = document.getElementById('fechaVencimiento');
        if (fechaVencimientoInput) {
            const treintaDiasDespues = new Date();
            treintaDiasDespues.setDate(treintaDiasDespues.getDate() + 30);
            fechaVencimientoInput.value = treintaDiasDespues.toISOString().split('T')[0];
        }
        
        // Actualizar fecha de vencimiento cuando cambie la fecha de pago
        if (fechaPagoInput && fechaVencimientoInput) {
            fechaPagoInput.addEventListener('change', function() {
                const fechaPago = new Date(this.value);
                const nuevaFechaVencimiento = new Date(fechaPago);
                nuevaFechaVencimiento.setDate(fechaPago.getDate() + 30);
                fechaVencimientoInput.value = nuevaFechaVencimiento.toISOString().split('T')[0];
            });
        }
    }
    
    function guardarNuevaLetra(letra) {
        // Obtener letras existentes
        let letras = JSON.parse(localStorage.getItem('letras') || '[]');
        
        // Añadir la nueva letra
        letras.push(letra);
        
        // Guardar en localStorage
        localStorage.setItem('letras', JSON.stringify(letras));
        
        return letra;
    }
});