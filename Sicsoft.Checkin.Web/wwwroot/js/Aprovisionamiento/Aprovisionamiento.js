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
var Productos = [];
var Impuestos = [];
var Minimos = [];
var Inicio = false;
var CategoriaActual = 0;

function ValidarMinimos() {
    try {
        if (Minimos.length > 0) {
            // Si no existe aún el botón, lo agregamos
            if (!document.getElementById("btnCerrarToasts")) {
                $("body").prepend(`
                    <button id="btnCerrarToasts" 
                        style="margin: 10px; padding: 10px 15px; background-color: red; color: white; 
                        border: none; border-radius: 5px; cursor: pointer; font-size: 14px; z-index: 9999;">
                        Cerrar todas las notificaciones
                    </button>
                `);

                // Evento para cerrar todos los toasts y ocultar el botón
                $("#btnCerrarToasts").on("click", function () {
                    $.toast().reset('all');
                    $("#btnCerrarToasts").remove();
                });
            }
        }

        for (var i = 0; i < Minimos.length; i++) {
            $.toast({
                heading: 'Precaución',
                text: 'El producto ' + Minimos[i].CodigoProducto + ' - ' + Minimos[i].NombreProducto +
                    ' NO alcanza el mínimo de ' + Minimos[i].Minimo + ' unidades en stock, el stock real es de ' +
                    Minimos[i].StockReal + ' en la Bodega ' + Minimos[i].Bodega,
                position: 'top-right',
                loaderBg: '#ff6849',
                icon: 'warning',
                hideAfter: 100000000000,
                stack: 100000,
                beforeShow: function () {
                    $(".jq-toast-single").css({
                        "font-size": "18px"
                    });
                    $(".jq-toast-heading").css({
                        "font-size": "20px",
                        "font-weight": "bold"
                    });
                },
                afterHidden: function () {
                    // Si ya no hay toasts visibles, quitamos el botón
                    if ($(".jq-toast-single:visible").length === 0) {
                        $("#btnCerrarToasts").remove();
                    }
                }
            });
        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar información ' + e
        });
    }
}
function Recuperar() {
    try {


        Bodegas = JSON.parse($("#Bodegas").val());
        Categorias = JSON.parse($("#Categorias").val());
        SubCategorias = JSON.parse($("#SubCategorias").val());
        AprovisionamientoProductos = JSON.parse($("#AprovisionamientoProductos").val());
        Proveedores = JSON.parse($("#Proveedores").val());
        Impuestos = JSON.parse($("#Impuestos").val());
        Impuestos = JSON.parse($("#Impuestos").val());
        Minimos = JSON.parse($("#Minimos").val());

        RellenaCategorias()
        ValidarMinimos()




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
            html += "<option value='" + Categorias[i].CodSAP + "' > " + Categorias[i].CodSAP + " - " + Categorias[i].Nombre + " </option>";
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


function generarCheckboxSubcategorias(idCategoriaInterno) {
    try {

        CategoriaActual = idCategoriaInterno;
        var html = "";
        $("#contenedorSubcategorias").html(html); // limpia

        // Filtra subcategorías por id interno de categoría
        var subcats = SubCategorias.filter(function (sc) {
            return String(sc.idCategoria) === String(idCategoriaInterno);
        });

        if (subcats.length === 0) {
            html += "<div class='col-12'>No hay subcategorías para esta categoría.</div>";
            $("#contenedorSubcategorias").html(html);
            return;
        }

        // Construye cada checkbox con un for (igual estilo a RellenaCategorias)
        for (var i = 0; i < subcats.length; i++) {
            var sc = subcats[i];
            var id = "md_checkbox_subcat_" + sc.id;
            var nombre = (sc.Nombre || sc.nombre || "");
            html +=
                "<div class='col-12' style=' padding-top: 2%;'>" +
                "<input type='checkbox' " +
                "id='" + id + "' " +
                "name='subcat[]' " +
                "value='" + sc.id + "' " +
                "class='chk-col-red' " +
                "onclick='javascript: onChangeFiltro()' />" +
                "<label for='" + id + "'> " + sc.id + ' - ' + nombre + " </label>" +
                "</div>";
        }

        // Inyecta todo de una vez
        $("#contenedorSubcategorias").html(html);


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error generando subcategorías: ' + e
        });
    }
}



