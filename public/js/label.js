getLast6();
produccionPorhora();
produccionTurnos();
produccionPorsemana();


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
    for (let i = 0; i < 9; i++) {
        //calcula la hora actual y resta 9 horas atras
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

//* Se poner afuera la variable para que no muestre datos viejos.
var myChart;

function graficaProduccion(datosTurno1, datosTurno2, datosTurno3) {
    if (myChart) {
        myChart.destroy();
    }

    if (datosTurno1.length === 7 && datosTurno2.length === 7 && datosTurno3.length === 7) {
        //console.log("Entro chart")
        var ctx = $("#myChart");
        myChart = new Chart(ctx, {
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
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(255, 99, 132, 0.2)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(255, 99, 132, 1)",
                        "rgba(255, 99, 132, 1)",
                        "rgba(255, 99, 132, 1)",
                        "rgba(255, 99, 132, 1)",
                        "rgba(255, 99, 132, 1)",
                        "rgba(255, 99, 132, 1)",
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
}


//Produccion Turno 1
function produccionTurnos() {

    let datosTurno1 = [];
    let datosTurno2 = [];
    let datosTurno3 = [];
    let horaFinaldia = moment().startOf('isoweek').format("YYYY-MM-DD") + " 15:00:00"
    let horaInicialdia = moment(horaFinaldia).subtract(0, "day").format("YYYY-MM-DD") + " 07:00:00"
    //*Produccion Turno 2

    let horafinaltarde = moment().startOf('isoweek').format("YYYY-MM-DD") + " 23:00:00"
    let horainicialtarde = moment(horafinaltarde).subtract(0, "day").format("YYYY-MM-DD") + " 15:00:00"

    //* Produccion Turno 3
    let horafinalnoche = moment().startOf('isoweek').format("YYYY-MM-DD") + " 07:00:00"
    let horainicialnoche = moment(horafinalnoche).subtract(1, "day").format("YYYY-MM-DD") + " 23:00:00"

    for (let i = 0; i < 7; i++) {
        let fechainicialDia = moment(horaInicialdia).add(i, "day").format("YYYY-MM-DD") + " 07:00:00"
        let fechafinalDia = moment(horaFinaldia).add(i, "day").format("YYYY-MM-DD") + " 15:00:00"
        let fechaInicalDiax = moment(fechainicialDia).format("X");
        let fechaFinaldiax = moment(fechafinalDia).format("X");
        //Turno Tarde
        let fechainicialTarde = moment(horainicialtarde).add(i, "day").format("YYYY-MM-DD") + " 15:00:00"
        let fechafinalTarde = moment(horafinaltarde).add(i, "day").format("YYYY-MM-DD") + " 23:00:00"
        let fechaInicaltardex = moment(fechainicialTarde).format("X");
        let fechaFinaltardex = moment(fechafinalTarde).format("X")
        //Turno Noche
        let fechainicialNoche = moment(horainicialnoche).add(i, "day").format("YYYY-MM-DD") + " 23:00:00"
        let fechafinalNoche = moment(horafinalnoche).add(i, "day").format("YYYY-MM-DD") + " 07:00:00"
        let fechaInicalnochex = moment(fechainicialNoche).format("X");
        let fechaFinalnochex = moment(fechafinalNoche).format("X")

        $.when(

            $.get("/produccionhora/" + fechaInicalDiax + "/" + fechaFinaldiax, function (data) {
                datosTurno1.splice(i, 0, data.count)
                //console.log(datosTurno1)
                //graficaProduccion(datosTurno1, datosTurno2, datosTurno3)

            }),

            $.get("/produccionhora/" + fechaInicaltardex + "/" + fechaFinaltardex, function (data) {
                datosTurno2.splice(i, 0, data.count)
                //console.log(datosTurno2)
                //graficaProduccion(datosTurno1, datosTurno2, datosTurno3)

            }),

            $.get("/produccionhora/" + fechaInicalnochex + "/" + fechaFinalnochex, function (data) {
                datosTurno3.splice(i, 0, data.count)
                //console.log(datosTurno3)
                //graficaProduccion(datosTurno1, datosTurno2, datosTurno3)


            })
        ).then(function () {
            graficaProduccion(datosTurno1, datosTurno2, datosTurno3)
        })

    }
}


//*Funcion para sacar la producción por semana

function produccionPorsemana() {
    let datosSemana = [];
    let numSemana = [];
    //console.log("Inicio de semana " + moment().startOf("week"))
    //console.log("Fin de semana " + moment().endOf("week"))
    for (let i = 9; i >= 0; i--) {
        //console.log("entro")
        let fechainicial = moment().startOf("week").subtract(i, "weeks")
        let fechafinal = moment().endOf("week").subtract(i, "weeks")
        numSemana.splice(9 - i, 0, moment(fechainicial).week())
        $.when(
            $.get("/produccionhora/" + fechainicial + "/" + fechafinal, function (data) {
                datosSemana.splice(i, 0, data.count)

                //console.log(moment(fechainicial).week())


            }),
        ).then(function () {
            //console.log(datosSemana)
            //console.log(numSemana)
            graficaProduccionsemana(datosSemana, numSemana)
        })

    }

}

//* Se poner afuera la variable para que no muestre datos viejos.
var myChart2;

function graficaProduccionsemana(datosSemana, numSemana) {
    if (myChart2) {
        myChart2.destroy();
    }

    if (datosSemana.length === 10) {
        //console.log("Entro chart")
        var ctx2 = $("#myChart2");
        myChart2 = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: numSemana,
                datasets: [{
                    label: "Produccion Por Turno",
                    data: datosSemana,
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
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
                        'rgba(75,192,192,1)',
                        'rgba(75,192,192,1)',
                        'rgba(75,192,192,1)',
                    ],
                    borderWidth: 1
                },
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
}

