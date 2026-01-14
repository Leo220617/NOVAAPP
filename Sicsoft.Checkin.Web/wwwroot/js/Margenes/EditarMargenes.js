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
                PrecioCob: parseFloat(Margenes.Detalle[i].PrecioCob.toFixed(2)),
                Seteable: Margenes.Detalle[i].Seteable,
                PrecioFijo: Margenes.Detalle[i].PrecioFijo,
                Escalonado: Margenes.Detalle[i].Escalonado,

                CantMin1: Margenes.Detalle[i].CantMin1 || 0,
                CantMax1: Margenes.Detalle[i].CantMax1 || 0,
                Margen1: parseFloat(Margenes.Detalle[i].Margen1.toFixed(2)) || 0,

                CantMin2: Margenes.Detalle[i].CantMin2 || 0,
                CantMax2: Margenes.Detalle[i].CantMax2 || 0,
                Margen2: parseFloat(Margenes.Detalle[i].Margen2.toFixed(2)) || 0,

                CantMin3: Margenes.Detalle[i].CantMin3 || 0,
                CantMax3: Margenes.Detalle[i].CantMax3 || 0,
                Margen3: parseFloat(Margenes.Detalle[i].Margen3.toFixed(2)) || 0,

                PrecioEscalonado1: parseFloat(Margenes.Detalle[i].PrecioEscalonado1.toFixed(2)),
                PrecioEscalonado2: parseFloat(Margenes.Detalle[i].PrecioEscalonado2.toFixed(2)),
                PrecioEscalonado3: parseFloat(Margenes.Detalle[i].PrecioEscalonado3.toFixed(2))





            };
            ProdCadena.push(Producto);


            var PE = ProdClientes.find(a => a.Codigo == Producto.ItemCode && a.idCategoria == Producto.idCategoria && a.idListaPrecios == Producto.idListaPrecio && a.Moneda == Producto.Moneda);
            if (PE != undefined) {


                var x = ProdClientes.findIndex(a => a.Codigo == Producto.ItemCode && a.idCategoria == Producto.idCategoria && a.idListaPrecios == Producto.idListaPrecio && a.Moneda == Producto.Moneda);
                CambiarCheck(i, true);
                $("#" + x + "_PrecioFinal").text(formatoDecimal(parseFloat(Producto.PrecioFinal)));
                $("#" + x + "_PrecioCob").text(formatoDecimal(parseFloat(Producto.PrecioCob).toFixed(2)));
                $("#" + x + "_PrecioMin").text(formatoDecimal(parseFloat(Producto.PrecioMin).toFixed(2)));
                $("#" + x + "_Cobertura").val(Producto.Cobertura);
                $("#" + x + "_Margen").val(Producto.Margen);
                $("#" + x + "_MargenMin").val(Producto.MargenMin);

                $("#" + x + "_CantMin1").val(Producto.CantMin1);
                $("#" + x + "_CantMax1").val(Producto.CantMax1);
                $("#" + x + "_Margen1").val(Producto.Margen1);

                $("#" + x + "_CantMin2").val(Producto.CantMin2);
                $("#" + x + "_CantMax2").val(Producto.CantMax2);
                $("#" + x + "_Margen2").val(Producto.Margen2);

                $("#" + x + "_CantMin3").val(Producto.CantMin3);
                $("#" + x + "_CantMax3").val(Producto.CantMax3);
                $("#" + x + "_Margen3").val(Producto.Margen3);

                onChangeCheckboxEscalonado(x);

                calcularPrecioEscalonado(x, Producto.Margen1, x + "_InputEscalonado1");
                calcularPrecioEscalonado(x, Producto.Margen2, x + "_InputEscalonado2");
                calcularPrecioEscalonado(x, Producto.Margen3, x + "_InputEscalonado3");
                var valorCheck2 = $("#" + x + "_mdcheckbox2").prop('checked');

                if (valorCheck2) {

                    $("#" + x + "_Margen").prop("disabled", true);
                    $("#" + x + "_Margen1").prop("disabled", true);
                    $("#" + x + "_Margen2").prop("disabled", true);
                    $("#" + x + "_Margen3").prop("disabled", true);

                } else {
                    $("#" + x + "_Margen").prop("disabled", false);
                    $("#" + x + "_Margen1").prop("disabled", false);
                    $("#" + x + "_Margen2").prop("disabled", false);
                    $("#" + x + "_Margen3").prop("disabled", false);
                }


                var PrecioImp = Producto.PrecioFinal * 1.13;



                $("#" + x + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                var Ganancia = 0;
                var input = $("#" + x + "_Ganancia");
                var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
                var Moneda = $("#MonedaSeleccionado").val();

                if (Producto.PrecioFijo) {

                    $("#" + x + "_PrecioImp").attr("hidden", true);
                    $("#" + x + "_PrecioFijo").removeAttr("hidden");
                    var texto = $("#" + x + "_PrecioImp").text();
                    var limpio = texto.replace(/,/g, '');
                    var valor = parseFloat(limpio);
                    $("#" + x + "_InputPrecioFijo").val(valor);

                }
                if (Moneda == "CRC") {
                    Ganancia = retornaMargenGanancia(Producto.PrecioFinal, PE.Costo);
                    $("#" + x + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(Producto.PrecioFinal, Costo);
                    $("#" + x + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }


                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
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

function CambiarCheck(i, inicio) {
    try {
        var x = ProdClientes.findIndex(a => a.Codigo == ProdCadena[i].ItemCode && a.idCategoria == ProdCadena[i].idCategoria && a.idListaPrecios == ProdCadena[i].idListaPrecio && a.Moneda == ProdCadena[i].Moneda);
        if (inicio) {
            $("#" + x + "_mdcheckbox").prop('checked')
            $("#" + x + "_mdcheckbox").prop('checked', Margenes.Detalle[i].Seteable);

            $("#" + x + "_mdcheckbox2").prop('checked')
            $("#" + x + "_mdcheckbox2").prop('checked', Margenes.Detalle[i].PrecioFijo);


            $("#" + x + "_mdcheckbox3").prop('checked')
            $("#" + x + "_mdcheckbox3").prop('checked', Margenes.Detalle[i].Escalonado);

        } else {
            var valorCheck = $("#" + x + "_mdcheckbox").prop('checked');
            Margenes.Detalle[i].Seteable = valorCheck;

            var valorCheck2 = $("#" + x + "_mdcheckbox2").prop('checked');
            Margenes.Detalle[i].PrecioFijo = valorCheck2;

            var valorCheck3 = $("#" + x + "_mdcheckbox3").prop('checked');
            Margenes.Detalle[i].Escalonado = valorCheck3;

        }



    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
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
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idListaPrecios == idListaPrecio && a.Moneda == Moneda && a.Activo == true);
            RellenaProductos();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idListaPrecios == 0 && a.Moneda == Moneda && a.Activo == true);
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
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idListaPrecios == idListaPrecio && a.Moneda == Moneda && a.Activo == true);

            RellenaProductos();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idListaPrecios == 0 && a.Moneda == Moneda && a.Activo == true);
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
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idListaPrecios == idListaPrecio && a.Moneda == Moneda && a.Activo == true);

            RellenaProductos();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idListaPrecios == 0 && a.Moneda == Moneda && a.Activo == true);
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

