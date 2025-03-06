using System;

namespace NOVAAPP.Models
{
    public class BitacoraMinimosViewModel
    {
        public int id { get; set; }
        public int idCategoria { get; set; }
        public int idBodega { get; set; }
        public string CodigoProducto { get; set; }
        public string NombreProducto { get; set; }
        public decimal Minimo { get; set; }
        public decimal Stock { get; set; }
        public DateTime Fecha { get; set; }
    }
}
