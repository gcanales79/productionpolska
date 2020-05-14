$(document).ready(function () {
    $("#botonCambio").on("click", (event) => {
        event.preventDefault();
        $("#mensaje").empty();
        let goalLinea = $("#inputGroupSelect01").val().trim();
        let newGoal = $("#metaNueva").val().trim();
        let dataObject = { "newGoal": newGoal }
        //console.log(newGoal)
        //Revisa que hayas seleccionado una linea
        if (goalLinea == "Choose...") {
            let newDiv = $("<div>");
            newDiv.text("Please choose a line to update")
            newDiv.attr("class", "alert alert-danger")
            $("#mensaje").append(newDiv)
        }
        else {
            //Revisa que hayas puesto un valor
            if (newGoal == "") {
                let newDiv = $("<div>");
                newDiv.text("Please put a value as a new goal")
                newDiv.attr("class", "alert alert-danger")
                $("#mensaje").append(newDiv)
            }
            //Llama el API
            else {
                $.ajax({
                    url: "/api/updategoal/" + goalLinea,
                    type: "PUT",
                    data: JSON.stringify(dataObject),
                    contentType: "application/json",
                    success:
                        function (data) {
                            console.log(data)
                            if (data.result == 'redirect') {
                                //redirecting to main page from here.
                                window.location.replace(data.url);
                              }
                        }
                })
            }
        }

    })
})