function onChangeCobertura(i) {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idListaPrecio = $("#ListaSeleccionado").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        var Moneda = $("#MonedaSeleccionado").val();
        var Cobertura = $("#Cobertura").val();
        var Margen = $("#Margen").val();
        var MargenMin = $("#MargenMin").val();

        var CoberturaL = $("#" + i + "_Cobertura").val();
        var MargenL = $("#" + i + "_Margen").val();
        var MargenMinL = $("#" + i + "_MargenMin").val();

        var CantMin1 = parseFloat($("#" + i + "_CantMin1").val()) || 0;
        var CantMax1 = parseFloat($("#" + i + "_CantMax1").val()) || 0;
        var Margen1 = parseFloat($("#" + i + "_Margen1").val()) || 0;

        var CantMin2 = parseFloat($("#" + i + "_CantMin2").val()) || 0;
        var CantMax2 = parseFloat($("#" + i + "_CantMax2").val()) || 0;
        var Margen2 = parseFloat($("#" + i + "_Margen2").val()) || 0;

        var CantMin3 = parseFloat($("#" + i + "_CantMin3").val()) || 0;
        var CantMax3 = parseFloat($("#" + i + "_CantMax3").val()) || 0;
        var Margen3 = parseFloat($("#" + i + "_Margen3").val()) || 0;

        var Existe = ProdCadena.find(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);

        var x = ProdCadena.findIndex(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);

        var PE = ProdClientes[i];
        var Ganancia = 0;
        var input = $("#" + i + "_Ganancia");

        if (Existe == undefined) {
            if (CoberturaL != Cobertura || MargenL != Margen || MargenMinL != MargenMin) {






                var Producto =
                {




                    ItemCode: PE.Codigo,
                    idListaPrecio: parseFloat($("#ListaSeleccionado").val()),
                    idCategoria: PE.idCategoria,
                    Moneda: PE.Moneda,
                    PrecioSAP: PE.PrecioUnitario,
                    Cobertura: parseFloat($("#" + i + "_Cobertura").val()),
                    Margen: parseFloat($("#" + i + "_Margen").val()),
                    MargenMin: parseFloat($("#" + i + "_MargenMin").val()),
                    PrecioFinal: 0,
                    PrecioCob: 0,
                    PrecioMin: 0,
                    Seteable: $("#" + i + "_mdcheckbox").prop('checked'),
                    PrecioFijo: $("#" + i + "_mdcheckbox2").prop('checked'),
                    Escalonado: $("#" + i + "_mdcheckbox3").prop('checked'),
                    CantMin1: CantMin1,
                    CantMax1: CantMax1,
                    Margen1: Margen1,

                    CantMin2: CantMin2,
                    CantMax2: CantMax2,
                    Margen2: Margen2,

                    CantMin3: CantMin3,
                    CantMax3: CantMax3,
                    Margen3: Margen3,

                    PrecioEscalonado1: 0,
                    PrecioEscalonado2: 0,
                    PrecioEscalonado3: 0


                };
                Producto.PrecioCob = PE.Costo / (1 - (Producto.Cobertura / 100));
                Producto.PrecioFinal = Producto.PrecioCob / (1 - (Producto.Margen / 100));
                Producto.PrecioMin = Producto.PrecioCob / (1 - (Producto.MargenMin / 100));
                var PrecioImp = Producto.PrecioFinal * 1.13;


                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(Producto.PrecioFinal)));
                $("#" + i + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(Producto.PrecioCob).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(Producto.PrecioMin).toFixed(2)));
                if (Moneda == "CRC") {
                    Ganancia = retornaMargenGanancia(Producto.PrecioFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(Producto.PrecioFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }

                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
                ProdCadena.push(Producto);
            } else {
                ProdCadena.splice(i, 1);
            }
        } else {
            if (CoberturaL != Cobertura || MargenL != Margen || MargenMinL != MargenMin) {



                ProdCadena[x].Margen = parseFloat($("#" + i + "_Margen").val());
                ProdCadena[x].Cobertura = parseFloat($("#" + i + "_Cobertura").val());
                ProdCadena[x].MargenMin = parseFloat($("#" + i + "_MargenMin").val());
                ProdCadena[x].PrecioCob = PE.Costo / (1 - (ProdCadena[x].Cobertura / 100));
                ProdCadena[x].PrecioFinal = ProdCadena[x].PrecioCob / (1 - (ProdCadena[x].Margen / 100));
                ProdCadena[x].PrecioMin = ProdCadena[x].PrecioCob / (1 - (ProdCadena[x].MargenMin / 100));

                // 🔥 ACTUALIZA ESCALONADO
                ProdCadena[x].CantMin1 = CantMin1;
                ProdCadena[x].CantMax1 = CantMax1;
                ProdCadena[x].Margen1 = Margen1;

                ProdCadena[x].CantMin2 = CantMin2;
                ProdCadena[x].CantMax2 = CantMax2;
                ProdCadena[x].Margen2 = Margen2;

                ProdCadena[x].CantMin3 = CantMin3;
                ProdCadena[x].CantMax3 = CantMax3;
                ProdCadena[x].Margen3 = Margen3;

                var PrecioImp = ProdCadena[x].PrecioFinal * 1.13;


                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioFinal)));
                $("#" + i + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioCob).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioMin).toFixed(2)));

                if (Moneda == "CRC") {
                    Ganancia = retornaMargenGanancia(ProdCadena[x].PrecioFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(ProdCadena[x].PrecioFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }


                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }


            } else {
                if (Moneda == "CRC") {
                    var Margen = parseFloat($("#" + i + "_Margen").val());
                    var PrecFinal = PE.PrecioUnitario * Margen;
                    Ganancia = retornaMargenGanancia(PrecFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(PrecFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }


                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
                ProdCadena.splice(x, 1);
            }

        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }
}
function onChangeValEscalonado(i) {
    try {

        var idCategoria = $("#CategoriaSeleccionado").val();
        var idListaPrecio = $("#ListaSeleccionado").val();
        var Moneda = $("#MonedaSeleccionado").val();

        var PE = ProdClientes[i];

        // ================= LEER ESCALONADO =================
        var CantMin1 = parseFloat($("#" + i + "_CantMin1").val()) || 0;
        var CantMax1 = parseFloat($("#" + i + "_CantMax1").val()) || 0;
        var Margen1 = parseFloat($("#" + i + "_Margen1").val()) || 0;

        var CantMin2 = parseFloat($("#" + i + "_CantMin2").val()) || 0;
        var CantMax2 = parseFloat($("#" + i + "_CantMax2").val()) || 0;
        var Margen2 = parseFloat($("#" + i + "_Margen2").val()) || 0;

        var CantMin3 = parseFloat($("#" + i + "_CantMin3").val()) || 0;
        var CantMax3 = parseFloat($("#" + i + "_CantMax3").val()) || 0;
        var Margen3 = parseFloat($("#" + i + "_Margen3").val()) || 0;

        // ================= AUTO-RANGOS =================
        if (CantMax1 > 0) {
            CantMin2 = CantMax1 + 1;
            $("#" + i + "_CantMin2").val(CantMin2);
        }

        if (CantMax2 > 0) {
            CantMin3 = CantMax2 + 1;
            $("#" + i + "_CantMin3").val(CantMin3);
        }

        // ================= BUSCAR / CREAR =================
        var producto = ProdCadena.find(p =>
            p.ItemCode == PE.Codigo &&
            p.idCategoria == idCategoria &&
            p.idListaPrecio == idListaPrecio &&
            p.Moneda == Moneda
        );

        if (!producto) {
            producto = {
                ItemCode: PE.Codigo,
                idListaPrecio: parseFloat(idListaPrecio),
                idCategoria: PE.idCategoria,
                Moneda: PE.Moneda,
                PrecioSAP: PE.PrecioUnitario,

                Cobertura: parseFloat($("#" + i + "_Cobertura").val()) || 0,
                Margen: parseFloat($("#" + i + "_Margen").val()) || 0,
                MargenMin: parseFloat($("#" + i + "_MargenMin").val()) || 0,

                PrecioFinal: 0,
                PrecioCob: 0,
                PrecioMin: 0,

                Seteable: $("#" + i + "_mdcheckbox").prop('checked'),
                PrecioFijo: $("#" + i + "_mdcheckbox2").prop('checked'),
                Escalonado: $("#" + i + "_mdcheckbox3").prop('checked'),

                CantMin1: CantMin1,
                CantMax1: CantMax1,
                Margen1: Margen1,

                CantMin2: CantMin2,
                CantMax2: CantMax2,
                Margen2: Margen2,

                CantMin3: CantMin3,
                CantMax3: CantMax3,
                Margen3: Margen3,

                PrecioEscalonado1: 0,
                PrecioEscalonado2: 0,
                PrecioEscalonado3: 0

            };

            producto.PrecioCob = PE.Costo / (1 - (producto.Cobertura / 100));
            producto.PrecioFinal = producto.PrecioCob / (1 - (producto.Margen / 100));
            producto.PrecioMin = producto.PrecioCob / (1 - (producto.MargenMin / 100));

            ProdCadena.push(producto);

        } else {

            producto.Cobertura = parseFloat($("#" + i + "_Cobertura").val()) || producto.Cobertura;
            producto.Margen = parseFloat($("#" + i + "_Margen").val()) || producto.Margen;
            producto.MargenMin = parseFloat($("#" + i + "_MargenMin").val()) || producto.MargenMin;

            producto.Seteable = $("#" + i + "_mdcheckbox").prop('checked');
            producto.PrecioFijo = $("#" + i + "_mdcheckbox2").prop('checked');
            producto.Escalonado = $("#" + i + "_mdcheckbox3").prop('checked');

            producto.CantMin1 = CantMin1;
            producto.CantMax1 = CantMax1;
            producto.Margen1 = Margen1;

            producto.CantMin2 = CantMin2;
            producto.CantMax2 = CantMax2;
            producto.Margen2 = Margen2;

            producto.CantMin3 = CantMin3;
            producto.CantMax3 = CantMax3;
            producto.Margen3 = Margen3;
        }
        calcularPrecioEscalonado(i, Margen1, i + "_InputEscalonado1");
        calcularPrecioEscalonado(i, Margen2, i + "_InputEscalonado2");
        calcularPrecioEscalonado(i, Margen3, i + "_InputEscalonado3");

        console.log("Escalonado actualizado con rangos automáticos:", producto);

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: e.toString()
        });
    }
}


