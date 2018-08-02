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
                    .then(newSerial);
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
                        $("#Resultado").append(resultadoImagen);
                        $("#Resultado").append(newDiv);


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
    window.location.href = "./";
});