getLast6();
produccionPorhora();
produccionTurnos();


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
                        //console.log("El newSerial es: " + JSON.stringify(newSerial));
                        var newDiv = $("<div>")
                        var resultadoImagen = $("<img>")
                        resultadoImagen.attr("src", "./images/good.png");
                        resultadoImagen.attr("class", "resultadoImagen");
                        newDiv.text("Etiqueta Correcta");
                        newDiv.attr("class", "comentariobueno");
                        //Borra el dato de la etiqueta despues de 3 segundos
                        setTimeout(function () {
                            $("#serialEtiqueta").val("");
                        }, 2000);
                        $("#Resultado").append(resultadoImagen);
                        $("#Resultado").append(newDiv);
                        //Borrar el resultado despues de unos segundos
                        setTimeout(function () {
                            $("#Resultado").empty();
                        }, 3000);
                        getLast6();
                        produccionPorhora();
                        //Esta funcion permite recargar la pagina para que saliera la tabla    
                        /*
                        setTimeout(function () {
                            window.location.href = "./";
                        }, 5000);*/


                    });
                return;
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
    window.location.href = "./produccion";
    getLast6();
});


// Function to make the table with the 6 last results
function getLast6() {
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
    })

}

function produccionPorhora() {

    let produccion = [];
    for (let i = 0; i < 8; i++) {
        //calcula la hora actual y resta 8 horas atras
        let hora = moment().startOf("hour").subtract(i, "hour").format("h:mm a")
        //let horafinal=moment().startOf("hour").subtract(i-1,"hour").format("h:mm a")
        let fechainicial = moment().startOf("hour").subtract(i, "hour").format("X")
        let fechafinal = moment().startOf("hour").subtract(i - 1, "hour").format("X")
        //console.log(hora)
        //console.log("La fecha inicial es: " + fechaincial + " o " + hora)
        //console.log("La fecha final es: " + fechafinal + " o " + horafinal)
        $.getJSON("/produccionhora/" + fechainicial + "/" + fechafinal, function (data) {
            //console.log(data.count)
            //console.log(hora)

            produccion.push({
                fecha: fechainicial,
                producidas: data.count
            })
            tablaProduccion(produccion)
            
        })

    }

}

//Funcion para que siempre la horas salgan ordenadas
function tablaProduccion(produccion) {
    produccion.sort(function (a, b) {
        if (a.fecha > b.fecha) {
            return -1;
        }
        if (b.fecha > a.fecha) {
            return 1;
        }
        return 0;
    })
    //console.log(produccion)
    $("#tablaHora").empty();
    for (let i = 0; i < produccion.length; i++) {
        let hora = moment.unix(produccion[i].fecha).format("h:mm a")
        let horafinal = moment.unix(produccion[i].fecha).add(1, "hour").format("h:mm a")
        $("#tablaHora").prepend("<tr><th scope='row'>" + hora + " a " + horafinal + "</th> <td> " + produccion[i].producidas + "</td>")

    }

}

// Grafica por turno 7 dias

