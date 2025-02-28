// Funciones y utilidades comunes para toda la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Funciones de utilidad compartidas
    
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
    
    // Inicialización de datos de ejemplo si no existen
    function inicializarDatosEjemplo() {
        inicializarCarterasEjemplo();
        inicializarFacturasEjemplo();
        inicializarLetrasEjemplo();
    }
    
    // Llamar a la inicialización de datos
    inicializarDatosEjemplo();
    
    // Exportar funciones para que estén disponibles globalmente
    window.formatearFecha = formatearFecha;
    window.agregarDocumentoACartera = agregarDocumentoACartera;
});

// Inicializar carteras ejemplo
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

// Inicializar facturas ejemplo
function inicializarFacturasEjemplo() {
    const facturasExistentes = JSON.parse(localStorage.getItem('facturas') || '[]');
    
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

// Inicializar letras ejemplo
function inicializarLetrasEjemplo() {
    const letrasExistentes = JSON.parse(localStorage.getItem('letras') || '[]');
    
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