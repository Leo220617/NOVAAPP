$(document).ready(function () {
    jQuery(document).ready(function ($) {
        Recuperar();
    });



    $(document).ready(function () {

    });


});

var PrecioXLista = []; // variables globales
var ProdClientes = [];
var ProdCadena = [];
var ProdPrueba = [];
var ListaPrecios = [];
var Categorias = [];
var Duplicado = false;
var TipoCambio = [];
var Fechabool = false;
var Margenes = [];

function Recuperar() {
    try {

        Margenes = JSON.parse($("#Margenes").val());
        PrecioXLista = JSON.parse($("#PrecioXLista").val());
        ListaPrecios = JSON.parse($("#ListaPrecios").val());
        Productos = JSON.parse($("#Productos").val());
        Categorias = JSON.parse($("#Categorias").val());
        TipoCambio = JSON.parse($("#TipoCambio").val());

        RellenaListaPrecios()
        RellenaCategorias()

        RecuperarInformacion()
        Setear()
      




    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }

}
function RecuperarInformacion() {
    try {

        $("#ListaSeleccionado").val(Margenes.idListaPrecio);
        $("#CategoriaSeleccionado").val(Margenes.idCategoria);
        $("#MonedaSeleccionado").val(Margenes.Moneda);
        $("#Margen").val(Margenes.Margen);
        $("#MargenMin").val(Margenes.MargenMin);
        $("#Cobertura").val(Margenes.Cobertura);


        var FechaX = new Date(Margenes.FechaCreacion);

        var Fecha = $.datepicker.formatDate('yy-mm-dd', FechaX);



        $("#Fecha").val(Fecha);



        onChangeListaPrecio();


        for (var i = 0; i < Margenes.Detalle.length; i++) {



            var Producto =
            {


                ItemCode: Margenes.Detalle[i].ItemCode,
                idListaPrecio: Margenes.Detalle[i].idListaPrecio,
                idCategoria: Margenes.Detalle[i].idCategoria,
                Moneda: Margenes.Detalle[i].Moneda,
                PrecioSAP: parseFloat(Margenes.Detalle[i].PrecioSAP.toFixed(2)),
                Cobertura: parseFloat(Margenes.Detalle[i].Cobertura.toFixed(2)),
                Margen: parseFloat(Margenes.Detalle[i].Margen.toFixed(2)),
                MargenMin: parseFloat(Margenes.Detalle[i].MargenMin.toFixed(2)),
                PrecioFinal: parseFloat(Margenes.Detalle[i].PrecioFinal.toFixed(2)),
                PrecioMin: parseFloat(Margenes.Detalle[i].PrecioMin.toFixed(2)),
                PrecioCob: parseFloat(Margenes.Detalle[i].PrecioCob.toFixed(2))





            };
            ProdCadena.push(Producto);
            var PE = ProdClientes.find(a => a.Codigo == Producto.ItemCode && a.idCategoria == Producto.idCategoria && a.idListaPrecios == Producto.idListaPrecio && a.Moneda == Producto.Moneda);
            var x = ProdClientes.findIndex(a => a.Codigo == Producto.ItemCode && a.idCategoria == Producto.idCategoria && a.idListaPrecios == Producto.idListaPrecio && a.Moneda == Producto.Moneda);
            $("#" + x + "_PrecioFinal").text(formatoDecimal(parseFloat(Producto.PrecioFinal).toFixed(2)));
            $("#" + x + "_PrecioCob").text(formatoDecimal(parseFloat(Producto.PrecioCob).toFixed(2)));
            $("#" + x + "_PrecioMin").text(formatoDecimal(parseFloat(Producto.PrecioMin).toFixed(2)));
            $("#" + x + "_Cobertura").text(formatoDecimal(parseFloat(Producto.Cobertura).toFixed(2)));
            $("#" + x + "_Margen").text(formatoDecimal(parseFloat(Producto.Margen).toFixed(2)));
            $("#" + x + "_MargenMin").text(formatoDecimal(parseFloat(Producto.MargenMin).toFixed(2)));

            $("#" + x + "_PrecioFinalX").text(formatoDecimal(parseFloat(Producto.PrecioFinal).toFixed(2)));
            $("#" + x + "_PrecioCobX").text(formatoDecimal(parseFloat(Producto.PrecioCob).toFixed(2)));
            $("#" + x + "_PrecioMinX").text(formatoDecimal(parseFloat(Producto.PrecioMin).toFixed(2)));
            $("#" + x + "_CoberturaX").text(formatoDecimal(parseFloat(Producto.Cobertura).toFixed(2)));
            $("#" + x + "_MargenX").text(formatoDecimal(parseFloat(Producto.Margen).toFixed(2)));
            $("#" + x + "_MargenMinX").text(formatoDecimal(parseFloat(Producto.MargenMin).toFixed(2)));



            var Ganancia = 0;
            var input = $("#" + x + "_Ganancia");
            var inputX = $("#" + x + "_GananciaX");
            var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
            var Moneda = $("#MonedaSeleccionado").val();

            if (Moneda == "CRC") {
                Ganancia = retornaMargenGanancia(Producto.PrecioFinal, PE.Costo);
                $("#" + x + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                $("#" + x + "_GananciaX").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
            } else {
                var Costo = PE.Costo / TipodeCambio.TipoCambio;
                Ganancia = retornaMargenGanancia(Producto.PrecioFinal, Costo);
                $("#" + x + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                $("#" + x + "_GananciaX").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
            }


            if (Ganancia > 0) {
                input.css('background-color', '#EFFFE9')
                inputX.css('background-color', '#EFFFE9')
            } else {
                input.css('background-color', '#FFE9E9')
                inputX.css('background-color', '#FFE9E9')
            }
        }






    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

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


function RellenaListaPrecios() {
    try {
        var html = "";
        $("#ListaSeleccionado").html(html);
        html += "<option value='0' > Seleccione Lista de Precio </option>";

        for (var i = 0; i < ListaPrecios.length; i++) {
            html += "<option value='" + ListaPrecios[i].id + "' > " + ListaPrecios[i].CodSAP + " - " + ListaPrecios[i].Nombre + " </option>";
        }



        $("#ListaSeleccionado").html(html);
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

        var idListaPrecio = $("#ListaSeleccionado").val();

        var Categoria = Categorias.find(a => a.id == idCategoria);
        var Moneda = $("#MonedaSeleccionado").val();


        if (idCategoria != 0 && idListaPrecio != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idListaPrecios == idListaPrecio && a.Moneda == Moneda);
            RellenaProductos();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idListaPrecios == 0 && a.Moneda == Moneda);
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

function onChangeListaPrecio() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idListaPrecio = $("#ListaSeleccionado").val();

        var Moneda = $("#MonedaSeleccionado").val();

        var Lista = ListaPrecios.find(a => a.id == idListaPrecio);


        if (idCategoria != 0 && idListaPrecio != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idListaPrecios == idListaPrecio && a.Moneda == Moneda);

            RellenaProductos();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idListaPrecios == 0 && a.Moneda == Moneda);
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

function onChangeMoneda() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idListaPrecio = $("#ListaSeleccionado").val();

        var Moneda = $("#MonedaSeleccionado").val();

        var Lista = ListaPrecios.find(a => a.id == idListaPrecio);


        if (idCategoria != 0 && idListaPrecio != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idListaPrecios == idListaPrecio && a.Moneda == Moneda);

            RellenaProductos();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idListaPrecios == 0 && a.Moneda == Moneda);
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
function retornaMargenGanancia(PrecioVenta, Costo) {
    try {

        return ((PrecioVenta - Costo) / (PrecioVenta)) * 100;

    } catch (e) {
        return 0;
    }
}



function RellenaProductos() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idListaPrecio = $("#ListaSeleccionado").val();

        var Moneda = $("#MonedaSeleccionado").val();



        if (idCategoria != 0 && idListaPrecio != 0) {
            RellenaTabla();
            RellenaTablaX();
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
        $("#tbody").html(html);


        for (var i = 0; i < ProdClientes.length; i++) {
            html += "<tr>";


            html += "<td > " + ProdClientes[i].Codigo + "-" + ProdClientes[i].Nombre + " </td>";


            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2)) + " </td>";
            html += "<td > " + ProdClientes[i].Moneda + " </td>";
            html += "<td class='text-center' id='" + i + "_Cobertura'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_PrecioCob'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_MargenMin'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_PrecioMin'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_Margen'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_PrecioFinal'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_Ganancia'> 0 </td>";





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

function RellenaTablaX() {
    try {
        var html = "";
        $("#tbody2").html(html);


        for (var i = 0; i < ProdClientes.length; i++) {
            html += "<tr>";


            html += "<td > " + ProdClientes[i].Codigo + "-" + ProdClientes[i].Nombre + " </td>";


            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2)) + " </td>";
            html += "<td > " + ProdClientes[i].Moneda + " </td>";
            html += "<td class='text-center' id='" + i + "_CoberturaX'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_PrecioCobX'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_MargenMinX'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_PrecioMinX'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_MargenX'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_PrecioFinalX'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_GananciaX'> 0 </td>";





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
function Setear() {
    try {
        var Cobertura = $("#Cobertura").val();
        var Margen = $("#Margen").val();
        var MargenMin = $("#MargenMin").val();
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idListaPrecio = $("#ListaSeleccionado").val();

        var Moneda = $("#MonedaSeleccionado").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");


        for (var i = 0; i < ProdClientes.length; i++) {
            var Existe = undefined;
            var input = $("#" + i + "_Ganancia");
            var inputX = $("#" + i + "_GananciaX");
            var PE = ProdClientes[i];
            Existe = ProdCadena.find(a => a.ItemCode == PE.Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            if (Existe == undefined) {
                $("#" + i + "_Cobertura").text(formatoDecimal(parseFloat(Cobertura).toFixed(2)));
                $("#" + i + "_Margen").text(formatoDecimal(parseFloat(Margen).toFixed(2)));
                $("#" + i + "_MargenMin").text(formatoDecimal(parseFloat(MargenMin).toFixed(2)));

                $("#" + i + "_CoberturaX").text(formatoDecimal(parseFloat(Cobertura).toFixed(2)));
                $("#" + i + "_MargenX").text(formatoDecimal(parseFloat(Margen).toFixed(2)));
                $("#" + i + "_MargenMinX").text(formatoDecimal(parseFloat(MargenMin).toFixed(2)));
                var PrecioFinal = PE.PrecioUnitario * Margen;
                var PrecioMin = PE.PrecioUnitario * MargenMin;
                var PrecioCob = PE.PrecioUnitario * Cobertura;
                var Ganancia = 0;
                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(PrecioFinal).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(PrecioMin).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(PrecioCob).toFixed(2)));

                $("#" + i + "_PrecioFinalX").text(formatoDecimal(parseFloat(PrecioFinal).toFixed(2)));
                $("#" + i + "_PrecioMinX").text(formatoDecimal(parseFloat(PrecioMin).toFixed(2)));
                $("#" + i + "_PrecioCobX").text(formatoDecimal(parseFloat(PrecioCob).toFixed(2)));

                if (Moneda == "CRC") {
                    Ganancia = retornaMargenGanancia(PrecioFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                    $("#" + i + "_GananciaX").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(PrecioFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                    $("#" + i + "_GananciaX").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }


                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                    inputX.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                    inputX.css('background-color', '#FFE9E9')
                }
            }
        }
        $("#ListaSeleccionado").prop("disabled", true);
        $("#CategoriaSeleccionado").prop("disabled", true);
        $("#MonedaSeleccionado").prop("disabled", true);



    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar   ' + e

        })
    }
}


function ImprimirPantalla() {
    try {
        // window.print();
        var margins = {
            top: 10,
            bottom: 10,
            left: 10,
            width: 595
        };


        html = $(".html").html();
        html2pdf(html, {
            margin: 1,
            padding: 0,
            filename: 'Margenes.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, logging: true },
            jsPDF: { unit: 'in', format: 'A2', orientation: 'P' },
            class: ImprimirPantalla
        });

    } catch (e) {
        console.log(e);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}









