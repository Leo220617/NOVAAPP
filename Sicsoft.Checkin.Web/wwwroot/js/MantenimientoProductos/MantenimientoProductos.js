$(document).ready(function () {

    function matchCustom(params, data) {
        if ($.trim(params.term) === '') {
            return data;
        }

        // Split the search term by the wildcard character '*'
        var terms = params.term.split('*').filter(function (term) {
            return term.length > 0;
        });

        // Check if all parts of the search term are present in the data text
        var match = true;
        for (var i = 0; i < terms.length; i++) {
            if (data.text.toUpperCase().indexOf(terms[i].toUpperCase()) === -1) {
                match = false;
                break;
            }
        }

        if (match) {
            return data;
        }

        return null;
    }

    $("#ProductoSeleccionado").select2({
        matcher: matchCustom
    });
    jQuery(document).ready(function ($) {
        Recuperar();
    });



    $(document).ready(function () {

    });


});

var Bodegas = []; // variables globales
var ProdClientes = [];
var ProdCadena = [];
var ProdPrueba = [];
var Categorias = [];
var Duplicado = false;
var Fechabool = false;
var ProdClientes2 = [];
var ProdSinStock = [];
var htmlS = "";
var inicio = false;
var MiSucursal = [];
var ProdClientes2 = [];

function Recuperar() {
    try {


        Bodegas = JSON.parse($("#Bodegas").val());
        Productos = JSON.parse($("#Productos").val());
        Categorias = JSON.parse($("#Categorias").val());


  
        RellenaCategorias()





    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }

}

function RellenaCategorias() {
    try {
        var html = "";
        $("#CategoriaSeleccionado").html(html);
        html += "<option value='0' > Seleccione Categoria </option>";

        for (var i = 0; i < Categorias.length; i++) {
            html += "<option value='" + Categorias[i].id + "' > " + Categorias[i].CodSAP + " - " + Categorias[i].Nombre + " </option>";
        }



        $("#CategoriaSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}



function onChangeCategoria() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();


        var Categoria = Categorias.find(a => a.id == idCategoria);



        if (idCategoria != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.Stock > 0);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.Stock == 0);
            RellenaProductos();
       
        } 

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }


}





