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
var ListaPrecios = [];
var Categorias = [];
var Duplicado = false;
var TipoCambio = [];

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
function onChangeListaPrecio() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idListaPrecio = $("#ListaSeleccionado").val();

        var Lista = ListaPrecios.find(a => a.id == idListaPrecio);


        if (idCategoria != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idListaPrecios == idListaPrecio);

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



            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idListaPrecios == idListaPrecio);

            RellenaProductos();
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


            html += "<option value='" + ProdClientes[i].Codigo + "' > " + ProdClientes[i].Codigo + " - " + ProdClientes[i].Nombre + " -  Precio: " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2))  + " </option>";
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

        var Producto = ProdClientes.find(a => a.Codigo == idProducto);

        var idCategoria = $("#CategoriaSeleccionado").val();




        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");


        if (Producto != undefined) {
            var Categoria = Categorias.find(a => a.id == Producto.idCategoria);
            $("#inputPrecio").val(parseFloat(Producto.PrecioUnitario));
            $("#inputCosto").val(parseFloat(Producto.Costo));
            $("#inputFinal").val(parseFloat(Producto.PrecioUnitario));
            $("#inputNomPro").val(Producto.Nombre);
            $("#inputNomCat").val(Categoria.Nombre);



            if (Producto.Moneda == "CRC") {
                var Ganancia = retornaMargenGanancia(Producto.PrecioUnitario, Producto.Costo);
                $("#inputGanancia").val(Ganancia);

            } else {
                var Costo = Producto.Costo / TipodeCambio.TipoCambio;
                var Ganancia = retornaMargenGanancia(Producto.PrecioUnitario, Costo);
                $("#inputGanancia").val(Ganancia);

            }



            $("#MonedaProducto").val(Producto.Moneda);
        } else {


            $("#inputPrecio").val(0);
            $("#inputGanancia").val(0);
            $("#inputCosto").val(0);
            $("#inputFinal").val(0);
            $("#inputNomPro").val("");
            $("#inputNomCat").val("");
            $("#impuesto").val(0);
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

        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");


        if (Producto.PrecioUnitario < PrecioFinal) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser menor  a ' + ' ' + Producto.PrecioUnitario

            })
            parseFloat($("#inputFinal").val(Producto.PrecioUnitario));
        } else {
            if (Producto.Moneda == "CRC") {
                var Ganancia = retornaMargenGanancia(PrecioFinal, Producto.Costo);
                $("#inputGanancia").val(Ganancia);

            } else {
                var Costo = Producto.Costo / TipodeCambio.TipoCambio;
                var Ganancia = retornaMargenGanancia(PrecioFinal, Costo);
                $("#inputGanancia").val(Ganancia);

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
        var PE = ProdClientes.find(a => a.Codigo == id);
        Duplicado = false;


        var Producto =
        {
            idEncabezado: 0,
            Descripcion: PE.Codigo + " - " + PE.Nombre,
            idProducto: PE.Codigo,
            Moneda: PE.Moneda,



            PrecioUnitario: parseFloat($("#inputPrecio").val()),
            PrecioFinal: parseFloat($("#inputFinal").val()),
            Ganancia: parseFloat($("#inputGanancia").val()),

            FechaVen: $("#FechaVen").val()
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



        if (Producto.PrecioFinal < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor o igual a ' + ' ' + PE.PrecioUnitario - PE.Costo

            })









        } else if (Duplicado == false) {










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

function RellenaTabla() {
    try {
        var html = "";
        $("#tbody").html(html);


        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

        var PrecioFinal = $("#inputFinal").val();

        for (var i = 0; i < ProdCadena.length; i++) {
            var PE = Productos.find(a => a.Codigo == ProdCadena[i].idProducto);
            if ((PE.PrecioUnitario - PE.Costo) < PrecioFinal) {


                var TotalGanancia = (ProdCadena[i].TotalLinea - ProdCadena[i].TotalImpuesto);
                html += "<tr>";

                html += "<td> " + (i + 1) + " </td>";

                html += "<td > " + ProdCadena[i].Descripcion + " </td>";
                html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PrecioUnitario).toFixed(2)) + " </td>";
                html += "<td class='text-center'> <input onchange='javascript: onChangePrecioProducto(" + i + ")' type='number' id='" + i + "_Prod3' class='form-control'   value= '" + parseFloat(ProdCadena[i].PrecioFinal).toFixed(2) + "' min='1'/> </td>";


                html += "<td class='text-right'> " + ProdCadena[i].FechaVen + " </td>";



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

            } else {




            }

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

        var PE = ProdClientes.find(a => a.Codigo == ProdCadena[i].idProducto);

        ProdCadena[i].PrecioFinal = parseFloat($("#" + i + "_Prod3").val()).toFixed(2);

        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

        if (PE.PrecioUnitario > ProdCadena[i].PrecioFinal && ProdCadena[i].PrecioFinal > 0) {






            if (PE.Moneda == "CRC") {
                var Ganancia = retornaMargenGanancia(ProdCadena[i].PrecioFinal, PE.Costo);
                $("#" + i + "_ProdG").val(Ganancia.toFixed(2));
                $("#" + i + "_ProdG").text(Ganancia.toFixed(2));
            } else {
                var Costo = PE.Costo / TipodeCambio.TipoCambio;
                var Ganancia = retornaMargenGanancia(ProdCadena[i].PrecioFinal, PE.Costo);
                $("#" + i + "_ProdG").val(Ganancia.toFixed(2));

                $("#" + i + "_ProdG").text(Ganancia.toFixed(2));

            }
        }
        else if (ProdCadena[i].PrecioFinal <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor a 0'

            })
            ProdCadena[i].PrecioFinal = PE.PrecioUnitario;


            parseFloat($("#" + i + "_Prod3").val(PE.PrecioUnitario)).toFixed(2);

        }
        else if (PE.PrecioUnitario < ProdCadena[i].PrecioFinal) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser menor  a ' + ' ' + PE.PrecioUnitario

            })
            ProdCadena[i].PrecioFinal = PE.PrecioUnitario;

            parseFloat($("#" + i + "_Prod3").val(PE.PrecioUnitario)).toFixed(2);


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
