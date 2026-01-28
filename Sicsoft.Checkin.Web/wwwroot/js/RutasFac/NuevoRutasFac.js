$(document).ready(function () {
    jQuery(document).ready(function ($) {
        Recuperar();
    });



    $(document).ready(function () {

    });


});

var PrecioXLista = []; // variables globales
var ProdClientes = [];
var ProdCadenaC = [];
var Duplicado = false;
var Clientes = [];



function Recuperar() {
    try {



     
        Clientes = JSON.parse($("#Clientes").val());
        RellenaClientes();



        RellenaTabla();

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }

}




function RellenaClientes() {
    try {
        var html = "";
        $("#ClienteSeleccionado").html(html);
        html += "<option value='0' > Seleccione Cliente </option>";

        for (var i = 0; i < Clientes.length; i++) {
            html += "<option value='" + Clientes[i].id + "' > " + Clientes[i].Codigo + " - " + Clientes[i].Cedula + " - " + Clientes[i].Nombre + " </option>";
        }



        $("#ClienteSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}










function AgregarClienteTabla() {
    try {


        var id = parseFloat($("#ClienteSeleccionado").val()),

            Duplicado = false;



        var Cliente =
        {


            idRutaFac: 0,

            idCliente: parseFloat($("#ClienteSeleccionado").val()),




        };




        for (var i = 0; i < ProdCadenaC.length; i++) {




            if (Cliente.idCliente == ProdCadenaC[i].idCliente) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ya se ingreso el mismo cliente en otra línea '

                })
                Duplicado = true;
                return false;
            } else {
                Duplicado = false;
            }
        }







        if (Duplicado == false && Cliente.idCliente != 0) {






            ProdCadenaC.push(Cliente);

            RellenaTablaC();

            $("#ClienteSeleccionado").val("0").trigger('change.select2');
        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error: ' + e

        })
    }








}

function RellenaTablaC() {
    try {
        var html = "";
        $("#tbody2").html(html);




        for (var i = 0; i < ProdCadenaC.length; i++) {
            var Client = Clientes.find(a => a.id == ProdCadenaC[i].idCliente);




            html += "<tr>";

            html += "<td> " + (i + 1) + " </td>";

            html += "<td > " + Client.Codigo + " - " + Client.Nombre + " </td>";


            html += "<td class='text-center'> <a class='fa fa-trash' onclick='javascript:EliminarCliente(" + i + ") '> </a> </td>";


            html += "</tr>";



        }




        $("#tbody2").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}






function EliminarCliente(i) {
    try {
        var Cliente = ProdCadenaC[i];




        ProdCadenaC.splice(i, 1);



        RellenaTablaC();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}


function Generar() {

    try {
  
        var Ruta = {
            id: 0,
            Nombre: $("#inputNombre").val(),
            Precio: $("#inputPrecio").val(),
            KM: $("#inputKM").val(),
            Clientes: ProdCadenaC
        }

        if (validarRuta(Ruta)) {
            Swal.fire({
                title: '¿Desea guardar la ruta?',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: `Aceptar`,
                denyButtonText: `Cancelar`,
                customClass: {
                    confirmButton: 'swalBtnColor',
                    denyButton: 'swalDeny'
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    var jsonString = JSON.stringify(EncPromociones);
                    // Comprimir la cadena JSON utilizando gzip
                    var compressedData = pako.gzip(jsonString);

                    // Convertir los datos comprimidos a un ArrayBuffer (opcional, depende de tu caso de uso)
                    var compressedArrayBuffer = compressedData.buffer;

                    $.ajax({
                        type: 'POST',

                        url: $("#urlGenerar").val(),
                        dataType: 'json',
                        contentType: 'application/json',
                        data: compressedArrayBuffer,
                        processData: false,
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json.ruta);
                            if (json.success == true) {
                                $("#divProcesando").modal("hide");
                                Swal.fire({
                                    title: "Ha sido generado con éxito",

                                    icon: 'success',
                                    showCancelButton: false,

                                    confirmButtonText: 'OK',
                                    customClass: {
                                        confirmButton: 'swalBtnColor',

                                    },
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        //Despues de insertar, ocupariamos el id del cliente en la bd 
                                        //para entonces setearlo en el array de clientes

                                        window.location.href = window.location.href.split("/Nuevo")[0];


                                    }
                                })

                            } else {

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.listaX

                                })
                            }
                        },

                        beforeSend: function () {
                            $("#divProcesando").modal("show");

                        },
                        complete: function () {
                            $("#divProcesando").modal("hide");

                        },
                        error: function (error) {
                            $("#divProcesando").modal("hide");

                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Ha ocurrido un error al intentar guardar ' + error

                            })
                        }
                    });
                }
            })
        } else {
            $("#divProcesando").modal("hide");

        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar agregar ' + e

        })
    }



}

function validarRuta(e) {
    try {



        if (e.Nombre == "" || e.Nombre == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta el nombre'

            })
            return false;
        }
        if (e.Precio == "" || e.Precio == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta el precio'

            })
            return false;
        }

        if (e.KM == "" || e.KM == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta los KM'

            })
            return false;
        }

  


        else {
            return true;
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar agregar ' + e

        })
    }



}

