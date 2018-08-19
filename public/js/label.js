getLast6();

$("#submit").on("click", function (event) {
    event.preventDefault();
    //console.log("Submitt button");
    $("#Resultado").empty();
    var nuevoSerial = $("#serialEtiqueta").val().trim();
    var newSerial = {
        serial: nuevoSerial,
    }
    if (nuevoSerial.length === 22) {
        $.get("/api/" + nuevoSerial, function (data) {

            if (data) {
                console.log(data);
                var newDiv = $("<div>")
                var resultadoImagen = $("<img>")
                resultadoImagen.attr("src", "./images/wrong.png");
                resultadoImagen.attr("class", "resultadoImagen");
                newDiv.text("La etiqueta ya existe, por favor segregar la pieza para inspección de calidad");
                newDiv.attr("class", "comentario");
                var newButton = $("<button>");
                newButton.attr("class", "btn btn-primary");
                newButton.attr("type", "submit");
                newButton.attr("id", "cambioDeetiqueta");
                newButton.text("Pieza Segregada");
                $("#Resultado").append(resultadoImagen);
                $("#Resultado").append(newDiv);
                $("#Resultado").append(newButton);
                $("#submit").prop("disabled", true);

                $.post("/api/repetido", newSerial)
                    .then(newSerial);
                $.post("/message", newSerial)
                    .then(newSerial)
                $.post("/api/crearregistro/repetido", newSerial)
                    .then(newSerial)

                return;
            }
            else {

                $.post("/api/serial", newSerial)
                    .then(function () {
                        console.log("El newSerial es: " + JSON.stringify(newSerial));
                        var newDiv = $("<div>")
                        var resultadoImagen = $("<img>")
                        resultadoImagen.attr("src", "./images/good.png");
                        resultadoImagen.attr("class", "resultadoImagen");
                        newDiv.text("Etiqueta Correcta");
                        newDiv.attr("class", "comentariobueno");
                        //Borra el dato de la etiqueta despues de 3 segundos
                        setTimeout(function () {
                            $("#serialEtiqueta").val("");
                        }, 3000);
                        $("#Resultado").append(resultadoImagen);
                        $("#Resultado").append(newDiv);
                        getLast6();
                        //Esta funcion permite recargar la pagina para que saliera la tabla    
                        /*
                        setTimeout(function () {
                            window.location.href = "./";
                        }, 5000);*/


                    });
            }

        });


    }
    else {
        var newDiv = $("<div>")
        var resultadoImagen = $("<img>")
        resultadoImagen.attr("src", "./images/wrong.png");
        resultadoImagen.attr("class", "resultadoImagen");
        newDiv.text("La etiqueta debe ser de 22 digitos");
        newDiv.attr("class", "comentario");
        $("#Resultado").append(resultadoImagen);
        $("#Resultado").append(newDiv);

    }




})

$(document).on("click", "#cambioDeetiqueta", function (event) {
    event.preventDefault();
    $("#serialEtiqueta").val("");
    window.location.href = "./";
    getLast6();
});

// Function to make the table with the 6 last results
function getLast6(lugar) {
    $("#tablaDe6").empty();
    // Grab the last 6 scan labels
    $.getJSON("/api/all/tabla/seisetiquetas", function (data) {
        //console.log(data);
        // For each registry...
        for (var i = 0; i < data.length; i++) {
            // ...populate the results
            if (data[i].repetida) {
                //var resultado = "Si"
                var resultadoIcono = "'fa fa-ban ban'"
            }
            else {
                //var resultado = "No";
                var resultadoIcono = "'fa fa-check-circle check'";

            };
            moment.tz.add("America/Monterrey|LMT CST CDT|6F.g 60 50|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1UQG0 2FjC0 1nX0 i6p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|41e5")
            var fechaCreacion = moment(data[i].createdAt).tz("America/Monterrey").format("DD/MM/YYYY hh:mm:ss a");
            $("#tablaDe6").prepend("<tr><th scope='row'>" + data[i].serial + "</th> <td> <span class= "
                + resultadoIcono + "></span> </td> <td>" + fechaCreacion + "</td> </tr>");
        }
    });
}

