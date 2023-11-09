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

function Recuperar() {
    try {


        PrecioXLista = JSON.parse($("#PrecioXLista").val());
        ListaPrecios = JSON.parse($("#ListaPrecios").val());
        Productos = JSON.parse($("#Productos").val());



        RellenaProductos();



    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }

}

function RellenaProductos() {
    try {


        ProdCadena = ProdClientes;

    

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


        for (var i = 0; i < ProdCadena.length; i++) {
            html += "<tr>";


            html += "<td > " + ProdCadena[i].codigo + "-" + ProdCadena[i].nombre + " </td>";








            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].precioUnitario).toFixed(2)) + " </td>";

            html += "<td class='text-center'> <input onchange='javascript: onChangeMonto(" + i + ")' type='number' id='" + i + "_Fac' class='form-control'   value= '0' min='1'/>  </td>";

            html += "<td > " + 0 + " </td>";

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

function RellenaCampos(i) {
    try {
        var item = $("#spanItem_" + i).text();
        var itemBod = $("#spanBod_" + i).text();
       
        var itemCode = item.split(" - ")[0];
        var Porcentaje = parseFloat($("#Porcentaje_" + i).val());
        var Prod = ProdCadena.find(a => a.Codigo == itemCode && a.idBodega == itemBod );
        if (PrecioXLista != null) {
            if (PrecioXLista.find(a => a.idProducto == Prod.id) == undefined) {
                var cuerpo =
                {
                    idProducto: Prod.id,
                    idListaPrecio: Prod.idListaPrecios,
                    idBodega: Prod.idBodega,
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

