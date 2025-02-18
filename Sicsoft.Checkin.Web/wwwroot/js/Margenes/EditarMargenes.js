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
                Seteable: Margenes.Detalle[i].Seteable





            };
            ProdCadena.push(Producto);


            var PE = ProdClientes.find(a => a.Codigo == Producto.ItemCode && a.idCategoria == Producto.idCategoria && a.idListaPrecios == Producto.idListaPrecio && a.Moneda == Producto.Moneda);
            if (PE != undefined) {

           
            var x = ProdClientes.findIndex(a => a.Codigo == Producto.ItemCode && a.idCategoria == Producto.idCategoria && a.idListaPrecios == Producto.idListaPrecio && a.Moneda == Producto.Moneda);
            CambiarCheck(i, true);
            $("#" + x + "_PrecioFinal").text(formatoDecimal(parseFloat(Producto.PrecioFinal).toFixed(2)));
            $("#" + x + "_PrecioCob").text(formatoDecimal(parseFloat(Producto.PrecioCob).toFixed(2)));
            $("#" + x + "_PrecioMin").text(formatoDecimal(parseFloat(Producto.PrecioMin).toFixed(2)));
            $("#" + x + "_Cobertura").val(Producto.Cobertura);
            $("#" + x + "_Margen").val(Producto.Margen);
            $("#" + x + "_MargenMin").val(Producto.MargenMin);
            var PrecioImp = Producto.PrecioFinal * 1.13;


          
            $("#" + x + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
            var Ganancia = 0;
            var input = $("#" + x + "_Ganancia");
            var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
            var Moneda = $("#MonedaSeleccionado").val();

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

        } else {
            var valorCheck = $("#" + x + "_mdcheckbox").prop('checked');
            Margenes.Detalle[i].Seteable = valorCheck;
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
                    Seteable: $("#" + i + "_mdcheckbox").prop('checked')


                };
                Producto.PrecioCob = PE.Costo / (1 - (Producto.Cobertura / 100));
                Producto.PrecioFinal = Producto.PrecioCob / (1 - (Producto.Margen / 100));
                Producto.PrecioMin = Producto.PrecioCob / (1 - (Producto.MargenMin / 100));
                var PrecioImp = Producto.PrecioFinal * 1.13;


                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(Producto.PrecioFinal).toFixed(2)));
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

                var PrecioImp = ProdCadena[x].PrecioFinal * 1.13;


                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioFinal).toFixed(2)));
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
            html += "<td > " + ProdClientes[i].Codigo + "-" + ProdClientes[i].Nombre + " </td>";


            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2)) + " </td>";

            html += "<td class='text-center'> <input onchange='javascript: onChangeCobertura(" + i + ")' type='number' id='" + i + "_Cobertura' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center' id='" + i + "_PrecioCob'> 0 </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeCobertura(" + i + ")' type='number' id='" + i + "_MargenMin' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center' id='" + i + "_PrecioMin'> 0 </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeCobertura(" + i + ")' type='number' id='" + i + "_Margen' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center' id='" + i + "_PrecioFinal'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_PrecioImp'> 0 </td>";
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
                    Seteable: $("#" + i + "_mdcheckbox").prop('checked')


                };


                Producto.PrecioCob = PE.Costo / (1 - (Producto.Cobertura / 100));
                Producto.PrecioFinal = Producto.PrecioCob / (1 - (Producto.Margen / 100));
                Producto.PrecioMin = Producto.PrecioCob / (1 - (Producto.MargenMin / 100));


                var PrecioImp = Producto.PrecioFinal * 1.13;



                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(Producto.PrecioFinal).toFixed(2)));
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
                var PrecioImp = ProdCadena[x].PrecioFinal * 1.13;


                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioFinal).toFixed(2)));
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
                    $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(PrecioFinal).toFixed(2)));
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
        else if ( e.Cobertura == null || e.Cobertura < 0) {
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
        var descripcion = $(this).find("td:eq(1)").text().toLowerCase();

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
                        $("#" + index + "_PrecioFinal").text(formatoDecimal(parseFloat(PrecioFinal).toFixed(2)));
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
                    $("#" + index + "_PrecioFinal").text(formatoDecimal(parseFloat(PrecioFinal).toFixed(2)));
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