function RellenaProductos() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idListaPrecio = $("#ListaSeleccionado").val();

        var Moneda = $("#MonedaSeleccionado").val();



        if (idCategoria != 0 && idListaPrecio != 0) {
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
        $("#tbody").html(html);


        for (var i = 0; i < ProdClientes.length; i++) {
            html += "<tr>";

            html += "<td class='text-center'> <input type='checkbox' id='" + i + "_mdcheckbox' class='chk-col-green' onchange='javascript: onChangeRevisado(" + i + ")'>  <label for='" + i + "_mdcheckbox'></label> </td> ";
            html += "<td class='text-center'> <input type='checkbox' id='" + i + "_mdcheckbox2' class='chk-col-green' onchange='javascript: onChangeCheckboxPrecio(" + i + ")'>  <label for='" + i + "_mdcheckbox2'></label> </td> ";
            html += "<td class='text-center'> <input type='checkbox' id='" + i + "_mdcheckbox3' class='chk-col-green' onchange='javascript: onChangeCheckboxEscalonado(" + i + ")'>  <label for='" + i + "_mdcheckbox3'></label> </td> ";
            html += "<td > " + ProdClientes[i].Codigo + "-" + ProdClientes[i].Nombre + " </td>";


            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2)) + " </td>";

            html += "<td class='text-center'> <input onchange='javascript: onChangeCobertura(" + i + ")' type='number' id='" + i + "_Cobertura' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center' id='" + i + "_PrecioCob'> 0 </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeCobertura(" + i + ")' type='number' id='" + i + "_MargenMin' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center' id='" + i + "_PrecioMin'> 0 </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeCobertura(" + i + ")' type='number' id='" + i + "_Margen' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center' id='" + i + "_PrecioFinal'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_PrecioImp'> 0 </td>";
            html += "<td class='text-center' hidden id='" + i + "_PrecioFijo'> <input onchange='javascript: onChangePrecioFijo(" + i + ")' type='number' id='" + i + "_InputPrecioFijo' class='form-control'   value= '0' min='1'/>  </td>";


            html += "<td class='text-center' id='" + i + "_Ganancia'> 0 </td>";


            html += '<td align="center"> <select class=" form-control " disabled id="' + i + 'SelectEscalonado" onchange="javascript: onChangeEscalonado(' + i + ')"  > ' +

                '</option> <option selected value="01"> 1 </option>' +
                '</option> <option  value="02"> 2 </option>' +
                '</option> <option value="03"> 3 </option>' +

                '</select> </td>';
            html += "<td class='text-center'> <input disabled onchange='javascript: onChangeValEscalonado(" + i + ")' type='number' id='" + i + "_CantMin1' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center'> <input disabled onchange='javascript: onChangeValEscalonado(" + i + ")' type='number' id='" + i + "_CantMax1' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center'> <input disabled onchange='javascript: onChangeValEscalonado(" + i + ")' type='number' id='" + i + "_Margen1' class='form-control'   value= '0' min='1'/>  </td>";

            html += "<td  class='text-center'> <input disabled onchange='javascript: onChangeValEscalonado(" + i + ")' type='number' id='" + i + "_CantMin2' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td  class='text-center'> <input disabled onchange='javascript: onChangeValEscalonado(" + i + ")' type='number' id='" + i + "_CantMax2' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td  class='text-center'> <input disabled onchange='javascript: onChangeValEscalonado(" + i + ")' type='number' id='" + i + "_Margen2' class='form-control'   value= '0' min='1'/>  </td>";

            html += "<td  class='text-center'> <input disabled onchange='javascript: onChangeValEscalonado(" + i + ")' type='number' id='" + i + "_CantMin3' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td  class='text-center'> <input disabled onchange='javascript: onChangeValEscalonado(" + i + ")' type='number' id='" + i + "_CantMax3' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td  class='text-center'> <input disabled onchange='javascript: onChangeValEscalonado(" + i + ")' type='number' id='" + i + "_Margen3' class='form-control'   value= '0' min='1'/>  </td>";


            html += "<td class='text-center'><span id='" + i + "_InputEscalonado1'>0</span></td>";
            html += "<td class='text-center'><span id='" + i + "_InputEscalonado2'>0</span></td>";
            html += "<td class='text-center'><span id='" + i + "_InputEscalonado3'>0</span></td>";


            html += "</tr>";




        }


        $("#tbody").html(html);

        for (let i = 0; i < ProdClientes.length; i++) {
            onChangeEscalonado(i);
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}
function toggleInputEscalonado(i, activar) {

    function valorActual(id) {
        var el = $("#" + id);
        return el.is("input") ? el.val() : el.text();
    }

    for (let n = 1; n <= 3; n++) {

        let id = i + "_InputEscalonado" + n;
        let valor = valorActual(id);

        if (activar) {
            $("#" + id).replaceWith(
                "<input type='number' class='form-control' " +
                "id='" + id + "' value='" + valor + "' " +
                "onchange='onChangeInputEscalonado(" + i + "," + n + ")' />"
            );
        } else {
            $("#" + id).replaceWith(
                "<span id='" + id + "'>" + valor + "</span>"
            );
        }
    }
}
function actualizarEscalonado(i) {

    var precioFijo = $("#" + i + "_mdcheckbox2").prop("checked");
    var escalonado = $("#" + i + "_mdcheckbox3").prop("checked");

    var activar = precioFijo && escalonado;

    toggleInputEscalonado(i, activar);
}
function onChangeEscalonado(i) {
    try {
        var nivel = parseInt($("#" + i + "SelectEscalonado").val(), 10);

        // ocultar todos
        toggleEscalon(i, 1, false);
        toggleEscalon(i, 2, false);
        toggleEscalon(i, 3, false);

        // mostrar solo el seleccionado
        toggleEscalon(i, nivel, true);

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e
        });
    }
}
function onChangeCheckboxEscalonado(i) {
    try {
        var checked = $("#" + i + "_mdcheckbox3").is(":checked");

        // habilitar / deshabilitar select
        $("#" + i + "SelectEscalonado").prop("disabled", !checked);

        // habilitar / deshabilitar TODOS los inputs de escalonado
        $("#" + i + "_CantMin1").prop("disabled", !checked);
        $("#" + i + "_CantMax1").prop("disabled", !checked);
        $("#" + i + "_Margen1").prop("disabled", !checked);
        $("#" + i + "_InputEscalonado1").prop("disabled", !checked);

        $("#" + i + "_CantMin2").prop("disabled", !checked);
        $("#" + i + "_CantMax2").prop("disabled", !checked);
        $("#" + i + "_Margen2").prop("disabled", !checked);
        $("#" + i + "_InputEscalonado2").prop("disabled", !checked);

        $("#" + i + "_CantMin3").prop("disabled", !checked);
        $("#" + i + "_CantMax3").prop("disabled", !checked);
        $("#" + i + "_Margen3").prop("disabled", !checked);
        $("#" + i + "_InputEscalonado3").prop("disabled", !checked);

        actualizarEscalonado(i);

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e
        });
    }
}



