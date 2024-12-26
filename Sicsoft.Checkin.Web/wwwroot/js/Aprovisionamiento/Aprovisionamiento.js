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
function Recuperar() {
    try {


        Bodegas = JSON.parse($("#Bodegas").val());
        Categorias = JSON.parse($("#Categorias").val());
        SubCategorias = JSON.parse($("#SubCategorias").val());
        AprovisionamientoProductos = JSON.parse($("#AprovisionamientoProductos").val());



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


//function onChangeFiltro() {
//    try {
//        var idCategoria = $("#CategoriaSeleccionado").val();
//        var idSubCategoria = $("#SubCategoriaSeleccionado").val();
//        var Clasificacion = $("#ClasificacionSeleccionado").val();
//        var Indicador = parseFloat($("#Indicador").val());


//        if (idCategoria != 0 && idSubCategoria != 0 && Clasificacion != 0) {
//            ProdClientes = AprovisionamientoProductos.filter(a => a.Id_Categoria == idCategoria && a.Id_Subcategoria == idSubCategoria && a.Cat_Art_en_Bodega == Clasificacion && a.Indicador_ST > Indicador);


//        } else if (idCategoria != 0 && idSubCategoria == 0 && Clasificacion == 0) { //Solo Categoria
//            ProdClientes = AprovisionamientoProductos.filter(a => a.Id_Categoria == idCategoria && a.Indicador_ST > Indicador);

//            $("#SubCategoriaSeleccionado").prop("disabled", false);
//            RellenaSubCategorias()

//            RellenaTabla();
//        } else if (idCategoria == 0 && idSubCategoria == 0 && Clasificacion != 0) { //Solo Clasificacion
//            ProdClientes = AprovisionamientoProductos.filter(a => a.Cat_Art_en_Bodega == Clasificacion && a.Indicador_ST > Indicador);
//            RellenaTabla();

//        } else if (idCategoria == 0 && idSubCategoria != 0 && Clasificacion == 0) { //Solo SubCategoria
//            ProdClientes = AprovisionamientoProductos.filter(a => a.Id_Subcategoria == idSubCategoria && a.Indicador_ST > Indicador);
//            RellenaTabla();

//        } else if (idCategoria != 0 && idSubCategoria != 0 && Clasificacion == 0) { //Categoria y SubCategoria
//            ProdClientes = AprovisionamientoProductos.filter(a => a.Id_Categoria == idCategoria && a.Id_Subcategoria == idSubCategoria && a.Indicador_ST > Indicador);

//            RellenaTabla();
//        } else if (idCategoria != 0 && idSubCategoria == 0 && Clasificacion != 0) { //Categoria y Clasificacion
//            ProdClientes = AprovisionamientoProductos.filter(a => a.Id_Categoria == idCategoria && a.Cat_Art_en_Bodega == Clasificacion && a.Indicador_ST > Indicador);

//            $("#SubCategoriaSeleccionado").prop("disabled", false);
//            RellenaSubCategorias()

//            RellenaTabla();
//        } else if (idCategoria == 0 && idSubCategoria != 0 && Clasificacion != 0) { //SubCategoria y Clasificacion
//            ProdClientes = AprovisionamientoProductos.filter(a => a.Id_Subcategoria == idSubCategoria && a.Cat_Art_en_Bodega == Clasificacion && a.Indicador_ST > Indicador);
//            RellenaTabla();
//        }

//    } catch (e) {
//        Swal.fire({
//            icon: 'error',
//            title: 'Oops...',
//            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

//        })
//    }


//}
function onChangeFiltro() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();
        var idSubCategoria = $("#SubCategoriaSeleccionado").val();
        var Clasificacion = $("#ClasificacionSeleccionado").val();
        var Indicador = parseFloat($("#Indicador").val());

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
        if (Indicador != undefined && Indicador != 0.5) { // Si hay un valor para el indicador
            filters.push(a => a.Indicador_ST >= Indicador);
        }
        if (Indicador != undefined && Indicador == 0.5) { // Si hay un valor para el indicador
            filters.push(a => a.Indicador_ST <= Indicador);
        }
        if (bodegasSeleccionadas.length > 0) {
            filters.push(a => bodegasSeleccionadas.includes(a.Bodega)); // Filtra por bodegas seleccionadas
        }

        // Filtra los productos usando el array de filtros
        ProdClientes = AprovisionamientoProductos.filter(a => filters.every(filter => filter(a)));

        // Lógica para manejar habilitación de SubCategorías
        if (idCategoria != 0) {
            $("#SubCategoriaSeleccionado").prop("disabled", false);
            if (idSubCategoria == 0 && Clasificacion == 0) {
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

            html += "<td class='text-center'>  <input  type='checkbox' id='" + i + "_mdcheckbox' class='chk-col-green' onchange='javascript: onChangeRevisado(" + i + ")'>  <label for='" + i + "_mdcheckbox'></label> </td> ";
            html += "<td > " + ProdClientes[i].Codigo_Articulo + "-" + ProdClientes[i].Nombre_Articulo + " </td>";


            html += "<td > " + ProdClientes[i].Grupo_Articulo + " </td>";

            if (Categoria != undefined) {
                html += "<td > " + ProdClientes[i].Id_Categoria + "-" + Categoria.Nombre + " </td>";
            } else {
                html += "<td > " + "N/A" + " </td>";
            }
            if (SubCategoria != undefined) {
                html += "<td > " + ProdClientes[i].Id_Subcategoria + "-" + SubCategoria.Nombre + " </td>";
            } else {
                html += "<td > " + "N/A" + " </td>";
            }
            html += "<td > " + ProdClientes[i].Bodega + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Stock_en_Bodega).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Pedido).toFixed(2)) + " </td>";
            html += "<td > " + ProdClientes[i].Cod_Proveedor + "-" + ProdClientes[i].Proveedor + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Ultimo_Precio_Compra).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Costo_Promedio).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Promedio_Venta_Ult_3_Meses).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Desviacion_Estandar).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Inventario_Ideal).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Indicador_ST).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Pedido_Sugerido).toFixed(2)) + " </td>";
            html += "<td > " + ProdClientes[i].Cat_Art_en_Bodega + " </td>";
            html += "<td > " + ProdClientes[i].Cod_Relac + "-" + ProdClientes[i].Nombre_de_Articulo_Relac + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Stock_Relac).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Pedido_Relac).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Sugerido_Relac).toFixed(2)) + " </td>";








            html += "</td>";








            html += "</tr>";


        }

        $("#tbody").html(html);


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
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
