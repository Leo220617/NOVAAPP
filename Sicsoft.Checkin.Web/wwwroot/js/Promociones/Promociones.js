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
var ProdCadenaC = [];
var ListaPrecios = [];
var Categorias = [];
var Duplicado = false;
var TipoCambio = [];
var Fechabool = false;
var Clientes = [];
var Pais = "";

function retornaMargenGanancia(PrecioVenta, Costo) {
    try {

        return ((PrecioVenta - Costo) / (PrecioVenta)) * 100;

    } catch (e) {
        return 0;
    }
}
function Recuperar() {
    try {


        PrecioXLista = JSON.parse($("#PrecioXLista").val());
        ListaPrecios = JSON.parse($("#ListaPrecios").val());
        Productos = JSON.parse($("#Productos").val());
        Categorias = JSON.parse($("#Categorias").val());
        TipoCambio = JSON.parse($("#TipoCambio").val());
        Clientes = JSON.parse($("#Clientes").val());
        Pais = $("#Pais").val();
        RellenaListaPrecios();
        RellenaCategorias();
        RellenaClientes();

        //for (var i = 0; i < PrecioXLista.length; i++) {
        //    var objeto = {
        //        Descripcion: PE.Codigo + " - " + PE.Nombre,
        //        idProducto: PE.Codigo,
        //        Ganancia: parseFloat($("#inputGanancia").val()),


        //        ItemCode: PE.Codigo,
        //        idCategoria: PE.idCategoria,
        //        FechaVen: $("#FechaVen").val(),
        //        PrecioFinal: parseFloat($("#inputFinal").val()),
        //        Moneda: PE.Moneda,
        //        PrecioUnitario: parseFloat($("#inputPrecio").val())

        //    }
        //    ProdCadena.push(objeto);
        //}

        RellenaTabla();

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
function onChangeListaPrecio() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idListaPrecio = $("#ListaSeleccionado").val();

        var Lista = ListaPrecios.find(a => a.id == idListaPrecio);


        if (idListaPrecio != 0) {
            ProdClientes = Productos.filter(a => a.idListaPrecios == idListaPrecio);

            RellenaProductos();
        } else {
            ProdClientes = Productos.filter(a => a.idListaPrecios == 0);
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



function onChangeCategoria() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idListaPrecio = $("#ListaSeleccionado").val();

        var Categoria = Categorias.find(a => a.id == idCategoria);


        if (idCategoria != 0 && idListaPrecio != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idListaPrecios == idListaPrecio);
            RellenaProductos();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idListaPrecios == 0);
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
        var html = "";
        $("#ProductoSeleccionado").html(html);

        html += "<option value='0' > Seleccione Producto </option>";

        for (var i = 0; i < ProdClientes.length; i++) {


            html += "<option value='" + ProdClientes[i].Codigo + "' > " + ProdClientes[i].Codigo + " - " + ProdClientes[i].Nombre + " -  Precio: " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2)) + " </option>";
        }



        $("#ProductoSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function onChangeProducto() {
    try {
        var idProducto = $("#ProductoSeleccionado").val();
        var Moneda = $("#selectMoneda").val();

        var Producto = ProdClientes.find(a => a.Codigo == idProducto);

        var idCategoria = $("#CategoriaSeleccionado").val();




        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        var fechaHoyX = $.datepicker.formatDate('yy-mm-dd', new Date());

        if (Producto != undefined) {
            var Categoria = Categorias.find(a => a.id == Producto.idCategoria);
            if (Pais == "C") {
                if (Moneda == "CRC") {
                    $("#inputPrecio").val(parseFloat(Producto.PrecioUnitario));
                    $("#inputFinal").val(parseFloat(Producto.PrecioUnitario));
                } else {
                    $("#inputPrecio").val(parseFloat(Producto.PrecioUnitario / TipodeCambio.TipoCambio));
                    $("#inputFinal").val(parseFloat(Producto.PrecioUnitario / TipodeCambio.TipoCambio));
                }
            } else {
                $("#inputPrecio").val(parseFloat(Producto.PrecioUnitario));
                $("#inputFinal").val(parseFloat(Producto.PrecioUnitario));
            }


            $("#inputCosto").val(parseFloat(Producto.Costo));


            $("#inputNomPro").val(Producto.Nombre);
            $("#inputNomCat").val(Categoria.Nombre);



            if (Moneda == "CRC") {
                var Ganancia = retornaMargenGanancia(Producto.PrecioUnitario, Producto.Costo);
                $("#inputGanancia").val(Ganancia);

            } else {
                var Costo = Producto.Costo / TipodeCambio.TipoCambio;
                var Ganancia = retornaMargenGanancia(Producto.PrecioUnitario / TipodeCambio.TipoCambio, Costo);
                $("#inputGanancia").val(Ganancia);

            }



            $("#MonedaProducto").val(Moneda);
        } else {


            $("#inputPrecio").val(0);
            $("#inputGanancia").val(0);
            $("#inputCosto").val(0);
            $("#inputFinal").val(0);
            $("#inputNomPro").val("");
            $("#inputNomCat").val("");

            $("#MonedaProducto").val("");

        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }




}

function onChangePrecio() {
    try {

        var idProducto = $("#ProductoSeleccionado").val();
        var PrecioFinal = parseFloat($("#inputFinal").val());

        var Producto = ProdClientes.find(a => a.Codigo == idProducto);
        var Moneda = $("#selectMoneda").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");


        if (Moneda == "CRC") {
            if (Producto.PrecioUnitario < PrecioFinal) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Precio invalido, el precio tiene que ser menor  a ' + ' ' + Producto.PrecioUnitario

                })
                parseFloat($("#inputFinal").val(Producto.PrecioUnitario));
            } else {

                var Ganancia = retornaMargenGanancia(PrecioFinal, Producto.Costo);
                $("#inputGanancia").val(Ganancia);


            }
        } else {
            if (Pais == "C") {
                if (Producto.PrecioUnitario / TipodeCambio.TipoCambio < PrecioFinal) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Precio invalido, el precio tiene que ser menor  a ' + ' ' + Producto.PrecioUnitario / TipodeCambio.TipoCambio

                    })
                    parseFloat($("#inputFinal").val(Producto.PrecioUnitario / TipodeCambio.TipoCambio));
                } else {

                    var Costo = Producto.Costo / TipodeCambio.TipoCambio;
                    var Ganancia = retornaMargenGanancia(PrecioFinal, Costo);
                    $("#inputGanancia").val(Ganancia);


                }
            } else {
                if (Producto.PrecioUnitario < PrecioFinal) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Precio invalido, el precio tiene que ser menor  a ' + ' ' + Producto.PrecioUnitario

                    })
                    parseFloat($("#inputFinal").val(Producto.PrecioUnitario));
                } else {

                    var Costo = Producto.Costo;
                    var Ganancia = retornaMargenGanancia(PrecioFinal, Costo);
                    $("#inputGanancia").val(Ganancia);


                }
            }

        }













    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }
}


