using System;

namespace NOVAAPP.Models
{
    public class SubCategoriasViewModel
    {
        public int id { get; set; }
        public int idCategoria { get; set; }
        public string Nombre { get; set; }
        public bool ProcesadoSAP { get; set; }
        public DateTime FechaActualizacion { get; set; }
    }
}
