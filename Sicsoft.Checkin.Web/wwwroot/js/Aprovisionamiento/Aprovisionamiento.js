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
var ProdClientes2 = [];
var AprovisionamientoProductos = [];
var SubCategorias = [];
var ProdClientes2 = [];
var Proveedores = [];
var Impuestos = [];
function Recuperar() {
    try {


        Bodegas = JSON.parse($("#Bodegas").val());
        Categorias = JSON.parse($("#Categorias").val());
        SubCategorias = JSON.parse($("#SubCategorias").val());
        AprovisionamientoProductos = JSON.parse($("#AprovisionamientoProductos").val());
        Proveedores = JSON.parse($("#Proveedores").val());
        Impuestos = JSON.parse($("#Impuestos").val());


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



function onChangeFiltro() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();
        var idSubCategoria = $("#SubCategoriaSeleccionado").val();
        var Clasificacion = $("#ClasificacionSeleccionado").val();
        var Indicador = parseFloat($("#Indicador").val());
        var IndicadorX = parseFloat($("#IndicadorX").val());

        // Obtiene los checkboxes y las bodegas correspondientes
        var bodegasSeleccionadas = [];
        if ($("#md_checkbox_Cedi").prop('checked')) {
            bodegasSeleccionadas.push(...Bodegas.filter(a => a.CodSuc == "005").map(b => b.CodSAP));
        }
        if ($("#md_checkbox_VK").prop('checked')) {
            bodegasSeleccionadas.push(...Bodegas.filter(a => a.CodSuc == "007").map(b => b.CodSAP));
        }
        if ($("#md_checkbox_AZ").prop('checked')) {
            bodegasSeleccionadas.push(...Bodegas.filter(a => a.CodSuc == "006").map(b => b.CodSAP));
        }
        if ($("#md_checkbox_Belen").prop('checked')) {
            bodegasSeleccionadas.push(...Bodegas.filter(a => a.CodSuc == "011").map(b => b.CodSAP));
        }
        if ($("#md_checkbox_St").prop('checked')) {
            bodegasSeleccionadas.push(...Bodegas.filter(a => a.CodSuc == "008").map(b => b.CodSAP));
        }
        if ($("#md_checkbox_Todas").prop('checked')) {
            bodegasSeleccionadas = Bodegas.map(b => b.CodSAP); // Todas las bodegas
        }

        // Inicializa un array de filtros
        let filters = [];

        if (idCategoria != 0) {
            filters.push(a => a.Id_Categoria == idCategoria);
        }
        if (idSubCategoria != 0) {
            filters.push(a => a.Id_Subcategoria == idSubCategoria);
        }
        if (Clasificacion != 0) {
            filters.push(a => a.Cat_Art_en_Bodega == Clasificacion);
        }
        if (Indicador != undefined && IndicadorX != undefined) { // Si hay un valor para el indicador
            filters.push(a => a.Indicador_ST >= Indicador && a.Indicador_ST <= IndicadorX);
        }
        if (IndicadorX != undefined && Indicador != undefined) { // Si hay un valor para el indicador
            filters.push(a => a.Indicador_ST <= IndicadorX && a.Indicador_ST >= Indicador);
        }
        if (bodegasSeleccionadas.length > 0) {
            filters.push(a => bodegasSeleccionadas.includes(a.Bodega)); // Filtra por bodegas seleccionadas
        }

        // Filtra los productos usando el array de filtros
        ProdClientes = AprovisionamientoProductos.filter(a => filters.every(filter => filter(a)));

        // Lógica para manejar habilitación de SubCategorías
        if (idCategoria != 0) {
            $("#SubCategoriaSeleccionado").prop("disabled", false);
            if (idSubCategoria == 0) {
                RellenaSubCategorias();
            }
              
            
        }

        // Rellena la tabla al final
        RellenaTabla();

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e,
        });
    }
}
function formatoDecimal(numero) {
    var number = numero;

    // En el alemán la coma se utiliza como separador decimal y el punto para los millares
    return new Intl.NumberFormat("en-US").format(number);
}
function RellenaSubCategorias() {
    try {
        var html = "";
        $("#SubCategoriaSeleccionado").html(html);
        html += "<option value='0' > Seleccione Sub Categoria </option>";
        var idCategoria = $("#CategoriaSeleccionado").val();

        SubCategorias = SubCategorias.filter(a => a.idCategoria == idCategoria);
        for (var i = 0; i < SubCategorias.length; i++) {
            html += "<option value='" + SubCategorias[i].id + "' > " + SubCategorias[i].id + " - " + SubCategorias[i].Nombre + " </option>";
        }



        $("#SubCategoriaSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}


function RellenaProveedores() {
    try {
        var html = "";
        $("#SubCategoriaSeleccionado").html(html);
        html += "<option value='0' > Seleccione Sub Categoria </option>";
        var idCategoria = $("#CategoriaSeleccionado").val();

        SubCategorias = SubCategorias.filter(a => a.idCategoria == idCategoria);
        for (var i = 0; i < SubCategorias.length; i++) {
            html += "<option value='" + SubCategorias[i].id + "' > " + SubCategorias[i].id + " - " + SubCategorias[i].Nombre + " </option>";
        }



        $("#SubCategoriaSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function RellenaTabla() {
    try {
        var html = "";

        var idCategoria = $("#CategoriaSeleccionado").val();
        ProdClientes.sort(function (a, b) {
            var nombreA = a.Nombre_Articulo.toLowerCase();
            var nombreB = b.Nombre_Articulo.toLowerCase();

            if (nombreA < nombreB) return -1;
            if (nombreA > nombreB) return 1;
            return 0;
        });
        $("#tbody").html(html);


        for (var i = 0; i < ProdClientes.length; i++) {




            var idSubCategoria = ProdClientes[i].Id_Subcategoria;
            var idCategoria = ProdClientes[i].Id_Categoria;
            var SubCategoria = SubCategorias.find(a => a.id == idSubCategoria);
            var Categoria = Categorias.find(a => a.id == idCategoria);
            html += "<tr>";



            html += "<td > " + ProdClientes[i].Codigo_Articulo + "-" + ProdClientes[i].Nombre_Articulo + " </td>";


            html += "<td > " + ProdClientes[i].Bodega + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Stock_en_Bodega).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Pedido).toFixed(2)) + " </td>";



     


         
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Ultimo_Precio_Compra).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Costo_Promedio).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Promedio_Venta_Ult_3_Meses).toFixed(2)) + " </td>";

            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Inventario_Ideal).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Indicador_ST).toFixed(2)) + " </td>";
            if (ProdClientes[i].Pedido_Sugerido < 0) {
                html += "<td class='text-right' style='background-color : #FFE9E9;'>" + formatoDecimal(parseFloat(ProdClientes[i].Pedido_Sugerido).toFixed(2)) + " </td>";
            } else {
                html += "<td class='text-right' style='background-color : #EFFFE9;'>" + formatoDecimal(parseFloat(ProdClientes[i].Pedido_Sugerido).toFixed(2)) + " </td>";
            }
   
            html += "<td class='text-center'> <input disabled onchange='javascript: onChangeCompra(" + i + ")' type='number' id='" + i + "_Compra' class='form-control'  style='width: 80px; height: 40px;' value= '0' min='1'/>  </td>";
            html += "<td class='text-center'> <input disabled onchange='javascript: onChangeCompra(" + i + ")' type='number' id='" + i + "_PrecioCompra' class='form-control' style='width: 150px; height: 40px;'  value= '0' min='1'/>  </td>";

            html += "<td>";
            html += "<select onchange='javascript: onChangeCompra(" + i + ")' disabled id='" + i + "_Impuesto' >";

            Impuestos.forEach(impuesto => {
                if ((impuesto.Codigo === "EX" || impuesto.Codigo === "IV" || impuesto.Codigo === "IVA-1") && impuesto.Activo) {
                    html += `<option value="${impuesto.Codigo}" ${impuesto.Codigo === "IV" ? "selected" : ""}>${impuesto.Tarifa}</option>`;
                }
            });

            html += "</select>";
            html += "</td>";
            html += "<td class='text-right' id='" + i + "_TotalImpuesto'> " + '0' + " </td>";

            html += "<td class='text-right' id='" + i + "_TotalCompra'> " + '0' + " </td>";

            html += "<td class='text-center'>  <input  type='checkbox' id='" + i + "_mdcheckbox' class='chk-col-green' onchange='javascript: onChangeCompra(" + i + ")'>  <label for='" + i + "_mdcheckbox'></label> </td> ";


            html += "<td class='text-right'  style='background-color : #fff4e9;'> " + formatoDecimal(parseFloat(ProdClientes[i].Stock_Todas).toFixed(2)) + " </td>";
            html += "<td class='text-right'  style='background-color : #fff4e9;'> " + formatoDecimal(parseFloat(ProdClientes[i].Promedio_Venta_Todas_3Meses).toFixed(2)) + " </td>";
            html += "<td class='text-right'  style='background-color : #fff4e9;'> " + formatoDecimal(parseFloat(ProdClientes[i].Indicador_ST_Todas).toFixed(2)) + " </td>";







            html += "</td>";


            html += "<td>";
            html += "<select  onchange='javascript: onChangeCompra(" + i + ")' disabled id='" + i + "_Proveedor' class='proveedor'>";
            Proveedores.forEach(Proveedores => {
                html += `<option value="${Proveedores.CardCode}" ${ProdClientes[i].Cod_Proveedor === Proveedores.CardCode ? "selected" : ""
                    }>${Proveedores.CardCode} - ${Proveedores.Nombre}</option>`;
            });
            html += "</select>";
            html += "</td>";





            html += "</tr>";


        }

        $("#tbody").html(html);
        $(document).ready(function () {
            // Solo aplicamos select2 a los elementos con la clase 'proveedor'
            $('select.proveedor').select2();
        });

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function onChangeCompra(i) {
    try {


        var idCategoria = $("#CategoriaSeleccionado").val();
        var idSubCategoria = $("#SubCategoriaSeleccionado").val();



        var valorCheck = $("#" + i + "_mdcheckbox").prop('checked');

        if (valorCheck == true) {
            /*    var Existe = ProdCadena.find(a => a.CodigoProducto == ProdClientes[i].Codigo_Articulo && a.idCategoria == idCategoria && a.idSubCategoria == idSubCategoria && a.Bodega == ProdClientes[i].Bodega);*/

           
            $("#" + i + "_Compra").prop('disabled', false);

            if ($("#" + i + "_Compra").val() > 0) {
                $("#" + i + "_PrecioCompra").prop('disabled', false);
                $("#" + i + "_Proveedor").prop('disabled', false);
                $("#" + i + "_Impuesto").prop('disabled', false);
            } else {
                $("#" + i + "_PrecioCompra").prop('disabled', true);
                $("#" + i + "_Proveedor").prop('disabled', true);
                $("#" + i + "_Impuesto").prop('disabled', true);
            }
           
            $("#ClasificacionSeleccionado").prop('disabled', true);
            $("#CategoriaSeleccionado").prop('disabled', true);
            $("#SubCategoriaSeleccionado").prop('disabled', true);
            $("#Indicador").prop('disabled', true);
            $("#IndicadorX").prop('disabled', true);
            $("#md_checkbox_Cedi").prop('disabled', true);
            $("#md_checkbox_VK").prop('disabled', true);
            $("#md_checkbox_AZ").prop('disabled', true);
            $("#md_checkbox_Belen").prop('disabled', true);
            $("#md_checkbox_St").prop('disabled', true);
            $("#md_checkbox_Todas").prop('disabled', true);

            var Existe = ProdCadena.find(a => a.CodigoProducto == ProdClientes[i].Codigo_Articulo && a.Bodega == ProdClientes[i].Bodega);
            var x = ProdCadena.findIndex(a => a.CodigoProducto == ProdClientes[i].Codigo_Articulo && a.Bodega == ProdClientes[i].Bodega);
            var Impuesto = $("#" + i + "_Impuesto").val();
            var ImpuestoTarifa = Impuestos.find(a => a.Codigo == Impuesto).Tarifa;
            var PrecioCompra = parseFloat($("#" + i + "_PrecioCompra").val());

            var Cantidad = parseFloat($("#" + i + "_Compra").val());
            var TotalImpuesto = (PrecioCompra * (ImpuestoTarifa / 100)) * Cantidad;
            var TotalCompra = TotalImpuesto + (PrecioCompra * Cantidad);
            var TotalImpuestoX = formatoDecimal(parseFloat(TotalImpuesto).toFixed(2)); 
            var TotalCompraX = formatoDecimal(parseFloat(TotalCompra).toFixed(2)); 

            $("#" + i + "_TotalCompra").text(TotalCompraX);
            $("#" + i + "_TotalImpuesto").text(TotalImpuestoX);
            var CodProveedor = $("#" + i + "_Proveedor").val();
            var NombreProveedor = Proveedores.find(a => a.CardCode == CodProveedor).Nombre;
            var PE = ProdClientes[i];
            if (Existe == undefined) {

                var Producto =
                {
                    CodigoProducto: PE.Codigo_Articulo,
                    NombreProducto: PE.Nombre_Articulo,
                    Bodega: PE.Bodega,
                    Stock: PE.Stock_en_Bodega,
                    Pedido: PE.Pedido,
                    CodProveedor: CodProveedor,
                    NombreProveedor: NombreProveedor,
                    UltPrecioCompra: PE.Ultimo_Precio_Compra,
                    CostoPromedio: PE.Costo_Promedio,
                    PromedioVenta: PE.Promedio_Venta_Ult_3_Meses,
                    InventarioIdeal: PE.Inventario_Ideal,
                    PedidoSugerido: PE.Pedido_Sugerido,
                    Compra: parseFloat($("#" + i + "_Compra").val()),
                    Chequeado: $("#" + i + "_mdcheckbox").prop('checked'),
                    StockTodas: PE.Stock_Todas,
                    PromedioVentaTodas: PE.Promedio_Venta_Todas_3Meses,
                    IndicadorSTTodas: PE.Indicador_ST_Todas,
                    PrecioCompra: parseFloat($("#" + i + "_PrecioCompra").val()),
                    Impuesto: $("#" + i + "_Impuesto").val(),
                    TotalImpuesto: parseFloat(TotalImpuesto),
                    TotalCompra: parseFloat(TotalCompra)


                };



                ProdCadena.push(Producto);
            } else {
                ProdCadena[x].Compra = parseFloat($("#" + i + "_Compra").val());
                ProdCadena[x].PrecioCompra = parseFloat($("#" + i + "_PrecioCompra").val());
                ProdCadena[x].Impuesto = $("#" + i + "_Impuesto").val();
                ProdCadena[x].TotalImpuesto = parseFloat(TotalImpuesto);
                ProdCadena[x].TotalCompra = parseFloat(TotalCompra);
                ProdCadena[x].CodProveedor = CodProveedor;
                ProdCadena[x].NombreProveedor = NombreProveedor;



            }
        }
        else {
            var Existe = ProdCadena.find(a => a.CodigoProducto == ProdClientes[i].Codigo_Articulo && a.Bodega == ProdClientes[i].Bodega);
            var x = ProdCadena.findIndex(a => a.CodigoProducto == ProdClientes[i].Codigo_Articulo && a.Bodega == ProdClientes[i].Bodega);
            if (Existe != undefined) {


                $("#" + i + "_Compra").prop('disabled', true);
                $("#" + i + "_PrecioCompra").prop('disabled', true);
                $("#" + i + "_Proveedor").prop('disabled', true);
                $("#" + i + "_Impuesto").prop('disabled', true);


                $("#" + i + "_Compra").val(0);
                $("#" + i + "_PrecioCompra").val(0);
 /*               $("#" + i + "_Proveedor").val();*/
                $("#" + i + "_Impuesto").val("IV");
                $("#" + i + "_TotalCompra").text("0");
                $("#" + i + "_TotalImpuesto").text("0");
                ProdCadena.splice(x, 1);

                if (ProdCadena.length == 0) {
                    $("#ClasificacionSeleccionado").prop('disabled', false);
                    $("#CategoriaSeleccionado").prop('disabled', false);
                    $("#SubCategoriaSeleccionado").prop('disabled', false);
                    $("#Indicador").prop('disabled', false);
                    $("#IndicadorX").prop('disabled', false);
                    $("#md_checkbox_Cedi").prop('disabled', false);
                    $("#md_checkbox_VK").prop('disabled', false);
                    $("#md_checkbox_AZ").prop('disabled', false);
                    $("#md_checkbox_Belen").prop('disabled', false);
                    $("#md_checkbox_St").prop('disabled', false);
                    $("#md_checkbox_Todas").prop('disabled', false);
                }
            }
        }


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }

}
function filtrarTabla() {
    var busqueda = $("#busqueda").val().toLowerCase().trim();
    var filas = $("#tbody tr");
    var indicesVisibles = [];

    // Si la búsqueda está vacía, muestra todas las filas
    if (busqueda === "") {
        filas.show();
        return;
    }

    filas.each(function (index) {
        var coincide = false; // Bandera para verificar si la fila cumple con la búsqueda

        // Recorre cada celda de la fila
        $(this).find("td").each(function () {
            var textoCelda = $(this).text().toLowerCase().trim();

            // Verifica si alguna celda contiene el término de búsqueda
            if (textoCelda.includes(busqueda)) {
                coincide = true;
            }
        });

        // Si la fila cumple con la búsqueda, la muestra
        if (coincide) {
            $(this).show();
            indicesVisibles.push(index);
        } else {
            $(this).hide();
        }
    });

    return indicesVisibles;
}