function AgregarProductoTabla() {
    try {


        var id = $("#ProductoSeleccionado").val();
        var fechaHoy = $.datepicker.formatDate('dd/mm/yy', new Date());
        var fechaHoyX = $.datepicker.formatDate('yy-mm-dd', new Date());
        var idCategoria = $("#CategoriaSeleccionado").val();
        var idListaPrecio = $("#ListaSeleccionado").val();
        var PE = ProdClientes.find(a => a.Codigo == id);
        var Categoria = Categorias.find(a => a.id == PE.idCategoria);
        var Promociones = PrecioXLista.find(a => a.ItemCode == id && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio);
        Duplicado = false;
        Fechabool = false;


        var Producto =
        {

            Descripcion: PE.Codigo + " - " + PE.Nombre,
            Categoria: Categoria.CodSAP + " - " + Categoria.Nombre,
            idProducto: PE.Codigo,
            Ganancia: parseFloat($("#inputGanancia").val()),


            ItemCode: PE.Codigo,
            idCategoria: PE.idCategoria,
            idListaPrecio: parseFloat($("#ListaSeleccionado").val()),
            FechaVen: $("#FechaVen").val(),
            Fecha: $("#FechaVig").val(),
            PrecioFinal: parseFloat($("#inputFinal").val()),
            PrecioAnterior: parseFloat($("#inputPrecio").val()),
            Moneda: $("#selectMoneda").val(),

            PrecioUnitario: parseFloat($("#inputPrecio").val())




        };




        for (var i = 0; i < ProdCadena.length; i++) {




            if (PE.Codigo == ProdCadena[i].idProducto) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ya se ingreso el mismo producto en otra línea '

                })
                Duplicado = true;
                return false;
            } else {
                Duplicado = false;
            }
        }



        var PromoFechaX = Producto.FechaVen;
        var fecha = new Date(PromoFechaX + 'T00:00:00');
        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1;
        var anio = fecha.getFullYear();


        dia = dia < 10 ? '0' + dia : dia;
        mes = mes < 10 ? '0' + mes : mes;

        var fechaFormateada = dia + '/' + mes + '/' + anio;
        var PromoFechaHoraX = fechaFormateada;

        if (Producto.PrecioFinal < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor a 0'

            })
        }
        if (Producto.PrecioFinal == PE.PrecioUnitario && PE.PrecioUnitario == Producto.PrecioAnterior) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser menor que el Precio Unitario' + ' ' + PE.PrecioUnitario

            })
        }

        if (Producto.PrecioFinal == Producto.PrecioAnterior && PE.PrecioUnitario != Producto.PrecioAnterior) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser menor que el Precio Unitario' + ' ' + Producto.PrecioAnterior

            })
        }
        if (Producto.FechaVen < fechaHoyX) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Fecha invalida, la fecha de vencimiento tiene que ser menor a la de hoy '

            })









        } else if (Duplicado == false && Fechabool == false && Producto.PrecioFinal > 0 && (Producto.PrecioFinal != PE.PrecioUnitario || Producto.PrecioFinal != Producto.PrecioAnterior) && PromoFechaHoraX >= fechaHoy) {










            ProdCadena.push(Producto);

            RellenaTabla();

            $("#ProductoSeleccionado").val("0").trigger('change.select2');
        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error: ' + e

        })
    }








}

