$("#submit").on("click", function (event) {
    event.preventDefault();
    //console.log("Submitt button");
    $("#Resultado").empty();
    var nuevoSerial = $("#serialEtiqueta").val().trim();
    var newSerial = {
        serial: nuevoSerial,
    }
    if (nuevoSerial.length === 22) {
        $.get("/api/all/" + nuevoSerial, function (data) {
            console.log(data);

            if (data.length > 1) {
                duplicatedLabel();


                return;
            }

            if (data.length === 1) {
                //console.log("Status de repetida " + data[0].repetida)
                for (var i = 0; i < data.length; i++) {
                    if (data[i].repetida && (data[i].etiqueta_remplazada == null || data[i].etiqueta_remplazada =="")) {
                        duplicatedLabel();
                    }


                    else {
                        etiquetaCorrecta();
                    }
                }
            }

            if (data.length === 0) {
                etiquetaFaltante();
            }


        });


    }
    else {
        serialIncorrecto();

    }
})

$(document).on("click", "#cambioDeetiqueta", function (event) {
    event.preventDefault();
    window.location.href = "./cambiar.html";
});

function serialIncorrecto() {
    var newDiv = $("<div>")
    var resultadoImagen = $("<img>")
    resultadoImagen.attr("src", "./images/wrong.png");
    resultadoImagen.attr("class", "resultadoImagen");
    newDiv.text("The label needs to have 22 digits. ");
    newDiv.attr("class", "comentario");
    $("#serialEtiqueta").val("");
    $("#Resultado").append(resultadoImagen);
    $("#Resultado").append(newDiv);
}

function duplicatedLabel() {
    var newDiv = $("<div>")
    var resultadoImagen = $("<img>")
    resultadoImagen.attr("src", "./images/wrong.png");
    resultadoImagen.attr("class", "resultadoImagen");
    newDiv.text("The label is duplicated please change the label");
    newDiv.attr("class", "comentario");
    $("#serialEtiqueta").val("");
    var newButton = $("<button>");
    newButton.attr("class", "btn btn-primary");
    newButton.attr("type", "submit");
    newButton.attr("id", "cambioDeetiqueta");
    newButton.text("Change Label");
    $("#Resultado").append(resultadoImagen);
    $("#Resultado").append(newDiv);
    $("#Resultado").append(newButton);
    $("#submit").prop("disabled", true);
}

function etiquetaFaltante() {
    var newDiv = $("<div>")
    var resultadoImagen = $("<img>")
    resultadoImagen.attr("src", "./images/wrong.png");
    resultadoImagen.attr("class", "resultadoImagen");
    newDiv.text("The label is not on the database. Please change label");
    newDiv.attr("class", "comentario");
    $("#serialEtiqueta").val("");
    var newButton = $("<button>");
    newButton.attr("class", "btn btn-primary");
    newButton.attr("type", "submit");
    newButton.attr("id", "cambioDeetiqueta");
    newButton.text("Change Label");
    $("#Resultado").append(resultadoImagen);
    $("#Resultado").append(newDiv);
    $("#Resultado").append(newButton);
    $("#submit").prop("disabled", true);
}

function etiquetaCorrecta() {
    var newDiv = $("<div>")
    var resultadoImagen = $("<img>")
    resultadoImagen.attr("src", "./images/good.png");
    resultadoImagen.attr("class", "resultadoImagen");
    newDiv.text("Good Label. The part is OK to ship");
    newDiv.attr("class", "comentariobueno");
    $("#serialEtiqueta").val("");
    $("#Resultado").append(resultadoImagen);
    $("#Resultado").append(newDiv);
}