function toggleEscalon(i, nivel, mostrar) {
    var display = mostrar ? "" : "none";

    $("#" + i + "_CantMin" + nivel).closest("td").css("display", display);
    $("#" + i + "_CantMax" + nivel).closest("td").css("display", display);
    $("#" + i + "_Margen" + nivel).closest("td").css("display", display);
    $("#" + i + "_InputEscalonado" + nivel).closest("td").css("display", display);
}

function onChangeRevisado(i) {
    try {


        var idCategoria = $("#CategoriaSeleccionado").val();
        var idListaPrecio = $("#ListaSeleccionado").val();
        var Moneda = $("#MonedaSeleccionado").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

        var Cobertura = $("#Cobertura").val();
        var Margen = $("#Margen").val();
        var MargenMin = $("#MargenMin").val();

        var valorCheck = $("#" + i + "_mdcheckbox").prop('checked');
        var input = $("#" + i + "_Ganancia");
        var PE = ProdClientes[i];
        if (valorCheck == true) {
            var Existe = ProdCadena.find(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            var x = ProdCadena.findIndex(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            var CantMin1 = parseFloat($("#" + i + "_CantMin1").val()) || 0;
            var CantMax1 = parseFloat($("#" + i + "_CantMax1").val()) || 0;
            var Margen1 = parseFloat($("#" + i + "_Margen1").val()) || 0;

            var CantMin2 = parseFloat($("#" + i + "_CantMin2").val()) || 0;
            var CantMax2 = parseFloat($("#" + i + "_CantMax2").val()) || 0;
            var Margen2 = parseFloat($("#" + i + "_Margen2").val()) || 0;

            var CantMin3 = parseFloat($("#" + i + "_CantMin3").val()) || 0;
            var CantMax3 = parseFloat($("#" + i + "_CantMax3").val()) || 0;
            var Margen3 = parseFloat($("#" + i + "_Margen3").val()) || 0;

            var PE = ProdClientes[i];
            if (Existe == undefined) {

                var Producto =
                {




                    ItemCode: PE.Codigo,
                    idListaPrecio: parseFloat($("#ListaSeleccionado").val()),
                    idCategoria: PE.idCategoria,
                    Moneda: PE.Moneda,
                    PrecioSAP: PE.PrecioUnitario,
                    Cobertura: parseFloat($("#" + i + "_Cobertura").val()),
                    Margen: parseFloat($("#" + i + "_Margen").val()),
                    MargenMin: parseFloat($("#" + i + "_MargenMin").val()),
                    PrecioFinal: 0,
                    PrecioCob: 0,
                    PrecioMin: 0,
                    Seteable: $("#" + i + "_mdcheckbox").prop('checked'),
                    PrecioFijo: $("#" + i + "_mdcheckbox2").prop('checked'),
                    Escalonado: $("#" + i + "_mdcheckbox3").prop('checked'),
                    CantMin1: CantMin1,
                    CantMax1: CantMax1,
                    Margen1: Margen1,

                    CantMin2: CantMin2,
                    CantMax2: CantMax2,
                    Margen2: Margen2,

                    CantMin3: CantMin3,
                    CantMax3: CantMax3,
                    Margen3: Margen3,

                    PrecioEscalonado1: 0,
                    PrecioEscalonado2: 0,
                    PrecioEscalonado3: 0




                };


                Producto.PrecioCob = PE.Costo / (1 - (Producto.Cobertura / 100));
                Producto.PrecioFinal = Producto.PrecioCob / (1 - (Producto.Margen / 100));
                Producto.PrecioMin = Producto.PrecioCob / (1 - (Producto.MargenMin / 100));


                var PrecioImp = Producto.PrecioFinal * 1.13;



                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(Producto.PrecioFinal)));
                $("#" + i + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(Producto.PrecioCob).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(Producto.PrecioMin).toFixed(2)));
                if (Moneda == "CRC") {
                    Ganancia = retornaMargenGanancia(Producto.PrecioFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(Producto.PrecioFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }

                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
                ProdCadena.push(Producto);
            } else {
                ProdCadena[x].Margen = parseFloat($("#" + i + "_Margen").val());
                ProdCadena[x].Cobertura = parseFloat($("#" + i + "_Cobertura").val());
                ProdCadena[x].MargenMin = parseFloat($("#" + i + "_MargenMin").val());
                ProdCadena[x].PrecioCob = PE.Costo / (1 - (ProdCadena[x].Cobertura / 100));
                ProdCadena[x].PrecioFinal = ProdCadena[x].PrecioCob / (1 - (ProdCadena[x].Margen / 100));
                ProdCadena[x].PrecioMin = ProdCadena[x].PrecioCob / (1 - (ProdCadena[x].MargenMin / 100));
                ProdCadena[x].Seteable = $("#" + i + "_mdcheckbox").prop('checked');
                ProdCadena[x].PrecioFijo = $("#" + i + "_mdcheckbox2").prop('checked');
                var PrecioImp = ProdCadena[x].PrecioFinal * 1.13;


                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioFinal)));
                $("#" + i + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioCob).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioMin).toFixed(2)));

                if (Moneda == "CRC") {
                    Ganancia = retornaMargenGanancia(ProdCadena[x].PrecioFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(ProdCadena[x].PrecioFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }


                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }

            }
        }
        else {
            var Existe = ProdCadena.find(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            var x = ProdCadena.findIndex(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            if (ProdCadena[x].Cobertura == Cobertura && ProdCadena[x].Margen == Margen && ProdCadena[x].MargenMin == MargenMin && Existe != undefined) {



                ProdCadena.splice(x, 1);
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
function setValorEscalonado(id, valor) {
    var el = $("#" + id);

    if (el.length === 0) return;

    if (el.is("input")) {
        el.val(valor);
    } else {
        el.text(valor);
    }
}

function calcularPrecioEscalonado(i, margen, inputId) {
    try {
        if (margen <= 0) {
            setValorEscalonado(inputId, 0);
            return;
        }

        var PE = ProdClientes[i];
        var Moneda = $("#MonedaSeleccionado").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

        var Cobertura = parseFloat($("#" + i + "_Cobertura").val()) || 0;

        var PrecioCob = PE.Costo / (1 - (Cobertura / 100));
        var PrecioFinal = PrecioCob / (1 - (margen / 100));
        var PrecioImp = PrecioFinal * 1.13;

        // Si trabajas con USD
        if (Moneda !== "CRC") {
            PrecioImp = PrecioImp;
        }

        setValorEscalonado(inputId, parseFloat(PrecioImp).toFixed(0));

        // 🔹 Detectar nivel desde el ID
        var nivel = 0;
        if (inputId.endsWith("1")) nivel = 1;
        else if (inputId.endsWith("2")) nivel = 2;
        else if (inputId.endsWith("3")) nivel = 3;

        if (nivel === 0) return;

        // 🔹 Buscar en ProdCadena por ItemCode
        var x = ProdCadena.findIndex(p => p.ItemCode === PE.Codigo);
        if (x === -1) return; // no existe, no guardamos

        // 🔹 Guardar precio SIN IVA
        ProdCadena[x]["PrecioEscalonado" + nivel] = parseFloat((PrecioFinal).toFixed(2));
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }
   


}


function onChangeInputEscalonado(i, nivel) {
    try {

        var PE = ProdClientes[i];
        var Cobertura = parseFloat($("#" + i + "_Cobertura").val()) || 0;

        var precioConIVA = parseFloat($("#" + i + "_InputEscalonado" + nivel).val()) || 0;
        if (precioConIVA <= 0) return;

        const IVA = 0.13;

        // 1️⃣ Quitar IVA
        var precioSinIVA = precioConIVA / (1 + IVA);

        // 2️⃣ Quitar Cobertura
        var precioBase = precioSinIVA * (1 - (Cobertura / 100));

        // 3️⃣ Calcular margen REAL
        var margen = 100 - ((PE.Costo / precioBase) * 100);

        $("#" + i + "_Margen" + nivel).val(margen.toFixed(2));

        var prod = ProdCadena.find(a => a.ItemCode == PE.Codigo);
        if (prod) {
            prod["Margen" + nivel] = margen;
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }
}

function onChangeCheckboxPrecio(i) {
    try {
        var valorCheck = $("#" + i + "_mdcheckbox2").prop('checked');
        var idCategoria = $("#CategoriaSeleccionado").val();
        var idListaPrecio = $("#ListaSeleccionado").val();
        var Moneda = $("#MonedaSeleccionado").val();
        var Existe = ProdCadena.find(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
        var x = ProdCadena.findIndex(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
        if (valorCheck == true) {
            $("#" + i + "_PrecioImp").attr("hidden", true);      // Oculta el primero
            $("#" + i + "_PrecioFijo").removeAttr("hidden");
            var texto = $("#" + i + "_PrecioImp").text();
            var limpio = texto.replace(/,/g, '');
            var valor = parseFloat(limpio);
            $("#" + i + "_InputPrecioFijo").val(valor);
            $("#" + i + "_Margen").prop("disabled", true);
            $("#" + i + "_Margen1").prop("disabled", true);
            $("#" + i + "_Margen2").prop("disabled", true);
            $("#" + i + "_Margen3").prop("disabled", true);
            actualizarEscalonado(i);



        } else {
            $("#" + i + "_PrecioImp").removeAttr("hidden");
            $("#" + i + "_PrecioFijo").attr("hidden", true);
            var texto = $("#" + i + "_PrecioImp").text();
            var limpio = texto.replace(/,/g, '');
            var valor = parseFloat(limpio);
            $("#" + i + "_InputPrecioFijo").val(valor);
            ProdCadena[x].PrecioFijo = $("#" + i + "_mdcheckbox2").prop('checked');
            $("#" + i + "_Margen").prop("disabled", false);
            $("#" + i + "_Margen1").prop("disabled", false);
            $("#" + i + "_Margen2").prop("disabled", false);
            $("#" + i + "_Margen3").prop("disabled", false);
            actualizarEscalonado(i);
        }

        if (Existe) {
            ProdCadena[x].PrecioFijo = $("#" + i + "_mdcheckbox2").prop('checked');
        }
        onChangePrecioFijo(i);

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }

}


function onChangePrecioFijo(i) {
    try {


        var idCategoria = $("#CategoriaSeleccionado").val();
        var idListaPrecio = $("#ListaSeleccionado").val();
        var Moneda = $("#MonedaSeleccionado").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

        var Cobertura = $("#Cobertura").val();
        var Margen = $("#Margen").val();
        var MargenMin = $("#MargenMin").val();

        var valorCheck = $("#" + i + "_mdcheckbox2").prop('checked');
        var input = $("#" + i + "_Ganancia");

        var CantMin1 = parseFloat($("#" + i + "_CantMin1").val()) || 0;
        var CantMax1 = parseFloat($("#" + i + "_CantMax1").val()) || 0;
        var Margen1 = parseFloat($("#" + i + "_Margen1").val()) || 0;

        var CantMin2 = parseFloat($("#" + i + "_CantMin2").val()) || 0;
        var CantMax2 = parseFloat($("#" + i + "_CantMax2").val()) || 0;
        var Margen2 = parseFloat($("#" + i + "_Margen2").val()) || 0;

        var CantMin3 = parseFloat($("#" + i + "_CantMin3").val()) || 0;
        var CantMax3 = parseFloat($("#" + i + "_CantMax3").val()) || 0;
        var Margen3 = parseFloat($("#" + i + "_Margen3").val()) || 0;
        var PE = ProdClientes[i];
        if (valorCheck == true) {

            var Existe = ProdCadena.find(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            var x = ProdCadena.findIndex(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);

            var PE = ProdClientes[i];
            if (Existe == undefined) {

                var PrecioImp = parseFloat($("#" + i + "_InputPrecioFijo").val());
                var PrecioFinal = PrecioImp / 1.13;
                var Producto =
                {




                    ItemCode: PE.Codigo,
                    idListaPrecio: parseFloat($("#ListaSeleccionado").val()),
                    idCategoria: PE.idCategoria,
                    Moneda: PE.Moneda,
                    PrecioSAP: PE.PrecioUnitario,
                    Cobertura: parseFloat($("#" + i + "_Cobertura").val()),
                    Margen: parseFloat($("#" + i + "_Margen").val()),
                    MargenMin: parseFloat($("#" + i + "_MargenMin").val()),
                    PrecioFinal: PrecioFinal,
                    PrecioCob: 0,
                    PrecioMin: 0,
                    Seteable: $("#" + i + "_mdcheckbox").prop('checked'),
                    PrecioFijo: $("#" + i + "_mdcheckbox2").prop('checked'),
                    Escalonado: $("#" + i + "_mdcheckbox3").prop('checked'),
                    CantMin1: CantMin1,
                    CantMax1: CantMax1,
                    Margen1: Margen1,

                    CantMin2: CantMin2,
                    CantMax2: CantMax2,
                    Margen2: Margen2,

                    CantMin3: CantMin3,
                    CantMax3: CantMax3,
                    Margen3: Margen3,

                    PrecioEscalonado1: 0,
                    PrecioEscalonado2: 0,
                    PrecioEscalonado3: 0



                };
                Producto.PrecioCob = PE.Costo / (1 - (Producto.Cobertura / 100));
                Producto.Margen = 100 - ((Producto.PrecioCob / Producto.PrecioFinal) * 100)
                $("#" + i + "_Margen").val(Producto.Margen.toFixed(2));

                Producto.PrecioFinal = Producto.PrecioCob / (1 - (Producto.Margen / 100));
                Producto.PrecioMin = Producto.PrecioCob / (1 - (Producto.MargenMin / 100));





                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(Producto.PrecioFinal)));

                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(Producto.PrecioCob).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(Producto.PrecioMin).toFixed(2)));
                if (Moneda == "CRC") {
                    Ganancia = retornaMargenGanancia(Producto.PrecioFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(Producto.PrecioFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }

                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
                ProdCadena.push(Producto);
            } else {

                var PrecioImp = parseFloat($("#" + i + "_InputPrecioFijo").val());
                var PrecioFinal = PrecioImp / 1.13;

                ProdCadena[x].PrecioCob = PE.Costo / (1 - (ProdCadena[x].Cobertura / 100));
                ProdCadena[x].PrecioFinal = PrecioFinal;
                ProdCadena[x].Margen = 100 - ((ProdCadena[x].PrecioCob / PrecioFinal) * 100);

                $("#" + i + "_Margen").val(ProdCadena[x].Margen);

                ProdCadena[x].Cobertura = parseFloat($("#" + i + "_Cobertura").val());
                ProdCadena[x].MargenMin = parseFloat($("#" + i + "_MargenMin").val());


                ProdCadena[x].PrecioMin = ProdCadena[x].PrecioCob / (1 - (ProdCadena[x].MargenMin / 100));
                ProdCadena[x].Seteable = $("#" + i + "_mdcheckbox").prop('checked');
                ProdCadena[x].PrecioFijo = $("#" + i + "_mdcheckbox2").prop('checked');
                ProdCadena[x].Escalonado = $("#" + i + "_mdcheckbox3").prop('checked');
                var PrecioImp = ProdCadena[x].PrecioFinal * 1.13;


                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioFinal)));
                $("#" + i + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioCob).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioMin).toFixed(2)));

                if (Moneda == "CRC") {
                    Ganancia = retornaMargenGanancia(ProdCadena[x].PrecioFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(ProdCadena[x].PrecioFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }


                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }

            }
        }
        else {

            $("#" + i + "_PrecioImp").removeAttr("hidden");
            $("#" + i + "_PrecioFijo").attr("hidden", true);
            var texto = $("#" + i + "_PrecioImp").text();
            var limpio = texto.replace(/,/g, '');
            var valor = parseFloat(limpio);
            $("#" + i + "_InputPrecioFijo").val(valor);
            var Existe = ProdCadena.find(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            var x = ProdCadena.findIndex(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            ProdCadena[x].PrecioFijo = $("#" + i + "_mdcheckbox2").prop('checked');
            if (ProdCadena[x].Cobertura == Cobertura && ProdCadena[x].Margen == Margen && ProdCadena[x].MargenMin == MargenMin && Existe != undefined) {



                ProdCadena.splice(x, 1);
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
            var PE = ProdClientes[i];
            Existe = ProdCadena.find(a => a.ItemCode == PE.Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            var valorCheck = $("#" + i + "_mdcheckbox").prop('checked');
            if (valorCheck == false) {
                if (Existe == undefined) {
                    $("#" + i + "_Cobertura").val(Cobertura);
                    $("#" + i + "_Margen").val(Margen);
                    $("#" + i + "_MargenMin").val(MargenMin);

                    var PrecioCob = PE.Costo / (1 - (Cobertura / 100));
                    var PrecioFinal = PrecioCob / (1 - (Margen / 100));
                    var PrecioMin = PrecioCob / (1 - (MargenMin / 100));
                    var PrecioImp = PrecioFinal * 1.13;

                    var Ganancia = 0;
                    $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(PrecioFinal)));
                    $("#" + i + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                    $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(PrecioMin).toFixed(2)));
                    $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(PrecioCob).toFixed(2)));

                    if (Moneda == "CRC") {
                        Ganancia = retornaMargenGanancia(PrecioFinal, PE.Costo);
                        $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                    } else {
                        var Costo = PE.Costo / TipodeCambio.TipoCambio;
                        Ganancia = retornaMargenGanancia(PrecioFinal, Costo);
                        $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                    }


                    if (Ganancia > 0) {
                        input.css('background-color', '#EFFFE9')
                    } else {
                        input.css('background-color', '#FFE9E9')
                    }
                }
            }
        }
        $("#ListaSeleccionado").prop("disabled", true);
        $("#CategoriaSeleccionado").prop("disabled", true);
        $("#MonedaSeleccionado").prop("disabled", true);
        $("#botonGT").prop("disabled", false);



    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar   ' + e

        })
    }
}

