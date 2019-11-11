$("#buscarRegistros").on("click", function (event) {
    event.preventDefault();
    var numeroDeregistros = $("#cantidadAbuscar").val().trim()
    url = "/tabla/" + numeroDeregistros;
    console.log("El url es " + url);
    window.location.href = url;



});

$("#tablaConsulta").DataTable({
    "language": {
        "lengthMenu": "Mostrar _MENU_ registros por pagina",
        "zeroRecords": "No hay datos que mostrar",
        "info": "Mostrando del _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "Mostrando 0 a 0 de 0 registros",
        "paginate": {
            "first": "Primero",
            "last": "Ultimo",
            "next": "Siguiente",
            "previous": "Previo"
        },
        "search": "Buscar:",
    }
});