function onChangeFiltro() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();
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

            
            if (idCategoria != CategoriaActual) {

                generarCheckboxSubcategorias(idCategoria);
            }                // <<-- Generar checkboxes dinámicamente
        }

        const subcatsSeleccionadas = $('#contenedorSubcategorias input[name="subcat[]"]:checked')
            .map(function () { return $(this).val(); })
            .get();

        if (subcatsSeleccionadas.length > 0) {
            // Compara por string para evitar problemas de tipos (número vs string)
            filters.push(a => subcatsSeleccionadas.includes(String(a.Id_Subcategoria)));
        }
        //if (idSubCategoria != 0) {
        //    filters.push(a => a.Id_Subcategoria == idSubCategoria);
        //}
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
          /*  $("#SubCategoriaSeleccionado").prop("disabled", false);*/
           
            
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

        ProdClientes.sort((a, b) => a.Nombre_Articulo.toLowerCase().localeCompare(b.Nombre_Articulo.toLowerCase()));
        $("#tbody").html("");

        for (var i = 0; i < ProdClientes.length; i++) {
            const producto = ProdClientes[i];

            // Buscar si ya fue guardado
            const guardado = ProdCadena.find(p =>
                String(p.CodigoProducto).trim() === String(producto.Codigo_Articulo).trim() &&
                String(p.Bodega).trim() === String(producto.Bodega).trim()
            );

            const compra = guardado ? guardado.Compra : 0;
            const precioCompra = guardado ? guardado.PrecioCompra : 0;
            const impuestoSel = guardado ? guardado.Impuesto : "IV";
            const totalImpuesto = guardado ? guardado.TotalImpuesto : 0;
            const totalCompra = guardado ? guardado.TotalCompra : 0;
            const proveedorSel = guardado ? guardado.CodProveedor : producto.Cod_Proveedor;
            const checked = guardado ? "checked" : "";
            const disabled = guardado ? "" : "disabled";

            html += `<tr>
                <td>${producto.Codigo_Articulo} - ${producto.Nombre_Articulo}</td>
                <td>${producto.Bodega}</td>
                <td class='text-right'>${formatoDecimal(producto.Stock_en_Bodega.toFixed(2))}</td>
                <td class='text-right'>${formatoDecimal(producto.Pedido.toFixed(2))}</td>
                <td class='text-right'>${formatoDecimal(producto.Ultimo_Precio_Compra.toFixed(2))}</td>
                <td class='text-right'>${formatoDecimal(producto.Costo_Promedio.toFixed(2))}</td>
                <td class='text-right'>${formatoDecimal(producto.Promedio_Venta_Ult_3_Meses.toFixed(2))}</td>
                <td class='text-right'>${formatoDecimal(producto.Inventario_Ideal.toFixed(2))}</td>
                <td class='text-right'>${formatoDecimal(producto.Indicador_ST.toFixed(2))}</td>`;

            const sugeridoColor = producto.Pedido_Sugerido < 0 ? '#FFE9E9' : '#EFFFE9';
            html += `<td class='text-right' style='background-color:${sugeridoColor};'>${formatoDecimal(producto.Pedido_Sugerido.toFixed(2))}</td>`;

            // Compra
            html += `<td class='text-center'>
                        <input ${disabled} onchange='onChangeCompra(${i})' type='number' 
                               id='${i}_Compra' class='form-control' style='width: 80px; height: 40px;' 
                               value='${compra}' min='1'/>
                     </td>`;

            // Precio compra
            html += `<td class='text-center'>
                        <input ${disabled} onchange='onChangeCompra(${i})' type='number' 
                               id='${i}_PrecioCompra' class='form-control' style='width: 150px; height: 40px;' 
                               value='${precioCompra}' min='1'/>
                     </td>`;

            // Impuesto
            html += `<td>
                        <select onchange='onChangeCompra(${i})' id='${i}_Impuesto' ${disabled}>`;
            Impuestos.forEach(impuesto => {
                if ((["EX", "IV", "IVA-1"].includes(impuesto.Codigo)) && impuesto.Activo) {
                    const selected = impuesto.Codigo === impuestoSel ? "selected" : "";
                    html += `<option value="${impuesto.Codigo}" ${selected}>${impuesto.Tarifa}</option>`;
                }
            });
            html += `</select></td>`;

            // Total impuesto y compra
            html += `<td class='text-right' id='${i}_TotalImpuesto'>${totalImpuesto}</td>`;
            html += `<td class='text-right' id='${i}_TotalCompra'>${totalCompra}</td>`;

            // Checkbox
            html += `<td class='text-center'>
                        <input type='checkbox' id='${i}_mdcheckbox' class='chk-col-green' 
                               onchange='onChangeCompra(${i})' ${checked}>
                        <label for='${i}_mdcheckbox'></label>
                     </td>`;

            // Stock y promedio total
            html += `<td class='text-right' style='background-color:#fff4e9;'>${formatoDecimal(producto.Stock_Todas.toFixed(2))}</td>`;
            html += `<td class='text-right' style='background-color:#fff4e9;'>${formatoDecimal(producto.Promedio_Venta_Todas_3Meses.toFixed(2))}</td>`;
            html += `<td class='text-right' style='background-color:#fff4e9;'>${formatoDecimal(producto.Indicador_ST_Todas.toFixed(2))}</td>`;

            // Proveedor
            html += `<td>
                        <select onchange='onChangeCompra(${i})' id='${i}_Proveedor' class='proveedor' ${disabled}>`;
            Proveedores.forEach(p => {
                const selected = proveedorSel === p.CardCode ? "selected" : "";
                html += `<option value="${p.CardCode}" ${selected}>${p.CardCode} - ${p.Nombre}</option>`;
            });
            html += `</select></td>`;

            html += `</tr>`;
        }

        $("#tbody").html(html);
        $(document).ready(() => {
            $('select.proveedor').select2();
        });

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e
        });
    }
}