function Generar() {

    try {

        var filtros = "";
        if ($("#md_checkbox_Cedi").prop('checked')) {
            filtros += "C;";
        }
        if ($("#md_checkbox_VK").prop('checked')) {
            filtros += "VK;";
        }
        if ($("#md_checkbox_AZ").prop('checked')) {
            filtros += "AZ;";
        }
        if ($("#md_checkbox_Belen").prop('checked')) {
            filtros += "B;";
        }
        if ($("#md_checkbox_St").prop('checked')) {
            filtros += "St;";
        }
        if ($("#md_checkbox_Todas").prop('checked')) {
            filtros += "T;";
        }
        var EncAprovisionamiento = {

            id: 0,
            idCategoria: $("#CategoriaSeleccionado").val(),
            idSubCategoria: $("#SubCategoriaSeleccionado").val(),
            idUsuarioCreador: 0,
            Fecha: $("#Fecha").val(),
            Status: "P",
            Clasificacion: $("#ClasificacionSeleccionado").val(),
            IndicadorMayor: parseFloat($("#Indicador").val()),
            IndicadorMenor: parseFloat($("#IndicadorX").val()),
            FiltroSeleccionado: filtros,
            Detalle: ProdCadena
        }

        if (validarAprovisionamiento(EncAprovisionamiento)) {
            Swal.fire({
                title: '¿Desea guardar el Aprovisionamiento?',
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
                    var jsonString = JSON.stringify(EncAprovisionamiento);
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


                            console.log("resultado " + json.aprovisionamiento);
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
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.aprovisionamiento

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

        var filtros = "";
        if ($("#md_checkbox_Cedi").prop('checked')) {
            filtros += "C;";
        }
        if ($("#md_checkbox_VK").prop('checked')) {
            filtros += "VK;";
        }
        if ($("#md_checkbox_AZ").prop('checked')) {
            filtros += "AZ;";
        }
        if ($("#md_checkbox_Belen").prop('checked')) {
            filtros += "B;";
        }
        if ($("#md_checkbox_St").prop('checked')) {
            filtros += "St;";
        }
        if ($("#md_checkbox_Todas").prop('checked')) {
            filtros += "T;";
        }
        var EncAprovisionamiento = {

            id: 0,
            idCategoria: $("#CategoriaSeleccionado").val(),
            idSubCategoria: $("#SubCategoriaSeleccionado").val(),
            idUsuarioCreador: 0,
            Fecha: $("#Fecha").val(),
            Status: "E",
            Clasificacion: $("#ClasificacionSeleccionado").val(),
            IndicadorMayor: parseFloat($("#Indicador").val()),
            IndicadorMenor: parseFloat($("#IndicadorX").val()),
            FiltroSeleccionado: filtros,
            Detalle: ProdCadena
        }

        if (validarAprovisionamiento(EncAprovisionamiento)) {
            Swal.fire({
                title: '¿Desea generar la compra del Aprovisionamiento?',
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
                    var jsonString = JSON.stringify(EncAprovisionamiento);
                    // Comprimir la cadena JSON utilizando gzip
                    var compressedData = pako.gzip(jsonString);

                    // Convertir los datos comprimidos a un ArrayBuffer (opcional, depende de tu caso de uso)
                    var compressedArrayBuffer = compressedData.buffer;

                    $.ajax({
                        type: 'POST',

                        url: $("#urlGenerarC").val(),
                        dataType: 'json',
                        contentType: 'application/json',
                        data: compressedArrayBuffer,
                        processData: false,
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json.aprovisionamiento);
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
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.aprovisionamiento

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

function validarAprovisionamiento(e) {
    try {



        if (e.idCategoria == "" || e.idCategoria == null || e.idCategoria == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Categoria'

            })
            return false;
        }

        if (e.idSubCategoria == "" || e.idSubCategoria == null || e.idSubCategoria == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la SubCategoria'

            })
            return false;
        }


        if (e.Clasificacion == "" || e.Clasificacion == null || e.Clasificacion == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Clasificacion'

            })
            return false;
        }

        if (e.IndicadorMenor == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta el Indicador Menor'

            })
            return false;
        }

        if (e.IndicadorMayor == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta el Indicador Mayor'

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
