using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MPOrdenes.Models
{
    public class DetOrdenesCompraViewModel
    {
       
        public int DocEntry { get; set; }
        
        public int LineNum { get; set; }
        public string CodPro { get; set; }
        public string NombreProducto { get; set; }
        public decimal Cantidad { get; set; }
        public string Almacen { get; set; }
        public decimal PrecioUnitario { get; set; }
        public string Status { get; set; }

    }
}