function AgregarClienteTabla() {
    try {


        var id = parseFloat($("#ClienteSeleccionado").val()),

            Duplicado = false;



        var Cliente =
        {


            idPromocion: 0,

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
function RellenaTabla() {
    try {
        var html = "";
        $("#tbody").html(html);


        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

        var PrecioFinal = $("#inputFinal").val();

        if (ProdCadena.length > 0) {
            $("#ListaSeleccionado").prop("disabled", true);
        } else {
            $("#ListaSeleccionado").prop("disabled", false);
        }

        for (var i = 0; i < ProdCadena.length; i++) {
            var PE = Productos.find(a => a.Codigo == ProdCadena[i].idProducto);



            var TotalGanancia = (ProdCadena[i].TotalLinea - ProdCadena[i].TotalImpuesto);
            html += "<tr>";

            html += "<td> " + (i + 1) + " </td>";

            html += "<td > " + ProdCadena[i].Descripcion + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PrecioAnterior).toFixed(2)) + " </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangePrecioProducto(" + i + ")' type='number' id='" + i + "_Prod3' class='form-control'   value= '" + parseFloat(ProdCadena[i].PrecioFinal).toFixed(2) + "' min='1'/> </td>";


            html += "<td > " + ProdCadena[i].Categoria + " </td>";
            /*    html += "<td class='text-center'> <input onchange='javascript: onChangeFechaProducto(" + i + ")' type='date' id='" + i + "_Prod4' class='form-control'   value= '" +ProdCadena[i].FechaVen + "' min='1'/> </td>";*/




            if (ProdCadena[i].Moneda == "CRC") {
                var Costo = PE.Costo;
                if (retornaMargenGanancia(ProdCadena[i].PrecioFinal, Costo) > 0) {
                    html += "<td class='text-right' style='background-color:  #EFFFE9' id='" + i + "_ProdG'> " + formatoDecimal(retornaMargenGanancia(ProdCadena[i].PrecioFinal, Costo).toFixed(2)) + "%" + " </td>";
                }
                else {
                    html += "<td class='text-right' style='background-color:#FFE9E9' id='" + i + "_ProdG'> " + formatoDecimal(retornaMargenGanancia(ProdCadena[i].PrecioFinal, Costo).toFixed(2)) + "%" + " </td>";
                }

            } else {
                var Costo = (PE.Costo / TipodeCambio.TipoCambio);
                if (retornaMargenGanancia(ProdCadena[i].PrecioFinal, Costo) > 0) {
                    html += "<td class='text-right' style='background-color:  #EFFFE9' id='" + i + "_ProdG'> " + formatoDecimal(retornaMargenGanancia(ProdCadena[i].PrecioFinal, Costo).toFixed(2)) + "%" + " </td>";
                } else {
                    html += "<td class='text-right' style='background-color:#FFE9E9' id='" + i + "_ProdG'> " + formatoDecimal(retornaMargenGanancia(ProdCadena[i].PrecioFinal, Costo).toFixed(2)) + "%" + " </td>";
                }
            }




            html += "<td class='text-center'> <a class='fa fa-trash' onclick='javascript:EliminarProducto(" + i + ") '> </a> </td>";





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

function onChangePrecioProducto(i) {
    try {

        var PE = Productos.find(a => a.Codigo == ProdCadena[i].idProducto && a.idListaPrecios == ProdCadena[i].idListaPrecio);

        ProdCadena[i].PrecioFinal = parseFloat($("#" + i + "_Prod3").val()).toFixed(2);

        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

        if (ProdCadena[i].PrecioAnterior > ProdCadena[i].PrecioFinal && ProdCadena[i].PrecioFinal > 0) {
            var input = $("#" + i + "_ProdG");




            if (Pais == "C") {
                if (ProdCadena[i].Moneda == "CRC") {
                    var Ganancia = retornaMargenGanancia(ProdCadena[i].PrecioFinal, PE.Costo);

                    $("#" + i + "_ProdG").val(Ganancia.toFixed(2));
                    $("#" + i + "_ProdG").text(Ganancia.toFixed(2));
                    if (Ganancia > 0) {
                        input.css('background-color', '#EFFFE9')
                    } else {
                        input.css('background-color', '#FFE9E9')
                    }
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    var Ganancia = retornaMargenGanancia(ProdCadena[i].PrecioFinal, Costo);
                    $("#" + i + "_ProdG").val(Ganancia.toFixed(2));

                    $("#" + i + "_ProdG").text(Ganancia.toFixed(2));
                    if (Ganancia > 0) {
                        input.css('background-color', '#EFFFE9')
                    } else {
                        input.css('background-color', '#FFE9E9')
                    }
                } 

            } else {
                var Costo = PE.Costo;
                var Ganancia = retornaMargenGanancia(ProdCadena[i].PrecioFinal, Costo);
                $("#" + i + "_ProdG").val(Ganancia.toFixed(2));

                $("#" + i + "_ProdG").text(Ganancia.toFixed(2));
                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
            }
        }
        else if (ProdCadena[i].PrecioFinal <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor a 0'

            })
            ProdCadena[i].PrecioFinal = parseFloat(ProdCadena[i].PrecioAnterior);


            parseFloat($("#" + i + "_Prod3").val(ProdCadena[i].PrecioAnterior)).toFixed(2);

        }
        else if (ProdCadena[i].PrecioAnterior < ProdCadena[i].PrecioFinal) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser menor  a ' + ' ' + ProdCadena[i].PrecioAnterior

            })
            ProdCadena[i].PrecioFinal = parseFloat(ProdCadena[i].PrecioAnterior);

            parseFloat($("#" + i + "_Prod3").val(ProdCadena[i].PrecioAnterior)).toFixed(2);


        }






    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }
}
//Metodo Viejo
function onChangeFechaProducto(i) {
    try {

        var PE = ProdClientes.find(a => a.Codigo == ProdCadena[i].idProducto);

        ProdCadena[i].FechaVen = $("#" + i + "_Prod4").val();
        var fechaHoy = $.datepicker.formatDate('yy-mm-dd', new Date());


        if (ProdCadena[i].FechaVen < fechaHoy) {

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Fecha invalida, la fecha de vencimiento tiene que ser menor a la de hoy '

            })
            ProdCadena[i].FechaVen = fechaHoy;


            $("#" + i + "_Prod4").val(fechaHoy);




        }








    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }
}
//
function onChangeFecha() {
    try {



        var FechaVen = $("#FechaVen").val();
        var fechaHoy = $.datepicker.formatDate('yy-mm-dd', new Date());


        if (FechaVen < fechaHoy) {

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Fecha invalida, la fecha de vencimiento tiene que ser mayor o igual a la de hoy '

            })
            FechaVen = fechaHoy;


            $("#FechaVen").val(fechaHoy);




        }








    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }
}

