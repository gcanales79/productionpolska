$("#buscarRegistros").on("click", function (event) {
    event.preventDefault();
    var numeroDeregistros = $("#cantidadAbuscar").val().trim()
    url = "/tabla/" + numeroDeregistros;
    console.log("El url es " + url);
    window.location.href = url;
   


});

$("#tablaConsulta").DataTable();

