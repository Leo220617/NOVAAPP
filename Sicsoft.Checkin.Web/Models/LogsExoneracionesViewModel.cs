using System;

namespace NOVAAPP.Models
{
    public class LogsExoneracionesViewModel
    {
        public int id { get; set; }
        public int idExoneracion { get; set; }
        public string Accion { get; set; }
        public DateTime Fecha { get; set; }
        public string Usuario { get; set; }
        public string DatosAntes { get; set; }
        public string DatosDespues { get; set; }
    }
}
