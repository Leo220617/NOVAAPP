
$(document).ready(function () {
    let barcode = "";
    let timeout = null;
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

    //$("#ProductoSeleccionado").select2({
    //    matcher: matchCustom
    //});
    jQuery(document).ready(function ($) {
        const input = document.getElementById('ProductoSeleccionado');
        const contenedor = document.getElementById('resultadosProducto');
        Recuperar();
    });

    $(document).on('keydown', function (e) {
        // Ignora teclas especiales (Shift, Ctrl, Alt, etc.)
        if (e.key.length > 1) return;

        // Acumula caracteres
        barcode += e.key;

        // Reinicia temporizador en cada pulsaci�n
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            if (barcode.length >= 6) { // Ajusta la longitud m�nima del c�digo
                console.log("Llego " + barcode);
                processBarcode(barcode); // Procesa el c�digo detectado
            }
            barcode = ""; // Reinicia para la siguiente lectura
        }, 50); // Intervalo corto para capturar la entrada r�pida del esc�ner
    });

    $(document).ready(function () {


    });


});

var Productos = [];
var ProdClientes = [];
var ProdCadena = [];
var Categorias = [];
var Duplicado = false;
function processBarcode(code) {
    if (/^\d+$/.test(code)) {  // Verifica que el c�digo contenga solo n�meros (aj�stalo seg�n tu c�digo de barras)

        $("#textoEscaneado").val(code)

        var Producto = ProdClientes.find(a => a.CodBarras.includes(code));



        if (Producto != undefined) {

            $("#ProductoSeleccionado").val(Producto.id);

            onChangeProducto();
            var Barras = true;
            AgregarProductoTabla(Barras);


        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Código inexistente '

            })
        }
    }
}




function Recuperar() {
    try {


        Productos = JSON.parse($("#Productos").val());
        Categorias = JSON.parse($("#Categorias").val());

        RellenaCategorias();


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

function onChangeCategoria() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();



        var Categoria = Categorias.find(a => a.id == idCategoria);


        if (idCategoria != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria);
            RellenaProductos();
        } 

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar categoria ' + e

        })
    }


}
function RellenaProductos() {
    try {
        var html = "";
        ProdClientes = Productos;

        // Limpia el contenedor de resultados
        const contenedor = $("#resultadosProducto");
        contenedor.html("");


        // Genera los resultados para el buscador
        const productosBusqueda = ProdClientes.map(prod => {


            const Bodegas = Bodega.find(a => a.id === prod.idBodega) || {};



            const stock = parseFloat(prod.Stock).toFixed(2);


            return {
                id: prod.id,
                Codigo: prod.Codigo,
                Nombre: prod.Nombre,
                Stock: stock,
                Bodega: Bodegas.CodSAP || "N/A",
                searchable: `${prod.Codigo} ${prod.Nombre}`.toLowerCase(),
            };
        });

        // Configura el buscador
        $("#buscadorProducto").off("input").on("input", function () {
            const texto = $(this).val().trim().toLowerCase().replace(/\*/g, " ");
            const palabras = texto.split(/\s+/).filter(Boolean);

            const resultados = productosBusqueda.filter(p =>
                palabras.every(palabra => p.searchable.includes(palabra))
            );

            // Muestra los resultados
            contenedor.html(
                resultados
                    .map(
                        (p, index) => `
            <div onclick="seleccionarProducto(${index})">
          ${p.Codigo} - ${p.Nombre} - Stock: ${p.Stock} - BOD: ${p.Bodega}
            </div>`
                    )
                    .join("")
            );

            contenedor.toggle(resultados.length > 0);
            window.resultadosBusqueda = resultados;
        });

        // Configura la selección de un producto
        window.seleccionarProducto = function (index) {
            const producto = window.resultadosBusqueda[index];

            var valor = `${producto.Codigo} - ${producto.Nombre}  - Stock: ${producto.Stock} - BOD: ${producto.Bodega}`
            $("#buscadorProducto").val(valor);
            $("#ProductoSeleccionado").val(producto.id);
            onChangeProducto();
            contenedor.hide();
        };
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

        var Producto = ProdClientes.find(a => a.id == idProducto);




        if (Producto != undefined) {


            $("#inputNomPro").val(Producto.Nombre);
     

        } else {

            $("#inputNomPro").val("");

        }
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


        for (var i = 0; i < ProdCadena.length; i++) {
            var PE = Productos.find(a => a.id == ProdCadena[i].idProducto);
            html += "<tr>";

            html += "<td> " + (i + 1) + " </td>";

            html += "<td > " + ProdCadena[i].Descripcion + " </td>";

        
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

function AgregarProductoTabla(Barras) {
    try {
        console.log("Llego a AgregarProductoTabla");

        var id = $("#ProductoSeleccionado").val();

        var PE = ProdClientes.find(a => a.id == id);


        var Producto =
        {
            idEncabezado: 0,
            Descripcion: PE.Codigo + " - " + $("#inputNomPro").val(),
            ItemCode: PE.Codigo,
            NombreProducto: $("#inputNomPro").val(),
            NumLinea: 0


        };


        for (var i = 0; i < ProdCadena.length; i++) {


            if (PE.Codigo == ProdCadena[i].ItemCode) {
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
 

        if (Producto.ItemCode == ProdCadena[i].ItemCode) {


  
                ProdCadena.push(Producto);
         





            RellenaTabla();
            $("#buscadorProducto").val("");
            $("#ProductoSeleccionado").val("");

            onChangeProducto();

        }


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        })
    }








}


function EliminarProducto(i) {
    try {
        var Producto = ProdCadena[i];
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

//Generar
function Generar() {

    try {


        var EncRelacion = {
            id: 0,
            Nombre: $("#inputNombre ").val(),
            idCategoria: $("#CategoriaSeleccionado ").val(),
            Detalle: ProdCadena

        }

        if (validarOferta(EncRelacion)) {
            Swal.fire({
                title: '¿Desea guardar la relación?',
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
                    var jsonString = JSON.stringify(EncRelacion);
                    // Comprimir la cadena JSON utilizando gzip
                    var compressedData = pako.gzip(jsonString);

                    // Convertir los datos comprimidos a un ArrayBuffer (opcional, depende de tu caso de uso)
                    var compressedArrayBuffer = compressedData.buffer;

                    $.ajax({
                        type: 'POST',

                        url: $("#urlGenerar").val(),
                        contentType: 'application/json',
                        data: compressedArrayBuffer,
                        processData: false,
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json);
                            if (json.success == true) {
                                // $("#divProcesando").modal("hide");
                                Swal.fire({
                                    title: "Ha sido generado con éxito",

                                    icon: 'success',
                                    showCancelButton: false,
                                    allowOutsideClick: false,  // impide cerrar haciendo clic fuera
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
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.Oferta

                                })
                            }
                        },

                        beforeSend: function () {
                            $("#divProcesando").modal("show");

                        },
                        complete: function () {
                            setTimeout(function () {
                                $("#divProcesando").modal("hide");
                            }, 100);
                        },
                        error: function (error) {
                            // $("#divProcesando").modal("hide");

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
//

function validarOferta(e) {
    try {



        if (e.Detalle.length == 0) {

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El pedido no tiene productos ingresados '

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