function graficaProduccion(datosTurno1, datosTurno2, datosTurno3) {


    var ctx = $("#myChart");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
            datasets: [{
                label: "Turno 1",
                data: datosTurno1,
                backgroundColor: [
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                ],
                borderColor: [
                    'rgba(75,192,192,1)',
                    'rgba(75,192,192,1)',
                    'rgba(75,192,192,1)',
                    'rgba(75,192,192,1)',
                    'rgba(75,192,192,1)',
                    'rgba(75,192,192,1)',
                    'rgba(75,192,192,1)',
                ],
                borderWidth: 1
            }, {
                label: "Turno 2",
                data: datosTurno2,
                backgroundColor: [
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(54, 162, 235, 0.2)"
                ],
                borderColor: [
                    "rgba(54,162,235,1)",
                    "rgba(54,162,235,1)",
                    "rgba(54,162,235,1)",
                    "rgba(54,162,235,1)",
                    "rgba(54,162,235,1)",
                    "rgba(54,162,235,1)",
                    "rgba(54,162,235,1)"
                ],
                borderWidth: 1
            }, {
                label: "Turno 3",
                data: datosTurno3,
                backgroundColor: [
                    "rgba(255,206,86,0.2)",
                    "rgba(255,206,86,0.2)",
                    "rgba(255,206,86,0.2)",
                    "rgba(255,206,86,0.2)",
                    "rgba(255,206,86,0.2)",
                    "rgba(255,206,86,0.2)",
                    "rgba(255,206,86,0.2)",
                ],
                borderColor: [
                    "rgba(255,206,86,0.02)",
                    "rgba(255,206,86,0.02)",
                    "rgba(255,206,86,0.02)",
                    "rgba(255,206,86,0.02)",
                    "rgba(255,206,86,0.02)",
                    "rgba(255,206,86,0.02)",
                    "rgba(255,206,86,0.02)",
                ],
                borderWidth: 1
            }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


//Produccion Turno 1
function produccionTurnos() {
    
    let datosTurno1 = [];
    let datosTurno2=[];
    let datosTurno3=[];
    let horaFinaldia= moment().startOf('isoweek').format("YYYY-MM-DD") + " 15:00:00"
    let horaInicialdia=moment(horaFinaldia).subtract(0,"day").format("YYYY-MM-DD") + " 07:00:00"
    for (let i = 0; i < 7; i++) {
        let fechainicial = moment(horaInicialdia).add(i, "day").format("YYYY-MM-DD") + " 07:00:00"
        let fechafinal = moment(horaFinaldia).add(i, "day").format("YYYY-MM-DD") + " 15:00:00"
        let fechaInicalx = moment(fechainicial).format("X");
        let fechaFinalx = moment(fechafinal).format("X");
        console.log(fechainicial);
        console.log(fechaInicalx)
        console.log(fechafinal)
        console.log(fechaFinalx)
        $.get("/produccionhora/" + fechaInicalx + "/" + fechaFinalx, function (data) {
           datosTurno1.splice(i,0,data.count)
            console.log(datosTurno1)
            graficaProduccion(datosTurno1, datosTurno2, datosTurno3)

        })
        
    }
    //*Produccion Turno 2
    
    let horafinaltarde= moment().startOf('isoweek').format("YYYY-MM-DD") + " 23:00:00"
    let horainicialtarde=moment(horafinaltarde).subtract(0,"day").format("YYYY-MM-DD") + " 15:00:00"
    //console.log(horainicial)
    //console.log(horafinal)
    for (let i=0;i<7;i++){
        let fechainicial = moment(horainicialtarde).add(i, "day").format("YYYY-MM-DD") + " 15:00:00"
        let fechafinal = moment(horafinaltarde).add(i, "day").format("YYYY-MM-DD") + " 23:00:00"
        let fechaInicalx = moment(fechainicial).format("X");
        let fechaFinalx = moment(fechafinal).format("X")
        //console.log(fechainicial)
        //console.log(fechafinal)
        $.get("/produccionhora/" + fechaInicalx + "/" + fechaFinalx, function (data) {
            datosTurno2.splice(i,0,data.count)
             //console.log(datosTurno2)
             graficaProduccion(datosTurno1, datosTurno2, datosTurno3)
 
         })
    }

    //*Produccion Turno 3
    
    let horafinalnoche= moment().startOf('isoweek').format("YYYY-MM-DD") + " 07:00:00"
    let horainicialnoche=moment(horafinalnoche).subtract(1,"day").format("YYYY-MM-DD") + " 23:00:00"
    //console.log(horainicial)
    //console.log(horafinal)
    for (let i=0;i<7;i++){
        let fechainicial = moment(horainicialnoche).add(i, "day").format("YYYY-MM-DD") + " 07:00:00"
        let fechafinal = moment(horafinalnoche).add(i, "day").format("YYYY-MM-DD") + " 23:00:00"
        let fechaInicalx = moment(fechainicial).format("X");
        let fechaFinalx = moment(fechafinal).format("X")
        //console.log(fechainicial)
        //console.log(fechafinal)
        $.get("/produccionhora/" + fechaInicalx + "/" + fechaFinalx, function (data) {
            datosTurno3.splice(i,0,data.count)
            //console.log(datosTurno3)
            graficaProduccion(datosTurno1, datosTurno2, datosTurno3)
 
         })
    }
 

}



