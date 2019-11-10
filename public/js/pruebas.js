$(document).ready(function () {

    $("#submit").on("click", function (event) {
        event.preventDefault();
        //console.log("Submitt button");
        $("#Resultado").empty();
        var nuevoSerial = $("#serialEtiqueta").val().trim();
        var UsoEtiqueta = $("#inputUso").val();
        var primNumeros = nuevoSerial.substring(0, 6);
        var numCaso = 0;
        console.log(primNumeros)
        //console.log(UsoEtiqueta);
        var usuario = document.cookie.replace(/(?:(?:^|.*;\s*)usuario\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        localStorage.setItem("usuario", usuario)

        var newSerial = {
            serial: nuevoSerial,
            uso: UsoEtiqueta,
        }

        if (UsoEtiqueta !== "Seleccionar una...") {
            if (nuevoSerial.length !== 22) {
                numCaso = 1;
                //console.log("Numero de Caso " + numCaso);
            }
            if (primNumeros !== "247490") {
                numCaso = 2
            }
            if (nuevoSerial.length === 22 && primNumeros === "247490") {
                numCaso = 3
            }


            switch (numCaso) {
                case 1:
                    var newDiv = $("<div>")
                    newDiv.text("La etiqueta debe ser de 22 digitos");
                    newDiv.attr("class", "alert alert-danger");
                    $("#Resultado").append(newDiv);
                    break;
                case 2:
                    var newDiv = $("<div>")
                    newDiv.text("La etiqueta no tiene el formato inical adecuado");
                    newDiv.attr("class", "alert alert-danger");
                    $("#Resultado").append(newDiv);
                    break;
                case 3:
                    $.get("/api/" + nuevoSerial, function (data) {
                        registrarEtiqueta(nuevoSerial, newSerial, data)
                    });



            }




            /*
            if (nuevoSerial.length === 22 && primNumeros === "247490") {
                $.get("/api/" + nuevoSerial, function (data) {
                    registrarEtiqueta(nuevoSerial, newSerial, data)


                });


            }
            else {

                var newDiv = $("<div>")
                newDiv.text("La etiqueta debe ser de 22 digitos");
                newDiv.attr("class", "alert alert-danger");
                $("#Resultado").append(newDiv);

            }*/


        }
        else {
            var newDiv = $("<div>")
            newDiv.text("Por favor selecciona un uso de la etiqueta");
            newDiv.attr("class", "alert alert-danger");
            $("#Resultado").append(newDiv);
        }

    })


    function registrarEtiqueta(nuevoSerial, newSerial, data) {
        if (data) {
            //console.log(data);
            var newDiv = $("<div>")
            newDiv.text("La etiqueta ya existe, no fue posible registrar esta etiqueta");
            newDiv.attr("class", "alert alert-danger");
            $("#Resultado").append(newDiv);

            return;
        }

        else {

            $.post("/api/serialmanual", newSerial)
                .then(function () {
                    //console.log("El newSerial es: " + JSON.stringify(newSerial));
                    var newDiv = $("<div>")
                    newDiv.text("Etiqueta agregada correctamente");
                    newDiv.attr("class", "calert alert-success");
                    //Borra el dato de la etiqueta despues de 3 segundos
                    setTimeout(function () {
                        $("#serialEtiqueta").val("");
                    }, 2000);
                    $("#Resultado").append(newDiv);
                    //Borrar el resultado despues de unos segundos
                    setTimeout(function () {
                        $("#Resultado").empty();
                    }, 3000);


                });
            return;
        }

    }


})