function Generar() {

    try {

        var EncMargenes = {
            idListaPrecio: $("#idListaPrecio").val(),
            idCategoria: $("#idCategoria").val(),
            Moneda: $("#idMoneda").val(),
            idListaPrecio: $("#ListaSeleccionado").val(),
            idCategoria: $("#CategoriaSeleccionado").val(),
            Moneda: $("#MonedaSeleccionado").val(),
            Cobertura: parseFloat($("#Cobertura").val()),
            Margen: parseFloat($("#Margen").val()),
            MargenMin: parseFloat($("#MargenMin").val()),
            idUsuarioCreador: 0,
            FechaCreacion: $("#Fecha").val(),

            Detalle: ProdCadena
        }

        if (validarMargen(EncMargenes)) {
            Swal.fire({
                title: '¿Desea guardar el Margen?',
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
                    var jsonString = JSON.stringify(EncMargenes);
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


                            console.log("resultado " + json.margen);
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

                                        window.location.href = window.location.href.split("/Editar")[0];


                                    }
                                })

                            } else {

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.error

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

function validarMargen(e) {
    try {



        if (e.idListaPrecio == "" || e.idListaPrecio == null || e.idListaPrecio == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Lista de Precios'

            })
            return false;
        }
        else if (e.idCategoria == "" || e.idCategoria == null || e.idCategoria == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Categoria'

            })
            return false;
        }
        else if (e.Moneda == "" || e.Moneda == null || e.Moneda == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Moneda'

            })
            return false;
        }
        else if (e.Cobertura == null || e.Cobertura < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, Cobertura invalida'

            })
            return false;
        }

        else if (e.Margen == "" || e.Margen == null || e.Margen <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, Margen invalido'

            })
            return false;
        }

        else if (e.MargenMin == "" || e.MargenMin == null || e.MargenMin <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, Margen Minimo invalido'

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
    var busqueda = $("#busqueda").val().toLowerCase();
    var filas = $("#tbody tr");
    var indicesVisibles = [];

    filas.each(function (index) {
        var descripcion = $(this).find("td:eq(3)").text().toLowerCase();

        if (descripcion.includes(busqueda)) {
            $(this).show();
            indicesVisibles.push(index);
        } else {
            $(this).hide();
        }
    });

    return indicesVisibles;
}