function onChangeCompra(i) {
    try {


        var idCategoria = $("#CategoriaSeleccionado").val();




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
           /* $("#SubCategoriaSeleccionado").prop('disabled', true);*/
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
        var subcatsSeleccionadas = "";
        var checks = document.querySelectorAll('#contenedorSubcategorias input[name="subcat[]"]:checked');
        for (var i = 0; i < checks.length; i++) {
            subcatsSeleccionadas += checks[i].value + ";";
        }

        var subcatsString = $('#contenedorSubcategorias input[name="subcat[]"]:checked')
            .map(function () { return $(this).val(); })
            .get()
            .filter(function (v) { return v != null && String(v).trim() !== ""; })
            .join(";");
        var EncAprovisionamiento = {

            id: 0,
            idCategoria: $("#CategoriaSeleccionado").val(),
            idSubCategoria: 0,
            SubCategorias: subcatsString,
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
        var subcatsSeleccionadas = "";
        var checks = document.querySelectorAll('#contenedorSubcategorias input[name="subcat[]"]:checked');
        for (var i = 0; i < checks.length; i++) {
            subcatsSeleccionadas += checks[i].value + ";";
        }

        var subcatsString = $('#contenedorSubcategorias input[name="subcat[]"]:checked')
            .map(function () { return $(this).val(); })
            .get()
            .filter(function (v) { return v != null && String(v).trim() !== ""; })
            .join(";");
        var EncAprovisionamiento = {

            id: 0,
            idCategoria: $("#CategoriaSeleccionado").val(),
            idSubCategoria: 0,
            SubCategorias: subcatsString,
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

        var subcatsSeleccionadas = document.querySelectorAll('#contenedorSubcategorias input[name="subcat[]"]:checked');
        if (subcatsSeleccionadas.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debe seleccionar al menos una SubCategoría'
            });
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
