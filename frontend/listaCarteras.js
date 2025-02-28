document.addEventListener('DOMContentLoaded', function() {
    // Código específico para la página de lista de carteras
    
    // Manejo de botones en la lista de carteras
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
    
    // Función para añadir una nueva cartera a la lista
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
    
    // Cargar carteras existentes en la lista
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
    
    // Llamar a la función para cargar carteras al iniciar
    cargarCarteras();
});