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

            if (data.length>1) {
                console.log(data);
                var newDiv = $("<div>")
                var resultadoImagen = $("<img>")
                resultadoImagen.attr("src", "./images/wrong.png");
                resultadoImagen.attr("class", "resultadoImagen");
                newDiv.text("The label is duplicated please change the label");
                newDiv.attr("class", "comentario");
                var newButton = $("<button>");
                newButton.attr("class", "btn btn-primary");
                newButton.attr("type", "submit");
                newButton.attr("id", "cambioDeetiqueta");
                newButton.text("Check Another Part");
                $("#Resultado").append(resultadoImagen);
                $("#Resultado").append(newDiv);
                $("#Resultado").append(newButton);
                $("#submit").prop("disabled", true);

                
               /* $.post("/message", newSerial)
                    .then(newSerial);*/
                return;
            }

            if(data.length===1){
                var newDiv = $("<div>")
                        var resultadoImagen = $("<img>")
                        resultadoImagen.attr("src", "./images/good.png");
                        resultadoImagen.attr("class", "resultadoImagen");
                        newDiv.text("Good Label. The part is OK to ship");
                        newDiv.attr("class", "comentariobueno");
                        $("#Resultado").append(resultadoImagen);
                        $("#Resultado").append(newDiv);
            }

            if(data.length===0){
                var newDiv = $("<div>")
                        var resultadoImagen = $("<img>")
                        resultadoImagen.attr("src", "./images/wrong.png");
                        resultadoImagen.attr("class", "resultadoImagen");
                        newDiv.text("The label is not on the database. Please change label");
                        newDiv.attr("class", "comentario");
                        $("#Resultado").append(resultadoImagen);
                        $("#Resultado").append(newDiv);
            }
      

        });


    }
    else {
        var newDiv = $("<div>")
        var resultadoImagen = $("<img>")
        resultadoImagen.attr("src", "./images/wrong.png");
        resultadoImagen.attr("class", "resultadoImagen");
        newDiv.text("The label needs to have 22 digits. ");
        newDiv.attr("class", "comentario");
        $("#Resultado").append(resultadoImagen);
        $("#Resultado").append(newDiv);

    }
})

$(document).on("click", "#cambioDeetiqueta", function (event) {
    event.preventDefault();
    window.location.href = "./polska.html";
});