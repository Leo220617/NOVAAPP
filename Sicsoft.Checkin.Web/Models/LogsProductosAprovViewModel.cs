using System;

namespace NOVAAPP.Models
{
    public class LogsProductosAprovViewModel
    {
        public int id { get; set; }
        public int idProducto { get; set; }
        public int idCategoria { get; set; }
        public int idSubCategoria { get; set; }
        public int idUsuarioModificador { get; set; }
        public decimal Minimo { get; set; }
        public DateTime Fecha { get; set; }
        public string Clasificacion { get; set; }
        public string ItemCode { get; set; }
        public string NombreProducto { get; set; }
    }
}
