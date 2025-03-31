using System;

namespace NOVAAPP.Models
{
    public class LogsViewModel
    {
        public int idEncabezado { get; set; }
        public int idFirma { get; set; }
        public string Tipo { get; set; }
        public DateTime Fecha { get; set; }
        public string Detalle { get; set; }
    }
}
