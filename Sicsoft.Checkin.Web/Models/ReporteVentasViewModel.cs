using System;

namespace NOVAAPP.Models
{
    public class ReporteVentasViewModel
    {
     
        public int idEncabezado { get; set; }

        public string CodigoCliente { get; set; }

        public string NombreCliente { get; set; }

        public string CodigoProducto { get; set; }
        public string NombreProducto { get; set; }

        public decimal Cantidad { get; set; }
        public string TipoDocumento { get; set; }
        public DateTime Fecha { get; set; }

    }
}