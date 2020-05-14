require("dotenv").config();
const moment = require('moment-timezone');
const axios = require("axios");

axios.get(process.env.url + "/goalslinea")
    .then(data => {
        console.log(data.data)
        let metaHR10 = data.data[0].daily_hr10;
        let metaBR10 = data.data[0].daily_br10;
        let metaHR16 = data.data[0].daily_hr16;
        ProduccionporSemana(metaHR10, metaBR10, metaHR16);
    })
    .catch((err) =>{
        console.log(err)
    })

//ProduccionporSemana();

function ProduccionporSemana(metaHR10,metaBR10,metaHR16) {
    //console.log("Cron")
    let ArrayreporteHR10 = [];
    let ArrayreporteBR10 = [];
    let ArrayreporteHR16 = [];
    console.log("La meta HR10 es " + metaHR10)

    let fechaInicial = moment().startOf("day").subtract(1, "day").format("X");
    //console.log("La fecha Inicial es " + fechaInicial)
    let fechaFinal = moment().endOf("day").subtract(1, "day").format("X");
    //console.log("La fecha final es " + fechaFinal)
    axios.get(process.env.url + "/produccionsemana/" + fechaInicial + "/" + fechaFinal)
        .then(data => {

            //console.log(data)

            if (data.data.length === 0) {
                //ProduccionSemanal.splice(9 - i, 0, 0)
                ArrayreporteHR10.push(0);
                ArrayreporteBR10.push(0);
                ArrayreporteHR16.push(0);
            }
            else {

                for (let j = 0; j < data.data.length; j++) {

                    ArrayreporteHR10.push(parseInt(data.data[j].ws3b_hr10det) + parseInt(data.data[j].ws3b_hr10gpf));
                    ArrayreporteBR10.push(parseInt(data.data[j].ws4_br10ed) + parseInt(data.data[j].ws4_br10bja) + parseInt(data.data[j].ws4_br10gpf));
                    ArrayreporteHR16.push(parseInt(data.data[j].ws2_hr16))
                }
            }
            console.log(ArrayreporteHR10);
            console.log(ArrayreporteBR10);
            console.log(ArrayreporteHR16);

            let produccion_hr10 = 0;
            let produccion_br10 = 0;
            let produccion_hr16 = 0;

            for (let i = 0; i < ArrayreporteHR10.length; i++) {
                produccion_hr10 += ArrayreporteHR10[i]
            }
            for (let i = 0; i < ArrayreporteBR10.length; i++) {
                produccion_br10 += ArrayreporteBR10[i]
            }
            for (let i = 0; i < ArrayreporteHR16.length; i++) {
                produccion_hr16 += ArrayreporteHR16[i]
            }

            console.log(produccion_hr10);
            console.log(produccion_br10);
            console.log(produccion_hr16)

           


            axios.post(process.env.url + "/reportediariopolonia", {
                produccion_hr10: numberWithCommas(produccion_hr10),
                produccion_br10: numberWithCommas(produccion_br10),
                produccion_hr16: numberWithCommas(produccion_hr16),
                meta_hr10: numberWithCommas(metaHR10),
                meta_br10: numberWithCommas(metaBR10),
                meta_hr16: numberWithCommas(metaHR16)
            }).then(function (response) {
                console.log(response.statusText)
            }).catch(function (err) {
                console.log(err)
            })

        }).catch(function (err) {
            console.log(err)
        })



}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}