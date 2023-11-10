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

function Recuperar() {
    try {


        PrecioXLista = JSON.parse($("#PrecioXLista").val());
        ListaPrecios = JSON.parse($("#ListaPrecios").val());
        Productos = JSON.parse($("#Productos").val());
        Categorias = JSON.parse($("#Categorias").val());
        TipoCambio = JSON.parse($("#TipoCambio").val());

        RellenaListaPrecios()
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

function onChangeCobertura(i) {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idListaPrecio = $("#ListaSeleccionado").val();

        var Moneda = $("#MonedaSeleccionado").val();
        var Cobertura = $("#Cobertura").val();
        var Margen = $("#Margen").val();
        var MargenMin = $("#MargenMin").val();

        var CoberturaL = $("#" + i + "_Cobertura").val();
        var MargenL = $("#" + i + "_Margen").val();
        var MargenMinL = $("#" + i + "_MargenMin").val();

        var Existe = ProdCadena[i];
        if (Existe == undefined) {
            if (CoberturaL != Cobertura || MargenL != Margen || MargenMinL != MargenMin) {



                var PE = ProdClientes[i];


                var Producto =
                {




                    ItemCode: PE.Codigo,
                    idListaPrecio: parseFloat($("#ListaSeleccionado").val()),
                    idCategoria: PE.idCategoria,
                    Moneda: PE.Moneda,
                    PrecioSAP: PE.PrecioUnitario,
                    Cobertura: parseFloat($("#" + i + "_Cobertura").val()),
                    Margen: parseFloat($("#" + i + "_Margen").val()),
                    MargenMin: parseFloat($("#MargenMin").val()),
                    PrecioFinal: 0,
                    PrecioCob: 0,
                    PrecioMin: 0


                };

                Producto.PrecioFinal = Producto.PrecioSAP * Producto.Margen;
                Producto.PrecioCob = Producto.PrecioSAP * Producto.Cobertura;
                Producto.PrecioMin = Producto.PrecioSAP * Producto.MargenMin;


                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(Producto.PrecioFinal).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(Producto.PrecioCob).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(Producto.PrecioMin).toFixed(2)));

                ProdCadena.push(Producto);
            } else {
                ProdCadena.splice(i, 1);
            }
        } else {
            if (CoberturaL != Cobertura || MargenL != Margen || MargenMinL != MargenMin) {

                ProdCadena[i].Cobertura = parseFloat($("#" + i + "_Cobertura").val());
                ProdCadena[i].Margen = parseFloat($("#" + i + "_Margen").val());
                ProdCadena[i].MargenMin = parseFloat($("#" + i + "_MargenMin").val());
                ProdCadena[i].PrecioFinal = ProdCadena[i].PrecioSAP * ProdCadena[i].Margen;
                ProdCadena[i].PrecioCob = ProdCadena[i].PrecioSAP * ProdCadena[i].Cobertura;
                ProdCadena[i].PrecioMin = ProdCadena[i].PrecioSAP * ProdCadena[i].MargenMin;

                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(ProdCadena[i].PrecioFinal).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(ProdCadena[i].PrecioCob).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(ProdCadena[i].PrecioMin).toFixed(2)));


            } else {
                ProdCadena.splice(i, 1);
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


            html += "<td > " + ProdClientes[i].Codigo + "-" + ProdClientes[i].Nombre + " </td>";


            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2)) + " </td>";
            html += "<td > " + ProdClientes[i].Moneda + " </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeCobertura(" + i + ")' type='number' id='" + i + "_Cobertura' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center' id='" + i + "_PrecioCob'> 0 </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeCobertura(" + i + ")' type='number' id='" + i + "_MargenMin' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center' id='" + i + "_PrecioMin'> 0 </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeCobertura(" + i + ")' type='number' id='" + i + "_Margen' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center' id='" + i + "_PrecioFinal'> 0 </td>";



         
           

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

function Setear() {
    try {
        var Cobertura = $("#Cobertura").val();
        var Margen = $("#Margen").val();
        var MargenMin = $("#MargenMin").val();
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idListaPrecio = $("#ListaSeleccionado").val();

        var Moneda = $("#MonedaSeleccionado").val();

        for (var i = 0; i < ProdClientes.length; i++) {
            var Existe = undefined;
            var PE = ProdClientes[i];
            Existe = ProdCadena.find( a => a.ItemCode == PE.Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            if (Existe == undefined) {
                $("#" + i + "_Cobertura").val(Cobertura);
                $("#" + i + "_Margen").val(Margen);
                $("#" + i + "_MargenMin").val(MargenMin);
                var PrecioFinal = PE.PrecioUnitario * Margen;
                var PrecioMin = PE.PrecioUnitario * MargenMin;
                var PrecioCob = PE.PrecioUnitario * Cobertura;


                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(PrecioFinal).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(PrecioMin).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(PrecioCob).toFixed(2)));
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