function RellenaProductos() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();



        if (idCategoria != 0) {
            RellenaTabla();
        }


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar facturas:  ' + e

        })
    }
}
function RellenaTabla() {
    try {
        var html = "";

        var idCategoria = $("#CategoriaSeleccionado").val();
        ProdClientes.sort(function (a, b) {
            var nombreA = a.Nombre.toLowerCase();
            var nombreB = b.Nombre.toLowerCase();

            if (nombreA < nombreB) return -1;
            if (nombreA > nombreB) return 1;
            return 0;
        });
        $("#tbody").html(html);


        for (var i = 0; i < ProdClientes.length; i++) {


            var idBodega = ProdClientes[i].idBodega;
            var Bodega = Bodegas.find(a => a.id == idBodega);
            var idSubCategoria = ProdClientes[i].idSubCategoria;
            var SubCategoria = Bodegas.find(a => a.id == idSubCategoria && a.idCategoria);
            html += "<tr>";

            html += "<td class='text-center'>  <input  type='checkbox' id='" + i + "_mdcheckbox' class='chk-col-green' onchange='javascript: onChangeRevisado(" + i + ")'>  <label for='" + i + "_mdcheckbox'></label> </td> ";
            html += "<td > " + ProdClientes[i].Codigo + "-" + ProdClientes[i].Nombre + " </td>";


            html += "<td > " + Bodega.CodSAP + " </td>";

            if (SubCategoria != undefined) {
                html += "<td  id='" + i + "_SubCategoria'> " + SubCategoria.id + ' - ' + SubCategoria.Nombre + " </td>";
            } else {
                html += "<td  id='" + i + "_SubCategoria'> " + 'N/A' + " </td>";
            }





            html += "<td class='text-center'> <input type='number' id='" + i + "_Cantidad1' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center'> <input  type='text' id='" + i + "_Cantidad2' class='form-control'   value= '0' min='1'/>  </td>";
          





            html += "</tr>";


        }

        $("#tbody").html(html);
        if (inicio) {
            RecuperarProdCadena();
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}



function onChangeRevisado(i) {
    try {


        var idCategoria = $("#CategoriaSeleccionado").val();


        var valorCheck = $("#" + i + "_mdcheckbox").prop('checked');
        var PalabraClave = $("#busqueda2").val();


        var Existe = ProdCadena.find(a => a.idProducto == ProdClientes[i].id);
        var x = ProdCadena.findIndex(a => a.idProducto == ProdClientes[i].id);

        var PE = ProdClientes[i];
        if (Existe == undefined) {

            var Cantidad1 = parseFloat($("#" + i + "_Cantidad1").val());
            var Clasificacion = $("#" + i + "_Cantidad2").val();


            var Producto =
            {



                id: 0,
                idProducto: PE.id,
                idCategoria: idCategoria,
                idSubCategoria: 0,
                idUsuarioModificador: 0,
                Fecha: $("#Fecha").val(),
                ItemCode: PE.Codigo,
                Minimo: Cantidad1,
                Clasificacion: Clasificacion


            };

            if (valorCheck == true) {
                $("#" + i + "_Cantidad1").prop('disabled', true);
                $("#" + i + "_Cantidad2").prop('disabled', true);
                $("#" + i + "_Cantidad3").prop('disabled', true);

                $("#" + i + "_SubCategoria").text(PalabraClave);
            } 

            ProdCadena.push(Producto);
        } else {
            var Cantidad1 = parseFloat($("#" + i + "_Cantidad1").val());
            var Clasificacion = $("#" + i + "_Cantidad2").val();

            ProdCadena[x].idProducto = PE.id;
            ProdCadena[x].idCategoria = idCategoria;
            ProdCadena[x].idCategoria = 0;
            ProdCadena[x].idUsuarioModificador = 0;
            ProdCadena[x].Fecha = $("#Fecha").val();
            ProdCadena[x].ItemCode = PE.Codigo;
            ProdCadena[x].Minimo = Cantidad1;
            ProdCadena[x].Clasificacion = Clasificacion;

            

            if (valorCheck == true) {
                $("#" + i + "_Cantidad1").prop('disabled', true);
                $("#" + i + "_Cantidad2").prop('disabled', true);
                $("#" + i + "_SubCategoria").text(PalabraClave);


              
            } else {
                $("#" + i + "_Cantidad1").prop('disabled', false);
                $("#" + i + "_Cantidad2").prop('disabled', false);
                $("#" + i + "_SubCategoria").text("N/A");
                ProdCadena.splice(x, 1);
        
            }


        }

        $("#CategoriaSeleccionado").prop("disabled", true);
        $("#botonGT").prop("disabled", false);

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }

}



function Generar() {

    try {

     
        var MantinimientoProductos = {

            idCategoria: $("#CategoriaSeleccionado").val(),
            PalabraClave: $("#busqueda2").val(),
            idUsuarioModificador: 0,
            Detalle: ProdCadena
        }

        if (validarMantenimiento(MantinimientoProductos)) {
            Swal.fire({
                title: '¿Desea guardar el Mantenimiento Productos?',
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
                    var jsonString = JSON.stringify(MantinimientoProductos);
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


                            console.log("resultado " + json.arqueo);
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

                                        location.reload();



                                    }
                                })

                            } else {

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.arqueo

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

function GeneraryEnviar() {

    try {

        var MantinimientoProductos = {

            idCategoria: $("#CategoriaSeleccionado").val(),
            PalabraClave: $("#busqueda2").val(),
            idUsuarioModificador: 0,
            Detalle: ProdCadena
        }


        if (validarMantenimiento(MantinimientoProductos)) {
            Swal.fire({
                title: '¿Desea enviar a SAP el Mantenimiento Productos?',
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
                    var jsonString = JSON.stringify(MantinimientoProductos);
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


                            console.log("resultado " + json.arqueo);
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

                                        location.reload();



                                    }
                                })

                            } else {

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.arqueo

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

function validarMantenimiento(e) {
    try {



        if (e.idCategoria == "" || e.idCategoria == null || e.idCategoria == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Categoria'

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




function filtrarTabla() {
    var busqueda = $("#busqueda2").val().toLowerCase().trim();
    var busqueda2 = $("#busqueda").val().toLowerCase().trim();
    var filas = $("#tbody tr");
    var indicesVisibles = [];

    // Dividir la búsqueda en palabras
    var palabrasBusqueda = busqueda.split(" ");

    filas.each(function (index) {
        var descripcion = $(this).find("td:eq(1)").text().toLowerCase().trim();

        // Extraer el texto después del primer guion para 'palabraClave'
        var partes = descripcion.split('-');
        var palabraClave = partes.length > 1 ? partes[1].trim() : ''; // Toma la parte después del primer guion, si existe

        // Filtrar solo si 'busqueda' no está vacío
        if (busqueda) {
            // Verifica que 'palabraClave' comience exactamente con las palabras en 'busqueda'
            var coincidePalabraClave = palabraClave.startsWith(busqueda);

            if (coincidePalabraClave) {
                // Si 'busqueda2' está vacío o la 'descripcion' comienza con 'busqueda2'
                if (!busqueda2 || descripcion.includes(busqueda2)) {
                    $(this).show();
                    indicesVisibles.push(index);
                } else {
                    $(this).hide();
                }
            } else {
                $(this).hide();
            }
        } else {
            $(this).hide(); // Si 'busqueda' está vacío, no muestra registros
        }
    });

    // Filtrar ProdClientes2 para que solo muestre productos cuyo 'Nombre' comience exactamente con las palabras de 'busqueda'
    ProdClientes2 = ProdClientes.filter(a => {
        const nombreProducto = a.Nombre.toLowerCase().trim();

        // Verifica que 'nombreProducto' comience exactamente con las palabras en 'busqueda'
        return nombreProducto.startsWith(busqueda);
    });

    return indicesVisibles;
}

function SetearT() {
    try {
        var Minimo = $("#MinimoT").val();
        var Clasificacion = $("#ClasificacionT").val();

        var idCategoria = $("#CategoriaSeleccionado").val();

        var indicesVisibles = filtrarTabla();
        indicesVisibles.forEach(function (index) {

            var descripcion = $(this).find("td:eq(1)").text().toLowerCase();
            var busqueda = $("#busqueda").val().toLowerCase
            var valorCheck = $("#" + index + "_mdcheckbox").prop('checked');
            if (valorCheck == true) {
                if (descripcion.includes(busqueda)) {
                    var Existe = ProdCadena.find(a => a.ItemCode == ProdClientes[index].Codigo && a.idCategoria == idCategoria);




                    if (Existe == undefined) {



                      

                        $("#" + index + "_Cantidad1").val(Minimo);
                        $("#" + index + "_Cantidad2").val(Clasificacion);
              
         

                        onChangeRevisado(index);



                    }
                } else {



                 
                    $("#" + index + "_Cantidad1").val(Minimo);
                    $("#" + index + "_Cantidad2").val(Clasificacion);

              
                    onChangeRevisado(index);



                }
            }
        });
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar   ' + e
        });
    }
}