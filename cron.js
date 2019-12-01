const moment = require('moment-timezone');
const axios = require("axios");

ProduccionporSemana();

function ProduccionporSemana() {
    console.log("Cron")
    let ArrayreporteSemana = [];

    let fechaInicial = moment().startOf("week").subtract(1, "weeks").format("X");
    //console.log("La fecha Inicial es " + fechaInicial)
    let fechaFinal = moment().endOf("week").subtract(1, "weeks").format("X");
    //console.log("La fecha final es " + fechaFinal)
    axios.get("https://polskakpi.com/produccionsemana/" + fechaInicial + "/" + fechaFinal)
        .then(data => {

            //console.log(data)

            if (data.data.length === 0) {
                //ProduccionSemanal.splice(9 - i, 0, 0)
                ArrayreporteSemana.push({
                    index: i,
                    produccion: 0
                })
            }
            else {
                let Reportesemana = [];
                let Totalsemana = 0;


                for (let j = 0; j < data.data.length; j++) {

                    Reportesemana.push(parseInt(data.data[j].line_hr10_lp1) + parseInt(data.data[j].line_hr10_lp2))
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
                    index: 0,
                    produccion: Totalsemana
                })
                ArrayreporteSemana.sort((a, b) => parseFloat(b.index) - parseFloat(a.index));
                //console.log(ArrayreporteSemana)
                //console.log(ArrayreporteSemana.length)
                console.log("La produccion fue de " + ArrayreporteSemana[0].produccion)
            }
            axios.post("https://polskakpi.com/reportepolonia", {
                produccion: ArrayreporteSemana[0].produccion,
            }).then(function (response) {
                console.log(response.statusText)
            }).catch(function (err) {
                console.log(err)
            })

        }).catch(function (err) {
            console.log(err)
        })



}

