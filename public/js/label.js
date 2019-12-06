$(document).ready(function () {

    ProduccionTurnoDia();
    ProduccionporSemana();

    function ProduccionTurnoDia() {
        let fechaInicial = moment().startOf("week").format("X");
        //console.log("La fecha Inicial es " + fechaInicial)
        let fechaFinal = moment().endOf("week").format("X");
        //console.log("La fecha final es " + fechaFinal)
        $.when(
            $.get("produccionhoradia/" + fechaInicial + "/" + fechaFinal, function (data) {
                //console.log(data)
            }),
            $.get("produccionhoratarde/" + fechaInicial + "/" + fechaFinal, function (data) {

            }),
            $.get("produccionhoranoche/" + fechaInicial + "/" + fechaFinal, function (data) {

            })
        ).then(function (data, data2, data3) {
            //console.log(data);
            //console.log(data2);
            //console.log(data3);
            //console.log(data[0])
            var datosDia = data[0];
            var datosTarde = data2[0];
            var datosNoche = data3[0];
            let ProduccionTurnoDia = [0, 0, 0, 0, 0, 0, 0];
            for (let i = 0; i < datosDia.length; i++) {
                var indice = datosDia[i].dia;
                ProduccionTurnoDia[indice] = parseInt(datosDia[i].line_hr10_lp1) + parseInt(datosDia[i].line_hr10_lp2)
            }
            let ProduccionTurnoTarde = [0, 0, 0, 0, 0, 0, 0];
            for (let i = 0; i < datosTarde.length; i++) {
                var indice = datosTarde[i].dia;
                ProduccionTurnoTarde[indice] = parseInt(datosTarde[i].line_hr10_lp1) + parseInt(datosTarde[i].line_hr10_lp2)
            }
            let ProduccionTurnoNoche = [0, 0, 0, 0, 0, 0, 0];
            for (let i = 0; i < datosNoche.length; i++) {
                var indice = datosNoche[i].dia;
                ProduccionTurnoNoche[indice] = parseInt(datosNoche[i].line_hr10_lp1) + parseInt(datosNoche[i].line_hr10_lp2)
            }
            GraficaporTurno(ProduccionTurnoDia, ProduccionTurnoTarde, ProduccionTurnoNoche)
        })
    }

    // Grafica por turno 7 dias

    //* Se poner afuera la variable para que no muestre datos viejos.
    var myChart;

    function GraficaporTurno(ProduccionTurnoDia, ProduccionTurnoTarde, ProduccionTurnoNoche) {
        if (myChart) {
            myChart.destroy();
        }
        var ctx = $("#myChart");
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                datasets: [{
                    label: "Shift 1",
                    data: ProduccionTurnoDia,
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
                    label: "Shift 2",
                    data: ProduccionTurnoTarde,
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
                    label: "Shift 3",
                    data: ProduccionTurnoNoche,
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
                }, {
                    label: "Goal",
                    data: [760, 760, 760, 760, 760, 760, 760],
                    type: "line",
                    backgroundColor: [
                        'rgb(255,99,132)'
                    ],
                    fill: false,
                    borderColor: [
                        "rgb(255,99,132)"
                    ]
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
                },
                animation: {
                    duration: 2000,
                    onProgress: function () {

                        $("#loadingTurno").hide()
                    },

                }
            }
        });
    }

    function ProduccionporSemana() {
        let ProduccionSemanal = [];
        let NumSemana = [];
        let ArrayreporteSemana = [];

        for (let i = 9; i >= 0; i--) {
            console.log("El i es " + i)
            let fechaInicial = moment().startOf("week").subtract(i, "weeks").format("X");
            //console.log("La fecha Inicial es " + fechaInicial)
            let fecha = moment().startOf("week").subtract(i, "weeks")
            //console.log(fecha)
            let fechaFinal = moment().endOf("week").subtract(i, "weeks").format("X");
            //console.log("La fecha final es " + fechaFinal)
            NumSemana.splice(9 - i, 0, moment(fecha).week())
            $.get("produccionsemana/" + fechaInicial + "/" + fechaFinal, function (data) {
                //console.log(data)
            })
                .then(function (data) {
                    //console.log(data)

                    if (data.length === 0) {
                        //ProduccionSemanal.splice(9 - i, 0, 0)
                        ArrayreporteSemana.push({
                            index: i,
                            produccion: 0
                        })
                    }
                    else {
                        let Reportesemana = [];
                        let Totalsemana = 0;


                        for (let j = 0; j < data.length; j++) {
                            //!Este dato se cambia dependiendo de la linea
                            Reportesemana.push(parseInt(data[j].line_hr10_lp1) + parseInt(data[j].line_hr10_lp2))
                        }
                        //console.log(Reportesemana)
                        for (let j = 0; j < Reportesemana.length; j++) {
                            //console.log(Reportesemana[j])
                            //console.log(Totalsemana)
                            Totalsemana += (Reportesemana[j])




                        }
                        //console.log(Totalsemana)
                        //console.log(i)
                        //ProduccionSemanal.splice(9 - i, 0, Totalsemana);
                        //console.log(ProduccionSemanal);
                        ArrayreporteSemana.push({
                            index: i,
                            produccion: Totalsemana
                        })
                        ArrayreporteSemana.sort((a, b) => parseFloat(b.index) - parseFloat(a.index));
                        console.log(ArrayreporteSemana)
                        console.log(ArrayreporteSemana.length)
                        if (ArrayreporteSemana.length === 10) {
                            for (let j = 0; j < ArrayreporteSemana.length; j++) {
                                ProduccionSemanal.push(ArrayreporteSemana[j].produccion)
                            }
                            console.log(ProduccionSemanal)
                        }
                    }
                    graficaProduccionsemana(ProduccionSemanal, NumSemana)

                })
        }

    }

    //* Se poner afuera la variable para que no muestre datos viejos.
    var myChart2;

    function graficaProduccionsemana(ProduccionSemanal, NumSemana) {
        //console.log(datosSemana);
        if (myChart2) {
            myChart2.destroy();
        }

        if (ProduccionSemanal.length === 10) {
            //console.log("Entro chart2")
            var ctx2 = $("#myChart2");
            myChart2 = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: NumSemana,
                    datasets: [{
                        label: "Produccion Por Week",
                        data: ProduccionSemanal,
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
                    },
                    animation: {
                        duration: 2000,
                        onProgress: function () {

                            $("#loadingSemana").hide()
                        },

                    }
                }
            });
        }
    }

})