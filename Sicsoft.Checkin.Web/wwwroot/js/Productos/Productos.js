

$(document).ready(function () {
    jQuery(document).ready(function ($) {

    });



    $(document).ready(function () {
        Recuperar();
    });


});
var Productos = [];
function Recuperar() {
    try {
        Productos = JSON.parse($("#Productos").val());





    } catch (e) {
        console.log(e);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}
function InsertarSAP() {
    try {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: '@Url.Page("Index", "InsertarSAP")',
            data: {},
            success: function (result) {
                $("#divProcesando").modal("hide");

                if (result == false) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ha ocurrido un error al intentar insertar a SAP'

                    })

                } else {
                    Swal.fire({
                        title: "Ha sido insertado a SAP con éxito",

                        icon: 'success',
                        showCancelButton: false,
                        customClass: {
                            confirmButton: 'swalBtnColor',

                        },
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    })
                }
            },
            beforeSend: function () {
                $("#divProcesando").modal("show");
            }
        })
    } catch (e) {
        console.log(e);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}


var ids = 0;
function onClickModalByCardCode() {
    try {
        var id = document.getElementById("CardCode").value;
        ids = id;
        Swal.fire({
            title: '¿Desea activar/desactivar este producto?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: `Aceptar`,
            denyButtonText: `Cancelar`,
            customClass: {
                confirmButton: 'swalBtnColor',
                denyButton: 'swalDeny'
            },
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                InsertarSAPByCardCode();

            }
        })
    } catch (e) {
        console.log(e);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }




}



function InsertarSAPByCardCode() {
    try {

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: '@Url.Page("Index", "InsertarSAPByCardCode")',
            data: { id: ids },
            success: function (result) {
                $("#divProcesando").modal("hide");

                if (result == false) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ha ocurrido un error al intentar Desactivar/Activar este producto'

                    })

                } else {
                    Swal.fire({
                        title: "Ha sido guardado con éxito",

                        icon: 'success',
                        showCancelButton: false,
                        customClass: {
                            confirmButton: 'swalBtnColor',

                        },
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    })
                }
            },
            beforeSend: function () {
                $("#divProcesando").modal("show");
            }
        })
    } catch (e) {
        console.log(e);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }

}

function AbrirModalAgregarCliente() {

    try {
        $("#ModalAgregarCliente").modal("show");


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function formatoDecimal(numero) {
    var number = numero;

    // En el alemán la coma se utiliza como separador decimal y el punto para los millares
    return new Intl.NumberFormat("en-US").format(number);
}
function ImprimirEtiqueta(id) {
    try {
        var MiProducto = Productos.find(a => a.id == id);
        const htmlEtiqueta = "<!DOCTYPE html> <html lang='es'> <head> <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <title>Etiquetas de Productos</title> <style> .product-description { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-size: 16px; } </style> </head> <body style='font-family: Arial, sans-serif; text-align: center; margin: 20px;'> <center> <!-- Etiqueta 1 --> <div style='border: 2px solid #333; padding: 20px; display: inline-block; width: 50%; height: 220px; margin: 10px; box-sizing: border-box; position: relative; font-size: 20px;'> <!-- Espacio para el logo --> <div> <!-- Aquí puedes incluir la etiqueta <img> con la ruta de tu logo --> <img style='width: 120px; height: auto; float: left; margin-right: 20px;' src='img/Novagro.png' alt='Logo del producto 1'> </div> <!-- Información del producto --> <div style='text-align: left; margin-top: 10px;'> <!-- Código del producto --> <div style='margin-top: 6px; text-align: left;'> <p style='font-size: 18px;'><b>Código:</b> @Codigo</p> </div> <!-- Nombre del producto --> <div style='margin-top: 10px; text-align: left;'> <p class='product-description'><b>Art:</b>  @Descripcion</p> </div> <!-- Precio del producto --> <div style='margin-top: 10px; text-align: left;'> <p style='font-size: 18px;'><b> @PrecioUnitario</b></p> </div> <div> <!-- Aquí puedes incluir la etiqueta <img> con la ruta de tu logo --> <img style='width: 60px; height: auto; float: right; margin-left: 20px; margin-top: -35px;' src='img/logopeque.png' alt='Logo del producto 1'> </div> </div> <!-- Barra verde en la parte inferior --> <div style='background-color: #74BA3E; height: 10px; position: absolute; bottom: 0; left: 0; width: 100%;'></div> </div> </center> </body> </html>";

        var ventana = window.open('', 'PRINT', 'height=400,width=600');
        var texto = htmlEtiqueta;
        texto = texto.replace("@Codigo", MiProducto.Codigo);
        texto = texto.replace("@Descripcion", MiProducto.Nombre);
        if (MiProducto.Moneda == "CRC") {
            texto = texto.replace("@PrecioUnitario", "₡" + formatoDecimal(MiProducto.PrecioUnitario));
        } else {
            texto = texto.replace("@PrecioUnitario", "$" + formatoDecimal(MiProducto.PrecioUnitario));
        }
     













        ventana.document.write(texto);
        ventana.document.close();
        ventana.focus();
        ventana.print();
        ventana.close();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }
}