function onChangeFechaVig() {
    try {



        var FechaVig = $("#FechaVig").val();
        var fechaHoy = $.datepicker.formatDate('yy-mm-dd', new Date());


        if (FechaVig < fechaHoy) {

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Fecha invalida, la fecha de vigencia tiene que ser mayor a la de hoy '

            })
            FechaVig = fechaHoy;


            $("#FechaVig").val(fechaHoy);




        }








    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }
}

function EliminarProducto(i) {
    try {
        var Producto = ProdCadena[i];
        var PE = ProdClientes.find(a => a.Codigo == ProdCadena[i].idProducto);



        ProdCadena.splice(i, 1);



        RellenaTabla();
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
//function RellenaTabla() {
//    try {
//        var html = "";
//        $("#tbody").html(html);


//        for (var i = 0; i < ProdCadena.length; i++) {
//            html += "<tr>";


//            html += "<td > " + ProdCadena[i].codigo + "-" + ProdCadena[i].nombre + " </td>";








//            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].precioUnitario).toFixed(2)) + " </td>";

//            html += "<td class='text-center'> <input onchange='javascript: onChangeMonto(" + i + ")' type='number' id='" + i + "_Fac' class='form-control'   value= '0' min='1'/>  </td>";

//            html += "<td > " + 0 + " </td>";

//            html += "</tr>";


//        }


//        $("#tbody").html(html);

//    } catch (e) {
//        Swal.fire({
//            icon: 'error',
//            title: 'Oops...',
//            text: 'Error ' + e

//        })
//    }

//}

function onChangeMoneda() {
    try {



        var Moneda = $("#selectMoneda").val();
        var idListaPrecio = $("#ListaSeleccionado").val();
        for (var i = 0; i < ProdCadena.length; i++) {


            if (ProdCadena[i].Moneda != Moneda) {
                var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

                if (Moneda != "CRC") {

                    ProdCadena[i].Moneda = Moneda;
                    ProdCadena[i].PrecioFinal = ProdCadena[i].PrecioFinal / TipodeCambio.TipoCambio;
                    ProdCadena[i].PrecioAnterior = ProdCadena[i].PrecioAnterior / TipodeCambio.TipoCambio;






                } else {

                    ProdCadena[i].Moneda = Moneda;
                    ProdCadena[i].PrecioFinal = ProdCadena[i].PrecioFinal * TipodeCambio.TipoCambio;
                    ProdCadena[i].PrecioAnterior = ProdCadena[i].PrecioAnterior * TipodeCambio.TipoCambio;


                }


            }



        }


        RellenaTabla();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}
function Generar() {

    try {
        var Moneda = $("#selectMoneda").val();
        var EncPromociones = {
            id: 0,
            idListaPrecio: $("#ListaSeleccionado").val(),
            Moneda: Moneda,
            Nombre: $("#inputNombre").val(),
            Fecha: $("#FechaVig").val(),
            FechaVencimiento: $("#FechaVen").val(),
            FechaCreacion: $("#Fecha").val(),
            idUsuarioCreador: 0,
            Detalle: ProdCadena,
            Clientes: ProdCadenaC
        }

        if (validarPromocion(EncPromociones)) {
            Swal.fire({
                title: '¿Desea guardar la promoción?',
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


                    $.ajax({
                        type: 'POST',

                        url: $("#urlGenerar").val(),
                        dataType: 'json',
                        data: { recibidos: EncPromociones },
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json.promocion);
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

function validarPromocion(e) {
    try {



        if (e.Nombre == "" || e.Nombre == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta el nombre'

            })
            return false;
        }
        else if (e.FechaVencimiento == "" || e.FechaVencimiento == null) {
            return false;
        }
        else if (e.Detalle.length == 0 || e.Detalle == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, por favor agregue lineas a la promoción'

            })
            return false;
        }
        else if (e.Fecha > e.FechaVencimiento) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, la fecha de vigencia no puede ser mayor a la de vencimiento'

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
function RellenaCampos(i) {
    try {
        var item = $("#spanItem_" + i).text();
        var itemCat = $("#spanCat_" + i).text();

        var itemCode = item.split(" - ")[0];
        var Porcentaje = parseFloat($("#Porcentaje_" + i).val());
        var Prod = ProdCadena.find(a => a.Codigo == itemCode && a.idCategoria == itemCat);
        if (PrecioXLista != null) {
            if (PrecioXLista.find(a => a.idProducto == Prod.id) == undefined) {
                var cuerpo =
                {
                    idProducto: Prod.id,
                    idListaPrecio: Prod.idListaPrecios,
                    idCategoria: Prod.idCategoria,
                    Porcentaje: Porcentaje
                };

                PrecioXLista.push(cuerpo);
            } else {
                //agregar progra para editar
                var indexOfPrecioxLista = PrecioXLista.indexOf(PrecioXLista.find(a => a.idProducto == Prod.id));

                PrecioXLista[indexOfPrecioxLista].Porcentaje = Porcentaje;
            }
        } else {
            PrecioXLista = [];
            var cuerpo =
            {
                idProducto: Prod.id,
                idListaPrecio: Prod.idListaPrecios,
                idBodega: Prod.idBodega,
                Porcentaje: Porcentaje
            };

            PrecioXLista.push(cuerpo);
        }



    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar facturas:  ' + e

        })
    }
}