function SetearT() {
    try {
        var Cobertura = $("#CoberturaT").val();
        var Margen = $("#MargenT").val();
        var MargenMin = $("#MargenMinT").val();

        var idCategoria = $("#CategoriaSeleccionado").val();
        var idListaPrecio = $("#ListaSeleccionado").val();
        var Moneda = $("#MonedaSeleccionado").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

        var indicesVisibles = filtrarTabla();
        indicesVisibles.forEach(function (index) {

            var descripcion = $(this).find("td:eq(1)").text().toLowerCase();
            var busqueda = $("#busqueda").val().toLowerCase();
            var valorCheck = $("#" + index + "_mdcheckbox").prop('checked');
            if (valorCheck == false) {
                if (descripcion.includes(busqueda)) {
                    var Existe = ProdCadena.find(a => a.ItemCode == ProdClientes[index].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);

                    if (Existe == undefined) {



                        var input = $("#" + index + "_Ganancia");

                        $("#" + index + "_Cobertura").val(Cobertura);
                        $("#" + index + "_Margen").val(Margen);
                        $("#" + index + "_MargenMin").val(MargenMin);

                        var PrecioCob = ProdClientes[index].Costo / (1 - (Cobertura / 100));
                        var PrecioFinal = PrecioCob / (1 - (Margen / 100));
                        var PrecioMin = PrecioCob / (1 - (MargenMin / 100));
                        var PrecioImp = PrecioFinal * 1.13;

                        var Ganancia = 0;
                        $("#" + index + "_PrecioFinal").text(formatoDecimal(parseFloat(PrecioFinal)));
                        $("#" + index + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                        $("#" + index + "_PrecioCob").text(formatoDecimal(parseFloat(PrecioCob).toFixed(2)));
                        $("#" + index + "_PrecioMin").text(formatoDecimal(parseFloat(PrecioMin).toFixed(2)));

                        if (Moneda == "CRC") {
                            Ganancia = retornaMargenGanancia(PrecioFinal, ProdClientes[index].Costo);
                            $("#" + index + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                        } else {
                            var Costo = ProdClientes[index].Costo / TipodeCambio.TipoCambio;
                            Ganancia = retornaMargenGanancia(PrecioFinal, Costo);
                            $("#" + index + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                        }

                        if (Ganancia > 0) {
                            input.css('background-color', '#EFFFE9');
                        } else {
                            input.css('background-color', '#FFE9E9');
                        }
                        onChangeCobertura(index);



                    }
                } else {



                    var input = $("#" + index + "_Ganancia");

                    $("#" + index + "_Cobertura").val(Cobertura);
                    $("#" + index + "_Margen").val(Margen);
                    $("#" + index + "_MargenMin").val(MargenMin);

                    var PrecioCob = ProdClientes[index].Costo / (1 - (Cobertura / 100));
                    var PrecioFinal = PrecioCob / (1 - (Margen / 100));
                    var PrecioMin = PrecioCob / (1 - (MargenMin / 100));
                    var PrecioImp = PrecioFinal * 1.13;

                    var Ganancia = 0;
                    $("#" + index + "_PrecioFinal").text(formatoDecimal(parseFloat(PrecioFinal)));
                    $("#" + index + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                    $("#" + index + "_PrecioCob").text(formatoDecimal(parseFloat(PrecioCob).toFixed(2)));
                    $("#" + index + "_PrecioMin").text(formatoDecimal(parseFloat(PrecioMin).toFixed(2)));

                    if (Moneda == "CRC") {
                        Ganancia = retornaMargenGanancia(PrecioFinal, ProdClientes[index].Costo);
                        $("#" + index + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                    } else {
                        var Costo = ProdClientes[index].Costo / TipodeCambio.TipoCambio;
                        Ganancia = retornaMargenGanancia(PrecioFinal, Costo);
                        $("#" + index + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                    }

                    if (Ganancia > 0) {
                        input.css('background-color', '#EFFFE9');
                    } else {
                        input.css('background-color', '#FFE9E9');
                    }
                    onChangeCobertura(index);



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






