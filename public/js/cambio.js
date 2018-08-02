$("#cambiar").on("click", function (event) {
    event.preventDefault();
    //console.log("Submitt button");
    var serialRepetido = $("#serialEtiquetarepetida").val().trim();
    var nuevoSerial = $("#serialEtiquetanueva").val().trim();
    var newSerial = {
        serial: nuevoSerial,
        etiqueta_remplazada: serialRepetido
    }
    console.log("El dato nuevo es " + newSerial)
    console.log("Serial Repetido Length " + serialRepetido.length);
    console.log("Nuevo Serial length " + nuevoSerial.length);

    if (serialRepetido.length === 22 && nuevoSerial.length === 22) {
        $.get("/api/" + nuevoSerial, function (data) {

            if (data) {
                console.log(data);
                $("#Respuesta").empty();
                $("#Respuesta").text("La etiqueta nueva esta repetida por favor revisar");
            }
            else{
                $.post("/api/cambioetiqueta",newSerial)
                .then(function(){
                    $("#Respuesta").empty();
                    $("#Respuesta").text("La etiqueta fue cambiada exitosamente");
                });

                
            }
        });

    }
    else {
        $("#Respuesta").text("Alguno de los seriales no es de 22 digitos. Por favor corregir.")
    }

});