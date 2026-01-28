using System.Collections.Generic;

namespace NOVAAPP.Models
{
    public class RutasFacViewModel
    {
        public int id { get; set; }
        public string Nombre { get; set; }
        public decimal Precio { get; set; }
        public decimal Km { get; set; }
        public ClientesRutasViewModel[] Clientes { get; set; }
    }
}
